import os
from typing import Tuple

class TextDetectorConfig:
    """Configuration for Comic Text Detector model"""

    def __init__(self, model_dir: str = "manga_ocr_japanese/model_detector"):
        self.model_dir = model_dir
        self.model_path = os.path.join(self.model_dir, "comic-text-detector.onnx")
        self.model_url = "https://huggingface.co/mayocream/comic-text-detector-onnx/resolve/main/comic-text-detector.onnx"
        
        # Preprocessing parameters
        self.input_size: Tuple[int, int] = (1024, 1024)
        
        # Detection parameters
        self.conf_thresh = 0.25
        self.nms_thresh = 0.35
        self.mask_thresh = 0.3
        self.box_thresh = 0.6
        
        self._ensure_model_exists()

    def _ensure_model_exists(self):
        """Download model file if it doesn't exist"""
        if not os.path.exists(self.model_path):
            import urllib.request
            os.makedirs(self.model_dir, exist_ok=True)
            print(f"Downloading detector model from {self.model_url}...")
            try:
                urllib.request.urlretrieve(self.model_url, self.model_path)
                print("Downloaded detector model successfully")
            except Exception as e:
                raise RuntimeError(f"Failed to download detector model: {e}")
