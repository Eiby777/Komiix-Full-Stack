import aiofiles
import hashlib
from pathlib import Path
from typing import AsyncGenerator, Optional
from fastapi import HTTPException, status
from loguru import logger


class FileRepository:
    """Repository for file operations"""
    
    @staticmethod
    async def stream_file(
        file_path: Path,
        expected_checksum: Optional[str] = None,
        chunk_size: int = 1024 * 1024  # 1MB chunks
    ) -> AsyncGenerator[bytes, None]:
        """
        Stream a file with optional integrity checking
        
        Args:
            file_path: Path to the file
            expected_checksum: Expected SHA256 checksum (optional)
            chunk_size: Size of chunks to read
            
        Yields:
            File chunks
            
        Raises:
            HTTPException: If file not found, permission denied, or integrity check fails
        """
        hasher = hashlib.sha256() if expected_checksum else None
        
        try:
            async with aiofiles.open(file_path, mode="rb") as f:
                while True:
                    chunk = await f.read(chunk_size)
                    if not chunk:
                        break
                    if hasher:
                        hasher.update(chunk)
                    yield chunk
            
            # Verify checksum if provided
            if expected_checksum and hasher:
                actual_checksum = hasher.hexdigest()
                if actual_checksum != expected_checksum:
                    logger.error(
                        f"Integrity check failed for {file_path}: "
                        f"expected {expected_checksum}, got {actual_checksum}"
                    )
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail="File integrity check failed"
                    )
        except FileNotFoundError:
            logger.error(f"File not found: {file_path}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found"
            )
        except PermissionError:
            logger.error(f"Permission denied accessing file: {file_path}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permission denied accessing file"
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error streaming file {file_path}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error"
            )
    
    @staticmethod
    async def read_file(file_path: Path) -> bytes:
        """
        Read entire file into memory
        
        Args:
            file_path: Path to the file
            
        Returns:
            File contents as bytes
            
        Raises:
            HTTPException: If file not found or permission denied
        """
        try:
            async with aiofiles.open(file_path, mode="rb") as f:
                return await f.read()
        except FileNotFoundError:
            logger.error(f"File not found: {file_path}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found"
            )
        except PermissionError:
            logger.error(f"Permission denied accessing file: {file_path}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permission denied accessing file"
            )
        except Exception as e:
            logger.error(f"Error reading file {file_path}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error"
            )
    
    @staticmethod
    def compute_checksum(data: bytes) -> str:
        """
        Compute SHA256 checksum of data
        
        Args:
            data: Data to hash
            
        Returns:
            Hexadecimal checksum string
        """
        hasher = hashlib.sha256()
        hasher.update(data)
        return hasher.hexdigest()
    
    @staticmethod
    def validate_path(file_path: Path, base_dir: Path) -> bool:
        """
        Validate that file path is within base directory
        
        Args:
            file_path: Path to validate
            base_dir: Base directory
            
        Returns:
            True if path is valid, False otherwise
        """
        try:
            return file_path.resolve().is_relative_to(base_dir.resolve())
        except Exception:
            return False
