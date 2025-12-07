from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from app.core.config import get_settings


# Rate limiter instance
limiter = Limiter(key_func=get_remote_address)

# Security
security = HTTPBearer()


async def verify_jwt(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    Verify JWT token from Authorization header
    
    Args:
        credentials: HTTP Bearer credentials
        
    Returns:
        dict: Decoded JWT payload
        
    Raises:
        HTTPException: If token is invalid or expired
    """
    settings = get_settings()
    
    if credentials.scheme != "Bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication scheme"
        )
    
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated"
        )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
