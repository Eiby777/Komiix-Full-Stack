from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
import time
from endpoints.models import router as models_router
from endpoints.fonts import router as fonts_router
from endpoints.translate import router as translate_router
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from dependencies.limiter import limiter
from contextlib import asynccontextmanager
from loguru import logger
import config.logging_config
import redis.asyncio as redis
import os

# Configurar logging al inicio
config.logging_config.configure_logging()

app = FastAPI()

@asynccontextmanager
async def lifespan(_app: FastAPI):
    logger.info("Application starting, checking Redis connection")
    
    # Check Redis connection
    redis_client = redis.Redis(host="redis", port=6379, decode_responses=False)
    try:
        await redis_client.ping()
        logger.info("Redis connection established successfully")
    except Exception as e:
        logger.error(f"Failed to connect to Redis: {e}")
    
    yield
    
    # Cleanup on shutdown
    await redis_client.close()
    logger.info("Application shutdown complete")

app.lifespan = lifespan

# Rate limiter setup
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    # Log request details
    logger.info(f"Incoming request: {request.method} {request.url}")
    logger.info(f"  Headers: {dict(request.headers)}")
    logger.info(f"  Origin: {request.headers.get('origin')}")
    logger.info(f"  Referer: {request.headers.get('referer')}")
    
    # Process the request
    response = await call_next(request)
    
    # Log response details
    process_time = (time.time() - start_time) * 1000
    response.headers["X-Process-Time"] = str(process_time)
    
    logger.info(f"Request completed in {process_time:.2f}ms")
    return response

# CORS configuration
origins = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "").split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Process-Time"],
)

# Include routers
app.include_router(models_router, prefix="/api")
app.include_router(fonts_router, prefix="/api")
app.include_router(translate_router, prefix="/api")

@app.get("/")
def home():
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