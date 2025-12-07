from fastapi import APIRouter, Depends, HTTPException, Request
from loguru import logger
from typing import List
import base64
import cv2
import numpy as np
import time
import tempfile
import os

from app.api.deps import limiter, verify_jwt
from app.schemas.ocr import OCRRequest, OCRResponse, BoundingBox
from lib.manga_ocr import MangaOCR
from lib.onnx_ocr.onnx_paddleocr import ONNXPaddleOcr

router = APIRouter()

# Initialize ONNX OCR model
model = ONNXPaddleOcr(use_angle_cls=True, use_gpu=False)

# MangaOCR will be initialized per request for Japanese


def polygon_to_bbox(polygon):
    """
    Convert a 4-point polygon to bounding box format [x1, y1, x2, y2]
    """
    # If polygon is a numpy array, convert to list
    if hasattr(polygon, 'tolist'):
        polygon = polygon.tolist()
    
    # Verify we have valid data
    if polygon is None or len(polygon) < 4:
        return [0, 0, 0, 0]
    
    # Extract all x and y coordinates
    x_coords = [point[0] for point in polygon]
    y_coords = [point[1] for point in polygon]
    
    # Find min and max
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
        # Decode base64 image
        try:
            image_bytes = base64.b64decode(ocr_request.image)
            image_np = np.frombuffer(image_bytes, dtype=np.uint8)
            img = cv2.imdecode(image_np, cv2.IMREAD_COLOR)
            if img is None:
                raise HTTPException(status_code=400, detail="Could not decode image from base64")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error decoding image: {str(e)}")

        # Execute OCR based on language
        start_time = time.time()
        
        if ocr_request.language.lower() == 'jpn':
            # Use MangaOCR for Japanese
            logger.info("Using MangaOCR for Japanese text")
            
            # Save image temporarily for MangaOCR
            with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as tmp_file:
                cv2.imwrite(tmp_file.name, img)
                tmp_path = tmp_file.name
            
            try:
                # Process with MangaOCR
                text = MangaOCR.from_image_path(tmp_path)
                processing_time = time.time() - start_time
                
                # MangaOCR returns only text, create result with full bounding box
                ocr_results = [{
                    "text": text,
                    "confidence": 1.0,  # MangaOCR doesn't provide confidence
                    "bounding_box": {
                        "x0": 0,
                        "y0": 0,
                        "x1": img.shape[1],
                        "y1": img.shape[0]
                    }
                }]
                
                logger.info(f"MangaOCR result: {text}")
                
            finally:
                # Clean up temporary file
                if os.path.exists(tmp_path):
                    os.unlink(tmp_path)
        else:
            # Use OnnxOCR for other languages
            logger.info("Using OnnxOCR for non-Japanese text")
            result = model.ocr(img)
            processing_time = time.time() - start_time

            logger.info(f"OCR result format: {type(result)}")

            # Format results
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
        logger.error(f"Error in OCR service: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
