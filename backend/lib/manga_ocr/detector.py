import cv2
import numpy as np
from PIL import Image
from typing import List, Union, Tuple
from .detector_config import TextDetectorConfig
from .detector_preprocessor import TextDetectorPreprocessor
from .detector_model import TextDetectorModel
from .text_block import TextBlock
from .utils.db_utils import SegDetectorRepresenter

class TextDetector:
    """Main Text Detector class for Manga/Comics"""

    def __init__(self, model_dir: str = "manga_ocr_japanese/model_detector"):
        self.config = TextDetectorConfig(model_dir)
        self.preprocessor = TextDetectorPreprocessor(self.config.input_size)
        self.model = TextDetectorModel(self.config)
        self.seg_rep = SegDetectorRepresenter(
            thresh=self.config.mask_thresh,
            box_thresh=self.config.box_thresh
        )

    def __call__(self, image: Union[Image.Image, np.ndarray]) -> List[TextBlock]:
        """Detect text in image and return list of TextBlocks"""
        # Convert PIL to CV if needed
        if isinstance(image, Image.Image):
            cv_img = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            im_w, im_h = image.size
        else:
            cv_img = image
            im_h, im_w = image.shape[:2]

        # 1. Preprocess
        img_in, ratio, (dw, dh) = self.preprocessor.preprocess(cv_img)

        # 2. Inference
        blks, mask, lines_map = self.model.run(img_in)

        # 3. Postprocess YOLO (Blocks)
        detections = self.model.postprocess_boxes(blks, ratio, dw, dh, im_w, im_h)

        # 4. Postprocess DBNet (Lines/Mask)
        # Extract lines for each block
        # In this simplified version, we return the blocks as detected by YOLO
        # but we could also use the segmentation mask to refine them
        
        text_blocks = []
        for det in detections:
            xyxy = det[:4].tolist()
            conf = float(det[4])
            cls_id = int(det[5])
            lang = "ja" if cls_id == 1 else "eng" if cls_id == 0 else "unknown"
            
            block = TextBlock(
                xyxy=xyxy,
                confidence=conf,
                language=lang
            )
            text_blocks.append(block)

        return text_blocks

    def crop_detected_regions(self, image: Image.Image, padding: int = 5) -> List[Tuple[Image.Image, TextBlock]]:
        """Crop detected text regions from image"""
        blocks = self(image)
        crops = []
        w, h = image.size
        
        for block in blocks:
            x1, y1, x2, y2 = block.xyxy
            # Add padding
            x1 = max(0, x1 - padding)
            y1 = max(0, y1 - padding)
            x2 = min(w, x2 + padding)
            y2 = min(h, y2 + padding)
            
            crop = image.crop((x1, y1, x2, y2))
            crops.append((crop, block))
            
        return crops
