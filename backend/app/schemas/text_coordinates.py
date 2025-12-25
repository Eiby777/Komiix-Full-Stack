"""
Schemas for Text Coordinates API endpoint
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict


class SeedPoint(BaseModel):
    """Seed point coordinates inside the bubble"""
    x: float = Field(..., description="X coordinate of the seed point")
    y: float = Field(..., description="Y coordinate of the seed point")


class Rectangle(BaseModel):
    """Rectangle coordinates and dimensions"""
    x: float = Field(..., description="X coordinate of top-left corner")
    y: float = Field(..., description="Y coordinate of top-left corner")
    w: float = Field(..., description="Width of the rectangle")
    h: float = Field(..., description="Height of the rectangle")


class TextCoordinatesRequest(BaseModel):
    """Request schema for text coordinates calculation"""
    image: str = Field(..., description="Base64 encoded cropped image")
    seed_point: SeedPoint = Field(..., description="Point inside the bubble")
    text: str = Field(..., description="Text to place in the bubble")
    font_family: str = Field(..., description="Font family name")
    font_id: str = Field(..., description="Font ID in the system")
    is_text: Optional[bool] = Field(None, description="Indicates rectangle type (true, false, or null)")
    rect: Optional[Rectangle] = Field(None, description="Optional rectangle coordinates")


class TextCoordinatesResponse(BaseModel):
    """Response schema for text coordinates calculation"""
    top: float = Field(..., description="Top position of the text")
    left: float = Field(..., description="Left position of the text")
    width: float = Field(..., description="Width of the text area")
    height: float = Field(..., description="Height of the text area")
    font_size: float = Field(..., description="Optimal font size")
    processing_time: float = Field(..., description="Processing time in seconds")
