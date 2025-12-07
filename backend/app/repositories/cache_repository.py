from redis.asyncio import Redis
from typing import Optional
from loguru import logger
from app.core.config import get_settings


class CacheRepository:
    """Repository for Redis cache operations"""
    
    def __init__(self):
        settings = get_settings()
        self.redis = Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            decode_responses=False
        )
    
    async def get(self, key: str) -> Optional[bytes]:
        """
        Get value from cache
        
        Args:
            key: Cache key
            
        Returns:
            Cached value or None if not found
        """
        try:
            return await self.redis.get(key)
        except Exception as e:
            logger.warning(f"Redis get error for key {key}: {e}")
            return None
    
    async def set(self, key: str, value: bytes, ttl: Optional[int] = None) -> bool:
        """
        Set value in cache
        
        Args:
            key: Cache key
            value: Value to cache
            ttl: Time to live in seconds (optional)
            
        Returns:
            True if successful, False otherwise
        """
        try:
            if ttl:
                await self.redis.setex(key, ttl, value)
            else:
                await self.redis.set(key, value)
            return True
        except Exception as e:
            logger.warning(f"Redis set error for key {key}: {e}")
            return False
    
    async def delete(self, key: str) -> bool:
        """
        Delete value from cache
        
        Args:
            key: Cache key
            
        Returns:
            True if successful, False otherwise
        """
        try:
            await self.redis.delete(key)
            return True
        except Exception as e:
            logger.warning(f"Redis delete error for key {key}: {e}")
            return False
    
    async def ping(self) -> bool:
        """
        Check Redis connection
        
        Returns:
            True if connected, False otherwise
        """
        try:
            await self.redis.ping()
            return True
        except Exception as e:
            logger.error(f"Redis ping failed: {e}")
            return False
    
    async def close(self):
        """Close Redis connection"""
        await self.redis.close()
