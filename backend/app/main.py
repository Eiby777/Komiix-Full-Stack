from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from loguru import logger
import redis.asyncio as redis

from app.core.config import get_settings
from app.core.logging import configure_logging
from app.api.deps import limiter
from app.api.v1.router import api_router
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

# Configure logging at startup
configure_logging()

settings = get_settings()
logger.info(settings)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    """Application lifespan manager"""
    logger.info("Application starting, checking Redis connection")
    
    # Check Redis connection
    redis_client = redis.Redis(
        host=settings.REDIS_HOST,
        port=settings.REDIS_PORT,
        decode_responses=False
    )
    try:
        await redis_client.ping()
        logger.info("Redis connection established successfully")
    except Exception as e:
        logger.error(f"Failed to connect to Redis: {e}")
    
    yield
    
    # Cleanup on shutdown
    await redis_client.close()
    logger.info("Application shutdown complete")


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    lifespan=lifespan
)

# Rate limiter setup
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS configuration
cors_origins = settings.CORS_ORIGINS.split("|") if settings.CORS_ORIGINS else []
logger.info(f"CORS_ORIGINS: {cors_origins}")
origins = [origin.strip() for origin in cors_origins if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    expose_headers=["Content-Disposition"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Cache-Control"],
)

# Include API router
app.include_router(api_router, prefix="/api")


@app.get("/")
def home():
    """Home endpoint"""
    logger.info("Home endpoint accessed")
    return {"message": "FastAPI server running 🚀"}


if __name__ == "__main__":
    logger.info("Starting FastAPI server")
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="debug"
    )
