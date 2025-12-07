from pydantic import BaseModel
from typing import List


class BoundingBox(BaseModel):
    """Bounding box coordinates"""
    x0: float
    y0: float
    x1: float
    y1: float


class OCRRequest(BaseModel):
    """OCR request schema"""
    image: str  # Base64 encoded image
    language: str = "eng"  # Default language is English


class OCRResult(BaseModel):
    """Single OCR result"""
    text: str
    confidence: float
    bounding_box: BoundingBox


class OCRResponse(BaseModel):
    """OCR response schema"""
    processing_time: float
    results: List[OCRResult]
