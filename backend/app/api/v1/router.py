from fastapi import APIRouter
from app.api.v1.endpoints import fonts, models, ocr, translate, text_coordinates

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(fonts.router, tags=["Fonts"])
api_router.include_router(models.router, tags=["Models"])
api_router.include_router(ocr.router, tags=["OCR"])
api_router.include_router(translate.router, tags=["Translate"])
api_router.include_router(text_coordinates.router, tags=["Text Coordinates"])
