import cv2
import numpy as np
from PIL import Image
from typing import Tuple, List, Union

class TextDetectorPreprocessor:
    """Image preprocessor for Comic Text Detector"""

    def __init__(self, input_size: Tuple[int, int] = (1024, 1024)):
        self.input_size = input_size

    def letterbox(self, img: np.ndarray, new_shape=(1024, 1024), color=(114, 114, 114), auto=False, scaleFill=False, scaleup=True, stride=64):
        # Resize and pad image while meeting stride-multiple constraints
        shape = img.shape[:2]  # current shape [height, width]
        if isinstance(new_shape, int):
            new_shape = (new_shape, new_shape)

        # Scale ratio (new / old)
        r = min(new_shape[0] / shape[0], new_shape[1] / shape[1])
        if not scaleup:  # only scale down, do not scale up (for better test mAP)
            r = min(r, 1.0)

        # Compute padding
        new_unpad = int(round(shape[1] * r)), int(round(shape[0] * r))
        dw, dh = new_shape[1] - new_unpad[0], new_shape[0] - new_unpad[1] # wh padding
        if auto:  # minimum rectangle
            dw, dh = np.mod(dw, stride), np.mod(dh, stride)  # wh padding
        elif scaleFill:  # stretch
            dw, dh = 0.0, 0.0
            new_unpad = (new_shape[1], new_shape[0])

        dw /= 2  # divide padding into 2 sides
        dh /= 2

        if shape[::-1] != new_unpad:  # resize
            img = cv2.resize(img, new_unpad, interpolation=cv2.INTER_LINEAR)
        top, bottom = int(round(dh - 0.1)), int(round(dh + 0.1))
        left, right = int(round(dw - 0.1)), int(round(dw + 0.1))
        img = cv2.copyMakeBorder(img, top, bottom, left, right, cv2.BORDER_CONSTANT, value=color)  # add border
        return img, r, (dw, dh)

    def preprocess(self, image: Union[Image.Image, np.ndarray]) -> Tuple[np.ndarray, float, Tuple[float, float]]:
        """Preprocess image for detector input"""
        if isinstance(image, Image.Image):
            img = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        else:
            img = image.copy()

        # Letterbox resize
        img_lb, ratio, (dw, dh) = self.letterbox(img, new_shape=self.input_size, auto=False, stride=64)
        
        # BGR to RGB, HWC to CHW, Normalize
        img_in = img_lb[:, :, ::-1].transpose((2, 0, 1))
        img_in = np.ascontiguousarray(img_in).astype(np.float32) / 255.0
        
        # Add batch dimension
        img_in = np.expand_dims(img_in, axis=0)
        
        return img_in, ratio, (dw, dh)
