from pydantic_settings import BaseSettings
from functools import lru_cache
from pathlib import Path
import os


class Settings(BaseSettings):
    """Application settings"""
    
    # App
    APP_NAME: str = "Komiix Backend"
    DEBUG: bool = False
    
    # CORS
    CORS_ORIGINS: str = ""
    
    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_JWT_SECRET: str = ""
    
    # Redis
    REDIS_HOST: str = "redis"
    REDIS_PORT: int = 6379
    
    # LibreTranslate
    LIBRETRANSLATE_URL: str = ""
    
    # Paths - determine if running in Docker or local
    @property
    def BASE_DIR(self) -> Path:
        return Path(__file__).parent.parent.parent
    
    @property
    def ASSETS_DIR(self) -> Path:
        # Try Docker path first
        docker_path = Path("/app/assets")
        if docker_path.exists():
            return docker_path
        return self.BASE_DIR / "assets"
    
    @property
    def DATA_DIR(self) -> Path:
        # Try Docker path first
        docker_path = Path("/app/data")
        if docker_path.exists():
            return docker_path
        return self.BASE_DIR / "data"
    
    @property
    def FONT_DIR(self) -> Path:
        return self.ASSETS_DIR / "fonts"
    
    @property
    def ML_MODELS_DIR(self) -> Path:
        return self.ASSETS_DIR / "ml_models"
    
    @property
    def FONT_METADATA_FILE(self) -> Path:
        return self.DATA_DIR / "fonts_metadata.json"
    
    @property
    def MODEL_METADATA_FILE(self) -> Path:
        return self.DATA_DIR / "model_metadata.json"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()
