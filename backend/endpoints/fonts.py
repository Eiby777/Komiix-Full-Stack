from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import StreamingResponse
from dependencies.limiter import limiter
import aiofiles
from dependencies.auth import verify_jwt
from pathlib import Path
from typing import AsyncGenerator, List, Dict
from redis.asyncio import Redis
import hashlib
from loguru import logger
import json

router = APIRouter()

redis = Redis(
    host="redis",
    port=6379,
    decode_responses=False,
)

logger.info("Fonts router loaded")

# Base directory for font files
# En Docker, las fuentes se montan en /app/fonts
FONT_DIR = Path("/app/fonts")
#FONT_DIR = Path(__file__).parent.parent / "fonts"

# Load font metadata from JSON
# En Docker, el archivo de metadatos está en /app/config
FONT_METADATA_FILE = Path("/app/config/fonts_metadata.json")
#FONT_METADATA_FILE = Path(__file__).parent.parent / "config" / "fonts_metadata.json"    
try:
    with open(FONT_METADATA_FILE, "r", encoding="utf-8") as f:
        FONT_METADATA = json.load(f)
except FileNotFoundError:
    logger.error(f"Font metadata file not found: {FONT_METADATA_FILE}")
    FONT_METADATA = []
except json.JSONDecodeError:
    logger.error(f"Invalid JSON in font metadata file: {FONT_METADATA_FILE}")
    FONT_METADATA = []

async def stream_file(file_path: Path, expected_checksum: str) -> AsyncGenerator[bytes, None]:
    chunk_size = 1024 * 1024  # 1MB chunks
    hasher = hashlib.sha256()
    try:
        async with aiofiles.open(file_path, mode="rb") as f:
            while True:
                chunk = await f.read(chunk_size)
                if not chunk:
                    break
                hasher.update(chunk)
                yield chunk
        if hasher.hexdigest() != expected_checksum:
            logger.error(f"Integrity check failed for {file_path}: expected {expected_checksum}, got {hasher.hexdigest()}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="File integrity check failed"
            )
    except FileNotFoundError:
        logger.error(f"File not found: {file_path}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Font file not found")
    except PermissionError:
        logger.error(f"Permission denied accessing file: {file_path}")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied accessing font file")
    except Exception as e:
        logger.error(f"Error streaming file {file_path}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

async def get_font_file(font_name: str) -> StreamingResponse:
    # Buscar la fuente por nombre en el metadata
    font_info = None
    for font in FONT_METADATA:
        if font["name"].lower() == font_name.lower():
            font_info = font
            break
    
    if not font_info:
        logger.error(f"Invalid font requested: {font_name}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid font requested")

    file_name = font_info["filename"]
    version = font_info["version"]
    checksum = font_info["hash"]
    file_path = FONT_DIR / file_name
    cache_key = f"font:{font_name}:{version}"

    # Intentar obtener la fuente desde Redis
    try:
        cached_data = await redis.get(cache_key)
        if cached_data:
            logger.info(f"Cache hit for {file_name}, serving from Redis")
            hasher = hashlib.sha256()
            hasher.update(cached_data)
            if hasher.hexdigest() == checksum:
                return StreamingResponse(
                    content=iter([cached_data]),
                    media_type="font/woff2",
                    headers={
                        "Content-Disposition": f"attachment; filename={file_name}",
                        "ETag": f"{version}",
                        "Cache-Control": "public, max-age=31536000",  # 1 año para clientes
                    }
                )
            else:
                logger.error(f"Cache integrity check failed for {file_name}: expected {checksum}, got {hasher.hexdigest()}")
                await redis.delete(cache_key)
        else:
            logger.info(f"Cache miss for {file_name}, reading from disk")
    except Exception as e:
        logger.error(f"Redis error while retrieving {file_name}: {e}")

    # Validar que el archivo esté dentro del directorio permitido
    if not file_path.resolve().is_relative_to(FONT_DIR.resolve()):
        logger.error(f"Invalid file path attempted: {file_path}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid file path")

    # Verificar que el archivo exista
    if not file_path.is_file():
        logger.error(f"Font file not found on disk: {file_path}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Font file not found")

    # Leer el archivo completo para almacenar en Redis
    try:
        async with aiofiles.open(file_path, mode="rb") as f:
            file_data = await f.read()

        # Verificar integridad
        hasher = hashlib.sha256()
        hasher.update(file_data)
        computed_checksum = hasher.hexdigest()
        if computed_checksum != checksum:
            logger.error(f"Disk file integrity check failed for {file_name}: expected {checksum}, got {computed_checksum}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="File integrity check failed"
            )

        # Almacenar en Redis por 24 horas
        try:
            await redis.setex(cache_key, 86400, file_data)
            logger.info(f"Successfully cached {file_name} in Redis for 24 hours")
        except Exception as e:
            logger.error(f"Redis error while caching {file_name}: {e}")

        # Servir desde memoria
        logger.info(f"Serving {file_name} from disk")
        return StreamingResponse(
            content=iter([file_data]),
            media_type="font/woff2",
            headers={
                "Content-Disposition": f"attachment; filename={file_name}",
                "ETag": f"{version}",
                "Cache-Control": "public, max-age=31536000",  # 1 año para clientes
            }
        )
    except FileNotFoundError:
        logger.error(f"File not found while reading: {file_path}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Font file not found")
    except PermissionError:
        logger.error(f"Permission denied while reading: {file_path}")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied accessing font file")
    except Exception as e:
        logger.error(f"Error processing file {file_path}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

@router.get("/get-font/{font_name}", tags=["Fonts"], dependencies=[Depends(verify_jwt)])
@limiter.limit("10/minute")
async def get_font(request: Request, font_name: str, payload: dict = Depends(verify_jwt)):
    logger.info(f"User {payload.get('sub')} requested font {font_name}")
    return await get_font_file(font_name)

@router.get("/font-list", tags=["Fonts"], dependencies=[Depends(verify_jwt)])
@limiter.limit("10/minute")
async def get_font_list(request: Request, payload: dict = Depends(verify_jwt)) -> List[Dict]:
    logger.info(f"User {payload.get('sub')} requested font list")
    if not FONT_METADATA:
        logger.error("Font metadata is empty or not loaded")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Font metadata not available")
    
    # Crear lista con solo las propiedades solicitadas
    font_list = [
        {
            "id": font["id"],
            "name": font["name"],
            "filename": font["filename"],
            "version": font["version"]
        }
        for font in FONT_METADATA
    ]
    
    logger.info(f"Returning list of {len(font_list)} fonts")
    return font_list