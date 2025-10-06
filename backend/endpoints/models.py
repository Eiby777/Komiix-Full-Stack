from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import StreamingResponse, JSONResponse
from dependencies.limiter import limiter
import aiofiles
from dependencies.auth import verify_jwt
from pathlib import Path
from typing import AsyncGenerator
from redis.asyncio import Redis
import hashlib
from loguru import logger
import json
import secrets

router = APIRouter()

redis = Redis(
    host="redis",
    port=6379,
    decode_responses=False,
)

logger.info("Endpoints router loaded")

# Fragment configuration
ENCRYPTED_FRAGMENT_INDEX = 3  # The index of the fragment that should be encrypted

# Primero intentar con rutas de desarrollo local
MODEL_DIR = Path(__file__).parent.parent / "models"
METADATA_FILE = Path(__file__).parent.parent / "config" / "model_metadata.json"

# Si no existe, intentar con rutas de Docker
if not METADATA_FILE.exists():
    MODEL_DIR = Path("/app/models")
    METADATA_FILE = Path("/app/config/model_metadata.json")

FRAGMENTS_DIR = MODEL_DIR / "fragmented_models"
FULL_MODELS_DIR = MODEL_DIR / "full_models"

# Cargar MODEL_METADATA desde archivo JSON
try:
    with open(METADATA_FILE, "r") as f:
        MODEL_METADATA = json.load(f)
    logger.info(f"MODEL_METADATA cargado desde {METADATA_FILE}")
except FileNotFoundError:
    logger.error(f"Archivo de metadatos no encontrado: {METADATA_FILE}")
    raise RuntimeError(f"Archivo de metadatos no encontrado: {METADATA_FILE}")
except json.JSONDecodeError:
    logger.error(f"Error al parsear {METADATA_FILE}")
    raise RuntimeError(f"Error al parsear {METADATA_FILE}")

async def stream_file(file_path: Path, expected_checksum: str = None) -> AsyncGenerator[bytes, None]:
    chunk_size = 1024 * 1024
    hasher = hashlib.sha256()
    try:
        async with aiofiles.open(file_path, mode="rb") as f:
            while True:
                chunk = await f.read(chunk_size)
                if not chunk:
                    break
                hasher.update(chunk)
                yield chunk
        if expected_checksum and hasher.hexdigest() != expected_checksum:
            logger.error(f"Integrity check failed for {file_path}: expected {expected_checksum}, got {hasher.hexdigest()}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="File integrity check failed"
            )
    except FileNotFoundError:
        logger.error(f"File not found: {file_path}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
    except PermissionError:
        logger.error(f"Permission denied accessing file: {file_path}")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied accessing file")
    except Exception as e:
        logger.error(f"Error streaming file {file_path}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

async def get_model_file(model_key: str) -> StreamingResponse:
    if model_key not in MODEL_METADATA:
        logger.error(f"Invalid model requested: {model_key}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid model requested")

    model_info = MODEL_METADATA[model_key]
    if not model_info.get("is_fragmented"):
        file_name = model_info.get("filename", model_info["original_name"])
        version = model_info["version"]
        checksum = model_info["sha256"]
        file_path = FULL_MODELS_DIR / file_name
        cache_key = f"model:{model_key}:{version}"

        # Intentar obtener desde Redis (opcional)
        cached_data = None
        try:
            cached_data = await redis.get(cache_key)
        except Exception as e:
            logger.warning(f"Redis not available, skipping cache check: {str(e)}")

        if cached_data:
            logger.info(f"Cache hit for {file_name}, serving from Redis")
            hasher = hashlib.sha256()
            hasher.update(cached_data)
            actual_checksum = hasher.hexdigest()

            if actual_checksum == checksum:
                # Verificar que el archivo en disco no ha cambiado
                if file_path.exists():
                    async with aiofiles.open(file_path, mode="rb") as f:
                        disk_data = await f.read()
                        disk_hasher = hashlib.sha256()
                        disk_hasher.update(disk_data)
                        disk_checksum = disk_hasher.hexdigest()

                        if disk_checksum != checksum:
                            logger.warning(f"File on disk has changed for {file_name}: expected {checksum}, got {disk_checksum}")
                            try:
                                await redis.delete(cache_key)
                            except Exception as e:
                                logger.warning(f"Redis not available, skipping cache delete: {str(e)}")
                            raise HTTPException(
                                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                detail="File on disk has changed"
                            )

                return StreamingResponse(
                    content=iter([cached_data]),
                    media_type="application/zip",
                    headers={
                        "Content-Disposition": f"attachment; filename={file_name}",
                        "ETag": f"{version}",
                        "Cache-Control": "no-cache",
                    }
                )
            else:
                logger.error(f"Cache integrity check failed for {file_name}: expected {checksum}, got {actual_checksum}")
                try:
                    await redis.delete(cache_key)
                except Exception as e:
                    logger.warning(f"Redis not available, skipping cache delete: {str(e)}")

        # Si no está en cache o la cache está corrupta, servir desde disco
        if not file_path.is_file():
            logger.error(f"Model file not found on disk: {file_path}")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Model file not found")

        try:
            # Verificar integridad del archivo en disco
            async with aiofiles.open(file_path, mode="rb") as f:
                file_data = await f.read()
                hasher = hashlib.sha256()
                hasher.update(file_data)
                actual_checksum = hasher.hexdigest()
                
                if actual_checksum != checksum:
                    logger.error(f"File integrity check failed for {file_name}: expected {checksum}, got {actual_checksum}")
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail="File integrity check failed"
                    )

                # Almacenar en Redis si la verificación es exitosa (opcional)
                try:
                    await redis.set(cache_key, file_data)
                except Exception as e:
                    logger.warning(f"Redis not available, skipping cache storage: {str(e)}")

            return StreamingResponse(
                content=stream_file(file_path, checksum),
                media_type="application/zip",
                headers={
                    "Content-Disposition": f"attachment; filename={file_name}",
                    "ETag": f"{version}",
                    "Cache-Control": "no-cache",
                }
            )
        except Exception as e:
            logger.error(f"Error serving model {file_name}: {str(e)}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error serving model")
    else:
        # Servir fragmentos para modelos fragmentados
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Use fragment endpoints for this model")

@router.get("/model-version/{model_key}", tags=["Metadata"], dependencies=[Depends(verify_jwt)])
@limiter.limit("10/minute")
async def get_model_version(request: Request, model_key: str, payload: dict = Depends(verify_jwt)):
    logger.info(f"User {payload.get('sub')} requested version info for {model_key}")
    if model_key not in MODEL_METADATA:
        logger.error(f"Invalid model requested for version check: {model_key}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid model requested")
    model_info = MODEL_METADATA[model_key]
    logger.info(f"Returning version info for {model_key}: version {model_info['version']}")
    return {
        "model": model_key,
        "version": model_info["version"],
        "original_filename": model_info["original_name"],
        "sha256": model_info["sha256"],
        "is_fragmented": model_info["is_fragmented"]
    }

@router.get("/get-fragment/{model_key}/{fragment_name}", tags=["Fragments"], dependencies=[Depends(verify_jwt)])
@limiter.limit("20/minute")
async def get_fragment(request: Request, model_key: str, fragment_name: str, payload: dict = Depends(verify_jwt)):
    if model_key not in MODEL_METADATA:
        logger.error(f"Invalid model requested: {model_key}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid model requested")

    model_info = MODEL_METADATA[model_key]
    if not model_info.get("is_fragmented"):
        logger.error(f"Model {model_key} is not fragmented")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Model is not fragmented")

    # Verificar que el fragmento pertenece al modelo correcto
    fragment_path = FRAGMENTS_DIR / model_key / "fragments" / fragment_name
    if not fragment_path.exists():
        logger.error(f"Fragment not found: {fragment_path}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Fragment not found")

    if not fragment_name.startswith(f"{model_key}_chunk_"):
        logger.error(f"Fragment {fragment_name} does not belong to model {model_key}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Fragment does not belong to requested model")

    # Obtener el checksum esperado del fragmento
    expected_checksum = None
    for fragment in model_info.get("fragments", []):
        if fragment["filename"] == fragment_name:
            expected_checksum = fragment["sha256"]
            break

    if not expected_checksum:
        logger.error(f"No checksum found for fragment {fragment_name}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="No checksum found for fragment")

    # Verificar la integridad del fragmento
    try:
        async with aiofiles.open(fragment_path, mode="rb") as f:
            content = await f.read()
            hasher = hashlib.sha256()
            hasher.update(content)
            actual_checksum = hasher.hexdigest()
            
            if actual_checksum != expected_checksum:
                logger.error(f"Integrity check failed for fragment {fragment_name}: expected {expected_checksum}, got {actual_checksum}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Fragment integrity check failed"
                )
    except Exception as e:
        logger.error(f"Error verifying fragment integrity: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error verifying fragment integrity")

    return StreamingResponse(
        content=stream_file(fragment_path, expected_checksum),
        media_type="application/octet-stream",
        headers={
            "Content-Disposition": f"attachment; filename={fragment_name}",
            "ETag": f"{model_info['version']}",
            "Cache-Control": "no-cache",
        }
    )

@router.get("/get-model-fragments/{model_key}", tags=["Fragments"], dependencies=[Depends(verify_jwt)])
@limiter.limit("10/minute")
async def get_model_fragments(request: Request, model_key: str, payload: dict = Depends(verify_jwt)):
    logger.info(f"User {payload.get('sub')} requested fragment metadata for {model_key}")
    if model_key not in MODEL_METADATA or not MODEL_METADATA[model_key].get("is_fragmented"):
        logger.error(f"Invalid fragmented model requested: {model_key}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid fragmented model")

    model_info = MODEL_METADATA[model_key]
    fragment_names = [fragment["filename"] for fragment in model_info.get("fragments", [])]
    if not fragment_names:
        logger.error(f"No fragments found for model {model_key}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No fragments found for model")

    # Generar clave de sesión para encriptación
    session_key = f"encryption_key:{model_key}:{payload.get('sub')}:{secrets.token_hex(16)}"
    key_path = FRAGMENTS_DIR / model_key / "key" / f"{model_key}_key.bin"
    try:
        async with aiofiles.open(key_path, mode="rb") as f:
            encryption_key = await f.read()
        try:
            await redis.setex(session_key, 3600, encryption_key)  # Clave válida por 1 hora
        except Exception as e:
            logger.warning(f"Redis not available, skipping session key storage: {str(e)}")
    except FileNotFoundError:
        logger.error(f"Encryption key file not found: {key_path}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Encryption key file not found")
    except Exception as e:
        logger.error(f"Error storing encryption key for {model_key}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error processing encryption key")

    return JSONResponse(content={
        "fragment_names": fragment_names,
        "encrypted_fragment_index": ENCRYPTED_FRAGMENT_INDEX,
        "session_key": session_key
    })

@router.get("/get-encryption-key/{session_key:path}", tags=["Fragments"], dependencies=[Depends(verify_jwt)])
@limiter.limit("10/minute")
async def get_encryption_key(request: Request, session_key: str, payload: dict = Depends(verify_jwt)):
    logger.info(f"User {payload.get('sub')} requested encryption key for session {session_key}")
    try:
        encryption_key = await redis.get(session_key)
        if not encryption_key:
            # Fallback: parse session_key to get model_key and read from file
            parts = session_key.split(':')
            if len(parts) >= 2 and parts[0] == 'encryption_key':
                model_key = parts[1]
                key_path = FRAGMENTS_DIR / model_key / "key" / f"{model_key}_key.bin"
                try:
                    async with aiofiles.open(key_path, mode="rb") as f:
                        encryption_key = await f.read()
                    logger.info(f"Retrieved encryption key from file for {model_key}")
                except FileNotFoundError:
                    logger.error(f"Encryption key file not found: {key_path}")
                    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Encryption key not found")
                except Exception as e:
                    logger.error(f"Error reading encryption key file: {str(e)}")
                    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error retrieving encryption key")
            else:
                logger.error(f"Invalid session key format: {session_key}")
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid session key")
        return StreamingResponse(
            content=iter([encryption_key]),
            media_type="application/octet-stream",
            headers={
                "Content-Disposition": "attachment; filename=key.bin",
                "Cache-Control": "no-cache",
            }
        )
    except Exception as e:
        logger.error(f"Error retrieving encryption key {session_key}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error retrieving encryption key")

@router.get("/get-globes", tags=["Detection"], dependencies=[Depends(verify_jwt)])
@limiter.limit("10/minute")
async def get_globes(request: Request, payload: dict = Depends(verify_jwt)):
    logger.info(f"User {payload.get('sub')} requested globes model")
    return await get_model_file("globes")

@router.get("/get-text", tags=["Detection"], dependencies=[Depends(verify_jwt)])
@limiter.limit("10/minute")
async def get_text(request: Request, payload: dict = Depends(verify_jwt)):
    logger.info(f"User {payload.get('sub')} requested text model")
    return await get_model_file("text")

@router.get("/get-inpainting", tags=["Inpainting"], dependencies=[Depends(verify_jwt)])
@limiter.limit("10/minute")
async def get_inpainting(request: Request, payload: dict = Depends(verify_jwt)):
    logger.info(f"User {payload.get('sub')} requested inpainting model")
    return await get_model_file("inpainting")