import logging
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dependencies.limiter import limiter
from dependencies.auth import verify_jwt
from loguru import logger
import httpx
import json

router = APIRouter()

logger.info("Translate router loaded")

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
LIBRETRANSLATE_URL = "http://libretranslate:5000/translate"
LIBRETRANSLATEDETECT_URL = "http://libretranslate:5000/detect"

@router.post("/translate", tags=["Translate"], response_model=TranslateResponse, dependencies=[Depends(verify_jwt)])
@limiter.limit("30/minute")
async def translate(request: Request, translate_request: TranslateRequest, payload: dict = Depends(verify_jwt)):

    logger.info(f"User {payload.get('sub')} requested translation: {translate_request.source} to {translate_request.target}")
    
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
            response = await client.post(LIBRETRANSLATE_URL, json=libre_payload, timeout=10.0)
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
            logging.info(f"Forwarding request to LibreTranslate: {detect_payload, LIBRETRANSLATEDETECT_URL}")
            response = await client.post(LIBRETRANSLATEDETECT_URL, json=detect_payload, timeout=10.0)
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
