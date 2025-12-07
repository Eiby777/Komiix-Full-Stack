from pydantic import BaseModel
from typing import List, Optional


class TranslateRequest(BaseModel):
    """Translation request schema"""
    q: str | List[str]
    source: str
    target: str
    format: str = "text"
    alternatives: int = 3
    api_key: Optional[str] = None


class DetectRequest(BaseModel):
    """Language detection request schema"""
    q: str


class TranslateResponse(BaseModel):
    """Translation response schema"""
    translatedText: str | List[str]
    alternatives: List[str] = []
