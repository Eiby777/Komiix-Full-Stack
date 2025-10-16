import json
import os
from typing import Tuple

class MangaOCRConfig:
    """Configuration for Manga OCR model"""

    def __init__(self, model_dir: str = "manga_ocr_japanese/model_onnx"):
        self.model_dir = model_dir
        self._load_config()

    def _load_config(self):
        """Load model configuration"""
        config_path = os.path.join(self.model_dir, "config.json")
        preprocessor_path = os.path.join(self.model_dir, "preprocessor_config.json")

        # Ensure config files exist, download if not
        self._ensure_config_files()

        with open(config_path, 'r') as f:
            self.config = json.load(f)

        with open(preprocessor_path, 'r') as f:
            self.preprocessor_config = json.load(f)

        # Model parameters
        self.image_size: Tuple[int, int] = (
            self.preprocessor_config['size']['height'],
            self.preprocessor_config['size']['width']
        )
        self.image_mean = tuple(self.preprocessor_config['image_mean'])
        self.image_std = tuple(self.preprocessor_config['image_std'])

    def _ensure_config_files(self):
        """Download config files if they don't exist"""
        import urllib.request

        config_urls = {
            os.path.join(self.model_dir, "config.json"): "https://huggingface.co/l0wgear/manga-ocr-2025-onnx/resolve/main/config.json",
            os.path.join(self.model_dir, "preprocessor_config.json"): "https://huggingface.co/l0wgear/manga-ocr-2025-onnx/resolve/main/preprocessor_config.json",
            os.path.join(self.model_dir, "generation_config.json"): "https://huggingface.co/l0wgear/manga-ocr-2025-onnx/resolve/main/generation_config.json",
            os.path.join(self.model_dir, "special_tokens_map.json"): "https://huggingface.co/l0wgear/manga-ocr-2025-onnx/resolve/main/special_tokens_map.json",
            os.path.join(self.model_dir, "tokenizer_config.json"): "https://huggingface.co/l0wgear/manga-ocr-2025-onnx/resolve/main/tokenizer_config.json",
            os.path.join(self.model_dir, "vocab.txt"): "https://huggingface.co/l0wgear/manga-ocr-2025-onnx/resolve/main/vocab.txt"
        }

        os.makedirs(self.model_dir, exist_ok=True)

        for file_path, url in config_urls.items():
            if not os.path.exists(file_path):
                print(f"Downloading {os.path.basename(file_path)}...")
                try:
                    urllib.request.urlretrieve(url, file_path)
                    print(f"Downloaded {os.path.basename(file_path)} successfully")
                except Exception as e:
                    raise RuntimeError(f"Failed to download {os.path.basename(file_path)}: {e}")

        # Generation parameters
        self.max_length = 300
        self.eos_token_id = 3
        self.pad_token_id = 0
        self.decoder_start_token_id = 2

        # Model paths
        self.encoder_path = os.path.join(self.model_dir, "encoder_model.onnx")
        self.decoder_path = os.path.join(self.model_dir, "decoder_model.onnx")
        self.vocab_path = os.path.join(self.model_dir, "vocab.txt")

        # Ensure model files exist, download if not
        self._ensure_model_files()

    def _ensure_model_files(self):
        """Download model files if they don't exist"""
        import urllib.request

        model_urls = {
            self.encoder_path: "https://huggingface.co/l0wgear/manga-ocr-2025-onnx/resolve/main/encoder_model.onnx",
            self.decoder_path: "https://huggingface.co/l0wgear/manga-ocr-2025-onnx/resolve/main/decoder_model.onnx"
        }

        for file_path, url in model_urls.items():
            if not os.path.exists(file_path):
                print(f"Downloading {os.path.basename(file_path)}...")
                try:
                    urllib.request.urlretrieve(url, file_path)
                    print(f"Downloaded {os.path.basename(file_path)} successfully")
                except Exception as e:
                    raise RuntimeError(f"Failed to download {os.path.basename(file_path)}: {e}")