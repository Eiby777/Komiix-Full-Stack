#!/usr/bin/env python3
"""Manga OCR Production Script"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from PIL import Image
from .config import MangaOCRConfig
from .preprocessor import MangaOCRPreprocessor
from .model import MangaOCRModel
from .ocr import MangaOCR

def main():
    if len(sys.argv) != 2:
        print("Usage: python main.py <image_path>")
        print("Example: python main.py test.jpg")
        sys.exit(1)

    image_path = sys.argv[1]

    try:
        print(f"Processing image: {image_path}")
        text = MangaOCR.from_image_path(image_path)
        print(f"OCR Result: {text}")

    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()