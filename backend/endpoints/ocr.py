from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from loguru import logger
from typing import List, Dict, Any
import base64
import cv2
import numpy as np
import time
import tempfile
import os
from fastapi import APIRouter
from dependencies.limiter import limiter
from dependencies.auth import verify_jwt
from manga_ocr_japanese import MangaOCR
from onnxocr.onnx_paddleocr import ONNXPaddleOcr

router = APIRouter()

# Inicializar el modelo OCR Onnx
model = ONNXPaddleOcr(use_angle_cls=True, use_gpu=False)

# MangaOCR will be initialized per request for Japanese

# Modelo Pydantic para validación de entrada
class OCRRequest(BaseModel):
    image: str  # Imagen en base64
    language: str = "eng"  # Idioma por defecto inglés

class BoundingBox(BaseModel):
    x0: float
    y0: float
    x1: float
    y1: float

class OCRResult(BaseModel):
    text: str
    confidence: float
    bounding_box: BoundingBox

class OCRResponse(BaseModel):
    processing_time: float
    results: List[OCRResult]


def polygon_to_bbox(polygon):
    """
    Convierte un polígono de 4 puntos a bounding box formato [x1, y1, x2, y2]
    """
    # Si el polígono es un numpy array, convertirlo a lista
    if hasattr(polygon, 'tolist'):
        polygon = polygon.tolist()
    
    # Verificar que tenemos datos válidos
    if polygon is None or len(polygon) < 4:
        return [0, 0, 0, 0]
    
    # Extraer todas las coordenadas x e y
    x_coords = [point[0] for point in polygon]
    y_coords = [point[1] for point in polygon]
    
    # Encontrar min y max
    x1 = min(x_coords)
    y1 = min(y_coords)
    x2 = max(x_coords)
    y2 = max(y_coords)
    
    return [x1, y1, x2, y2]


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

        # Ejecutar OCR según el idioma
        start_time = time.time()
        
        if ocr_request.language.lower() == 'jpn':
            # Usar MangaOCR para japonés
            logger.info("Using MangaOCR for Japanese text")
            
            # Guardar imagen temporalmente para MangaOCR
            with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as tmp_file:
                cv2.imwrite(tmp_file.name, img)
                tmp_path = tmp_file.name
            
            try:
                # Procesar con MangaOCR
                text = MangaOCR.from_image_path(tmp_path)
                processing_time = time.time() - start_time
                
                # MangaOCR devuelve solo texto, crear resultado con bounding box completo
                ocr_results = [{
                    "text": text,
                    "confidence": 1.0,  # MangaOCR no proporciona confianza
                    "bounding_box": {
                        "x0": 0,
                        "y0": 0,
                        "x1": img.shape[1],
                        "y1": img.shape[0]
                    }
                }]
                
                logger.info(f"MangaOCR result: {text}")
                
            finally:
                # Limpiar archivo temporal
                if os.path.exists(tmp_path):
                    os.unlink(tmp_path)
        else:
            # Usar OnnxOCR para otros idiomas
            logger.info("Using OnnxOCR for non-Japanese text")
            result = model.ocr(img)
            processing_time = time.time() - start_time

            logger.info(f"OCR result format: {type(result)}")

            # Formatear resultados
            ocr_results = []
            for line in result[0]:
                try:
                    # bounding_box is numpy array of shape (4, 2)
                    polygon = line[0]
                    bbox = polygon_to_bbox(polygon)
                    text = line[1][0]
                    confidence = float(line[1][1])

                    ocr_results.append({
                        "text": text,
                        "confidence": confidence,
                        "bounding_box": {
                            "x0": bbox[0],
                            "y0": bbox[1],
                            "x1": bbox[2],
                            "y1": bbox[3]
                        }
                    })

                except Exception as e:
                    logger.error(f"Error processing result: {str(e)}")
                    continue

        logger.info(f"Final OCR results: {ocr_results}")
        return {
            "processing_time": processing_time,
            "results": ocr_results
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error en el servicio OCR: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")
