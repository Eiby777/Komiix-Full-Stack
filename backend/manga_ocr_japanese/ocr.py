from PIL import Image
from .config import MangaOCRConfig
from .preprocessor import MangaOCRPreprocessor
from .model import MangaOCRModel

class MangaOCR:
    """Main Manga OCR class"""

    def __init__(self, model_dir: str = "model_onnx"):
        self.config = MangaOCRConfig(model_dir)
        self.preprocessor = MangaOCRPreprocessor(
            image_size=self.config.image_size,
            image_mean=self.config.image_mean,
            image_std=self.config.image_std
        )
        self.model = MangaOCRModel(self.config)

    def __call__(self, image: Image.Image) -> str:
        """Process image and return OCR text"""
        pixel_values = self.preprocessor.preprocess(image)
        encoder_hidden_states = self.model.run_encoder(pixel_values)
        tokens = self.model.generate_tokens(encoder_hidden_states)
        text = self.model.decode_tokens(tokens)
        return text

    @classmethod
    def from_image_path(cls, image_path: str, model_dir: str = "model_onnx") -> str:
        """Process image from file path"""
        image = Image.open(image_path).convert('RGB')
        ocr = cls(model_dir)
        return ocr(image)