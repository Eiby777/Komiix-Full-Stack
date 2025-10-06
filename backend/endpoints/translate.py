import logging
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dependencies.limiter import limiter
from dependencies.auth import verify_jwt
from loguru import logger
import httpx
import json
import os
from llama_cpp import Llama

router = APIRouter()

logger.info("Translate router loaded")
LIBRETRANSLATE_URL = os.getenv("LIBRETRANSLATE_URL")
logger.info(f"LibreTranslate URL: {LIBRETRANSLATE_URL}")

# Initialize Llama model for Japanese to English translations
import subprocess

def download_model(model_url, local_path):
    """Download model from Hugging Face if it doesn't exist locally"""
    try:
        logger.info(f"Downloading model from {model_url} to {local_path}")
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(local_path), exist_ok=True)
        # Use curl to download
        result = subprocess.run([
            "curl", "-L", "-o", local_path, model_url
        ], capture_output=True, text=True)
        if result.returncode == 0:
            logger.info(f"Model downloaded successfully to {local_path}")
            return True
        else:
            logger.error(f"Failed to download model: {result.stderr}")
            return False
    except Exception as e:
        logger.error(f"Error downloading model: {e}")
        return False

# Determine model path - try Docker path first, then local path
MODEL_URL = "https://huggingface.co/LiquidAI/LFM2-350M-ENJP-MT-GGUF/resolve/main/LFM2-350M-ENJP-MT-Q8_0.gguf"
DOCKER_MODEL_PATH = "/app/models/LFM2-350M-ENJP-MT-Q8_0.gguf"
LOCAL_MODEL_PATH = os.path.expanduser("~/.cache/komiix/models/LFM2-350M-ENJP-MT-Q8_0.gguf")

if os.path.exists(DOCKER_MODEL_PATH):
    MODEL_PATH = DOCKER_MODEL_PATH
    logger.info("Using Docker model path")
elif os.path.exists(LOCAL_MODEL_PATH):
    MODEL_PATH = LOCAL_MODEL_PATH
    logger.info("Using local cached model path")
else:
    logger.info("Model not found locally, downloading...")
    if download_model(MODEL_URL, LOCAL_MODEL_PATH):
        MODEL_PATH = LOCAL_MODEL_PATH
        logger.info("Using newly downloaded model path")
    else:
        MODEL_PATH = None
        logger.error("Failed to download model, Llama translation will be unavailable")

try:
    if MODEL_PATH:
        llama_model = Llama(model_path=MODEL_PATH, n_ctx=512, n_threads=4)
        logger.info("Llama model for Japanese to English translation loaded successfully")
    else:
        llama_model = None
        logger.error("No model path available, Llama model not loaded")

    # Preload model with a test translation to avoid first-user latency
    try:
        llama_model.reset()
        test_text = "こんにちは"
        test_messages = [
            {"role": "system", "content": "Translate to English."},
            {"role": "user", "content": test_text}
        ]
        test_output = llama_model.create_chat_completion(messages=test_messages, max_tokens=50, stop=["\n"])
        test_translation = test_output['choices'][0]['message']['content'].strip()
        logger.info(f"Llama model preloaded successfully. Test translation: {test_text} -> {test_translation}")
        # Reset after preload to clear KV cache for future requests
        llama_model.reset()
    except Exception as e:
        logger.warning(f"Failed to preload Llama model (non-critical): {e}")

except Exception as e:
    logger.error(f"Failed to load Llama model: {e}")
    llama_model = None


# Pydantic model for translation request
class TranslateRequest(BaseModel):
    q: str | list[str]
    source: str
    target: str
    format: str = "text"
    alternatives: int = 3
    api_key: str | None = None

class DetectRequest(BaseModel):
    q: str

# Pydantic model for translation response
class TranslateResponse(BaseModel):
    translatedText: str
    alternatives: list[str]

# LibreTranslate internal API URL
LIBRETRANSLATE_TRANSLATE_URL = f"{LIBRETRANSLATE_URL}/translate"
LIBRETRANSLATE_DETECT_URL = f"{LIBRETRANSLATE_URL}/detect"

@router.post("/translate", tags=["Translate"], response_model=TranslateResponse, dependencies=[Depends(verify_jwt)])
@limiter.limit("30/minute")
async def translate(request: Request, translate_request: TranslateRequest, payload: dict = Depends(verify_jwt)):

    logger.info(f"User {payload.get('sub')} requested translation: {translate_request.source} to {translate_request.target}")
    
    # Handle Japanese translations with Llama
    if translate_request.source == "ja" and llama_model:
        try:
            logger.info(f"Using Llama for Japanese translation: {len(translate_request.q) if isinstance(translate_request.q, list) else 1} texts")

            # Ensure q is always an array for translations
            texts = translate_request.q if isinstance(translate_request.q, list) else [translate_request.q]

            # Step 1: Translate Japanese to English using Llama
            english_translations = []
            for text in texts:
                llama_model.reset()  # Reset KV cache for each translation
                messages = [
                    {"role": "system", "content": "Translate to English."},
                    {"role": "user", "content": text}
                ]
                output = llama_model.create_chat_completion(messages=messages, max_tokens=200, stop=["\n"])
                translation = output['choices'][0]['message']['content'].strip()
                english_translations.append(translation)

            logger.info(f"Llama Japanese->English translation successful for user {payload.get('sub')}")

            # Step 2: If target is English, return the Llama results directly
            if translate_request.target == "en":
                return JSONResponse(content={
                    "translatedText": english_translations if isinstance(translate_request.q, list) else english_translations[0],
                    "alternatives": []
                })

            # Step 3: If target is not English, translate English->target using LibreTranslate
            logger.info(f"Translating English to {translate_request.target} using LibreTranslate for user {payload.get('sub')}")

            libre_payload = {
                "q": english_translations,
                "source": "en",
                "target": translate_request.target,
                "format": translate_request.format,
                "alternatives": translate_request.alternatives,
            }
            if translate_request.api_key:
                libre_payload["api_key"] = translate_request.api_key

            # Use LibreTranslate for English to target language
            async with httpx.AsyncClient() as client:
                try:
                    response = await client.post(LIBRETRANSLATE_TRANSLATE_URL, json=libre_payload, timeout=10.0)
                    response.raise_for_status()
                    libre_result = response.json()
                except httpx.HTTPStatusError as e:
                    logger.error(f"LibreTranslate error: {e.response.status_code} - {e.response.text}")
                    raise HTTPException(
                        status_code=status.HTTP_502_BAD_GATEWAY,
                        detail=f"Translation service error: {e.response.text}"
                    )
                except httpx.RequestError as e:
                    logger.error(f"Failed to connect to LibreTranslate: {str(e)}")
                    raise HTTPException(
                        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                        detail="Translation service unavailable"
                    )
                except json.JSONDecodeError:
                    logger.error("Invalid response from LibreTranslate")
                    raise HTTPException(
                        status_code=status.HTTP_502_BAD_GATEWAY,
                        detail="Invalid response from translation service"
                    )

            # Validate LibreTranslate response
            if "translatedText" not in libre_result:
                logger.error(f"Unexpected response from LibreTranslate: {libre_result}")
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Invalid translation response"
                )

            logger.info(f"Pipeline translation successful for user {payload.get('sub')}: Japanese -> English -> {translate_request.target}")
            response = {"translatedText": libre_result["translatedText"]}
            if "alternatives" in libre_result:
                response["alternatives"] = libre_result["alternatives"]
            return JSONResponse(content=response)

        except Exception as e:
            logger.error(f"Llama translation error: {e}")
            # Fallback to LibreTranslate for Japanese if Llama fails
            logger.info("Falling back to LibreTranslate for Japanese translation")
            # Continue to LibreTranslate section below
    
    # Use LibreTranslate for other languages (including Japanese fallback)
    # Prepare request payload for LibreTranslate
    libre_payload = {
        "q": translate_request.q,
        "source": translate_request.source,
        "alternatives": translate_request.alternatives,
        "target": translate_request.target,
        "format": translate_request.format,
    }
    if translate_request.api_key:
        libre_payload["api_key"] = translate_request.api_key

    # Forward request to LibreTranslate
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(LIBRETRANSLATE_TRANSLATE_URL, json=libre_payload, timeout=10.0)
            response.raise_for_status()
            result = response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"LibreTranslate error: {e.response.status_code} - {e.response.text}")
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Translation service error: {e.response.text}"
            )
        except httpx.RequestError as e:
            logger.error(f"Failed to connect to LibreTranslate: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Translation service unavailable"
            )
        except json.JSONDecodeError:
            logger.error("Invalid response from LibreTranslate")
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Invalid response from translation service"
            )

    # Validate response
    if "translatedText" not in result:
        logger.error(f"Unexpected response from LibreTranslate: {result}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Invalid translation response"
        )

    logger.info(f"Translation successful for user {payload.get('sub')}")
    response = {"translatedText": result["translatedText"]}
    if "alternatives" in result:
        response["alternatives"] = result["alternatives"]
    return JSONResponse(content=response)

@router.post("/detect", tags=["Translate"], dependencies=[Depends(verify_jwt)])
@limiter.limit("50/minute")
async def detect(request: Request, detect_request: DetectRequest, payload: dict = Depends(verify_jwt)):
    logger.info(f"User {payload.get('sub')} requested language detection: {detect_request.q}")
    
    # Prepare request payload for LibreTranslate
    detect_payload = {
        "q": detect_request.q,
    }

    # Forward request to LibreTranslate
    async with httpx.AsyncClient() as client:
        try:
            logging.info(f"Forwarding request to LibreTranslate: {detect_payload, LIBRETRANSLATE_DETECT_URL}")
            response = await client.post(LIBRETRANSLATE_DETECT_URL, json=detect_payload, timeout=10.0)
            response.raise_for_status()
            result = response.json()
            logging.info(f"LibreTranslate response: {result}")
        except httpx.HTTPStatusError as e:
            logger.error(f"LibreTranslate error: {e.response.status_code} - {e.response.text}")
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Translation service error: {e.response.text}"
            )
        except httpx.RequestError as e:
            logger.error(f"Failed to connect to LibreTranslate: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Translation service unavailable"
            )
        except json.JSONDecodeError:
            logger.error("Invalid response from LibreTranslate")
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Invalid response from translation service"
            )

    # Validate response
    if "language" not in result[0]:
        logger.error(f"Unexpected response from LibreTranslate: {result}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Invalid translation response"
        )

    logger.info(f"Language detection successful for user {payload.get('sub')}")
    return JSONResponse(content=result[0])
