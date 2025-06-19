from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel
from loguru import logger
from onnx_ocr.onnxocr.onnx_paddleocr import ONNXPaddleOcr
from typing import List, Dict, Any
import os
import base64
import cv2
import numpy as np
import time
from fastapi import APIRouter
from dependencies.limiter import limiter
from dependencies.auth import verify_jwt

router = APIRouter()

# Inicializar el modelo OCR
model = ONNXPaddleOcr(use_angle_cls=True, use_gpu=False)

# Modelo Pydantic para validación de entrada
class OCRRequest(BaseModel):
    image: str  # Imagen en base64

class BoundingBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float
    x3: float
    y3: float
    x4: float
    y4: float

class OCRResult(BaseModel):
    text: str
    confidence: float
    bounding_box: List[List[float]]

class OCRResponse(BaseModel):
    processing_time: float
    results: List[Dict[str, Any]]


@router.post("/ocr", tags=["OCR"], dependencies=[Depends(verify_jwt)], response_model=OCRResponse)
@limiter.limit("200/minute")
async def ocr_service(
    request: Request,
    ocr_request: OCRRequest,
    payload: dict = Depends(verify_jwt)
):
    logger.info(f"User {payload.get('sub')} requested OCR")
    try:
        # Decodificar imagen base64
        try:
            image_bytes = base64.b64decode(ocr_request.image)
            image_np = np.frombuffer(image_bytes, dtype=np.uint8)
            img = cv2.imdecode(image_np, cv2.IMREAD_COLOR)
            if img is None:
                raise HTTPException(status_code=400, detail="No se pudo decodificar la imagen desde base64")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error al decodificar la imagen: {str(e)}")

        # Ejecutar OCR
        start_time = time.time()
        result = model.ocr(img)
        processing_time = time.time() - start_time

        # Formatear resultados
        ocr_results = []
        for line in result[0]:
            if isinstance(line[0], (list, np.ndarray)):
                # Convertir a lista de listas
                bounding_box = np.array(line[0]).reshape(4, 2).tolist()
            else:
                bounding_box = []

            ocr_results.append({
                "text": line[1][0],
                "confidence": float(line[1][1]),
                "bounding_box": bounding_box
            })

        return {
            "processing_time": processing_time,
            "results": ocr_results
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error en el servicio OCR: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")
