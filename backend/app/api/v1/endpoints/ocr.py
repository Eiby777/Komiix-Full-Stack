from fastapi import APIRouter, Depends, HTTPException, Request
from loguru import logger
from typing import List
import base64
import cv2
import numpy as np
import time
import os
from PIL import Image

from app.api.deps import limiter, verify_jwt
from app.schemas.ocr import OCRRequest, OCRResponse, BoundingBox
from lib.manga_ocr import MangaOCR, TextDetector
from lib.onnx_ocr.onnx_paddleocr import ONNXPaddleOcr

router = APIRouter()

# Initialize ONNX OCR model
model = ONNXPaddleOcr(use_angle_cls=True, use_gpu=False)

# Initialize TextDetector and MangaOCR for Japanese (lazy initialization)
_text_detector = None
_manga_ocr = None


def get_text_detector():
    """Lazy initialization of TextDetector"""
    global _text_detector
    if _text_detector is None:
        _text_detector = TextDetector()
    return _text_detector


def get_manga_ocr():
    """Lazy initialization of MangaOCR"""
    global _manga_ocr
    if _manga_ocr is None:
        _manga_ocr = MangaOCR()
    return _manga_ocr


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
            # Use TextDetector + MangaOCR for Japanese
            logger.info("Using TextDetector + MangaOCR for Japanese text")
            
            # Convert CV2 image (BGR) to PIL Image (RGB)
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            pil_image = Image.fromarray(img_rgb)
            
            # Get detector and OCR instances
            detector = get_text_detector()
            manga_ocr = get_manga_ocr()
            
            # Detect text regions with absolute coordinates
            text_blocks = detector(pil_image)
            logger.info(f"Detected {len(text_blocks)} text blocks")
            
            ocr_results = []
            img_width, img_height = pil_image.size
            padding = 5  # Padding around detected regions
            
            for block in text_blocks:
                x1, y1, x2, y2 = block.xyxy
                
                # Add padding and clamp to image bounds
                x1 = max(0, int(x1) - padding)
                y1 = max(0, int(y1) - padding)
                x2 = min(img_width, int(x2) + padding)
                y2 = min(img_height, int(y2) + padding)
                
                # Skip if region is too small
                if (x2 - x1) < 10 or (y2 - y1) < 10:
                    logger.debug(f"Skipping small region: {x1},{y1},{x2},{y2}")
                    continue
                
                # Crop the detected region
                cropped = pil_image.crop((x1, y1, x2, y2))
                
                # Run OCR on cropped region
                try:
                    text = manga_ocr(cropped)
                    
                    if text and text.strip():
                        ocr_results.append({
                            "text": text,
                            "confidence": block.confidence,
                            "bounding_box": {
                                "x0": x1,
                                "y0": y1,
                                "x1": x2,
                                "y1": y2
                            }
                        })
                        logger.debug(f"OCR result for block: {text}")
                except Exception as e:
                    logger.error(f"Error running OCR on block {block.xyxy}: {e}")
                    continue
            
            processing_time = time.time() - start_time
            logger.info(f"MangaOCR processed {len(ocr_results)} text regions")
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
