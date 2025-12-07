import numpy as np
from PIL import Image
from typing import Tuple

class MangaOCRPreprocessor:
    """Image preprocessor for Manga OCR"""

    def __init__(self, image_size: Tuple[int, int] = (224, 224),
                 image_mean: Tuple[float, ...] = (0.5, 0.5, 0.5),
                 image_std: Tuple[float, ...] = (0.5, 0.5, 0.5)):
        self.image_size = image_size
        self.image_mean = image_mean
        self.image_std = image_std

    def preprocess(self, image: Image.Image) -> np.ndarray:
        """Preprocess image for model input"""
        # Ensure RGB
        if image.mode != 'RGB':
            image = image.convert('RGB')

        # Resize
        image = image.resize(self.image_size)

        # Convert to numpy array
        img_array = np.array(image, dtype=np.float32)

        # Normalize to [0, 1]
        img_array = img_array / 255.0

        # Apply mean and std
        img_array = (img_array - np.array(self.image_mean, dtype=np.float32)) / np.array(self.image_std, dtype=np.float32)

        # Transpose to CHW format
        img_array = np.transpose(img_array, (2, 0, 1))

        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)

        return img_array