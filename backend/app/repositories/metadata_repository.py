import json
from pathlib import Path
from typing import Dict, List, Any, Optional
from loguru import logger
from app.core.config import get_settings


class MetadataRepository:
    """Repository for reading metadata JSON files"""
    
    def __init__(self):
        self.settings = get_settings()
        self._font_metadata: Optional[List[Dict[str, Any]]] = None
        self._model_metadata: Optional[Dict[str, Any]] = None
    
    def get_font_metadata(self) -> List[Dict[str, Any]]:
        """
        Get font metadata
        
        Returns:
            List of font metadata dictionaries
        """
        if self._font_metadata is None:
            self._load_font_metadata()
        return self._font_metadata or []
    
    def get_model_metadata(self) -> Dict[str, Any]:
        """
        Get model metadata
        
        Returns:
            Dictionary of model metadata
        """
        if self._model_metadata is None:
            self._load_model_metadata()
        return self._model_metadata or {}
    
    def _load_font_metadata(self):
        """Load font metadata from JSON file"""
        try:
            metadata_file = self.settings.FONT_METADATA_FILE
            with open(metadata_file, "r", encoding="utf-8") as f:
                self._font_metadata = json.load(f)
            logger.info(f"Font metadata loaded from {metadata_file}")
        except FileNotFoundError:
            logger.error(f"Font metadata file not found: {self.settings.FONT_METADATA_FILE}")
            self._font_metadata = []
        except json.JSONDecodeError:
            logger.error(f"Invalid JSON in font metadata file: {self.settings.FONT_METADATA_FILE}")
            self._font_metadata = []
    
    def _load_model_metadata(self):
        """Load model metadata from JSON file"""
        try:
            metadata_file = self.settings.MODEL_METADATA_FILE
            with open(metadata_file, "r") as f:
                self._model_metadata = json.load(f)
            logger.info(f"Model metadata loaded from {metadata_file}")
        except FileNotFoundError:
            logger.error(f"Model metadata file not found: {self.settings.MODEL_METADATA_FILE}")
            raise RuntimeError(f"Model metadata file not found: {self.settings.MODEL_METADATA_FILE}")
        except json.JSONDecodeError:
            logger.error(f"Error parsing {self.settings.MODEL_METADATA_FILE}")
            raise RuntimeError(f"Error parsing {self.settings.MODEL_METADATA_FILE}")
    
    def reload_metadata(self):
        """Reload all metadata from files"""
        self._font_metadata = None
        self._model_metadata = None
        self._load_font_metadata()
        self._load_model_metadata()
