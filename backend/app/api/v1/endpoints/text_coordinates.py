"""
Text Coordinates API Endpoint

Provides text coordinate calculation for manga/comic bubble text placement.
"""

from fastapi import APIRouter, Depends, HTTPException, Request
from loguru import logger
import base64
import cv2
import numpy as np
import time
import tempfile
import os
from pathlib import Path

from app.api.deps import limiter, verify_jwt
from app.schemas.text_coordinates import TextCoordinatesRequest, TextCoordinatesResponse
from lib.text_centralization import process_bubble_from_array

router = APIRouter()


def get_font_path(font_id: str) -> str:
    """
    Get the absolute path to a font file by font ID.
    
    Args:
        font_id: Font identifier
        
    Returns:
        Absolute path to the font file
        
    Raises:
        HTTPException: If font file not found
    """
    # Font files are stored in backend/assets/fonts/
    base_path = Path(__file__).parent.parent.parent.parent.parent / "assets" / "fonts"
    
    # Try common font extensions
    extensions = ['.woff2', '.woff', '.ttf', '.otf']
    
    for ext in extensions:
        font_path = base_path / f"{font_id}{ext}"
        if font_path.exists():
            return str(font_path)
    
    # If not found with exact ID, search for files containing the ID
    for font_file in base_path.glob(f"*{font_id}*"):
        if font_file.suffix.lower() in extensions:
            return str(font_file)
    
    raise HTTPException(
        status_code=404, 
        detail=f"Font file not found for font_id: {font_id}"
    )


@router.post(
    "/text-coordinates", 
    tags=["Text Coordinates"], 
    dependencies=[Depends(verify_jwt)], 
    response_model=TextCoordinatesResponse
)
@limiter.limit("200/minute")
async def calculate_text_coordinates(
    request: Request,
    text_request: TextCoordinatesRequest,
    payload: dict = Depends(verify_jwt)
):
    """
    Calculate optimal text coordinates for bubble text placement.
    
    This endpoint analyzes a speech bubble image and calculates the optimal
    position, size, and font size for text placement using flood fill detection
    and inscribed rectangle algorithms.
    
    Args:
        request: FastAPI request object
        text_request: Text coordinates request with image and parameters
        payload: JWT payload from authentication
        
    Returns:
        TextCoordinatesResponse with calculated coordinates and font size
    """
    logger.info(f"User {payload.get('sub')} requested text coordinates calculation")
    
    try:
        # Decode base64 image
        try:
            image_bytes = base64.b64decode(text_request.image)
            image_np = np.frombuffer(image_bytes, dtype=np.uint8)
            img = cv2.imdecode(image_np, cv2.IMREAD_COLOR)
            if img is None:
                raise HTTPException(
                    status_code=400, 
                    detail="Could not decode image from base64"
                )
        except Exception as e:
            logger.error(f"Error decoding image: {str(e)}")
            raise HTTPException(
                status_code=400, 
                detail=f"Error decoding image: {str(e)}"
            )

        # Get font path
        try:
            font_path = get_font_path(text_request.font_id)
            logger.info(f"Using font: {font_path}")
        except HTTPException as e:
            logger.error(f"Font not found: {text_request.font_id}")
            raise e

        # Extract seed point
        seed_point = (text_request.seed_point.x, text_request.seed_point.y)
        
        # Validate seed point is within image bounds
        if not (0 <= seed_point[0] < img.shape[1] and 0 <= seed_point[1] < img.shape[0]):
            raise HTTPException(
                status_code=400,
                detail=f"Seed point ({seed_point[0]}, {seed_point[1]}) is outside image bounds"
            )

        # Execute text coordinate calculation
        start_time = time.time()
        
        try:
            # Process bubble and get coordinates
            (x, y, h, w), font_size, hyphenations = process_bubble_from_array(
                image=img,
                seed_point=seed_point,
                font_path=font_path,
                text=text_request.text
            )
            
            processing_time = time.time() - start_time
            
            logger.info(
                f"Text coordinates calculated: x={x}, y={y}, w={w}, h={h}, "
                f"font_size={font_size}, processing_time={processing_time:.3f}s"
            )
            
            # Return response
            return TextCoordinatesResponse(
                top=float(y),
                left=float(x),
                width=float(w),
                height=float(h),
                font_size=float(font_size),
                processing_time=processing_time
            )
            
        except Exception as e:
            logger.error(f"Error processing bubble: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=500,
                detail=f"Error processing bubble: {str(e)}"
            )

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error in text coordinates service: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500, 
            detail=f"Internal server error: {str(e)}"
        )
