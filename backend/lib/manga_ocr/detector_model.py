import onnxruntime as ort
import numpy as np
from .detector_config import TextDetectorConfig
from .utils.yolo_utils import non_max_suppression

class TextDetectorModel:
    """ONNX-based Comic Text Detector model"""

    def __init__(self, config: TextDetectorConfig):
        self.config = config
        self.session = None
        self._load_model()

    def _load_model(self):
        """Load ONNX model"""
        # OpenCV DNN is used in the original repo, but we use onnxruntime for consistency
        self.session = ort.InferenceSession(self.config.model_path)

    def run(self, img_in: np.ndarray):
        """Run detector inference"""
        # The model outputs: blks (yolo-like), mask, lines_map
        # In typical ONNX export of this model, outputs are in a list
        outputs = self.session.run(None, {"images": img_in})
        
        # blks (0), mask (1), lines_map (2)
        blks, mask, lines_map = outputs
        
        return blks, mask, lines_map

    def postprocess_boxes(self, blks, ratio, dw, dh, im_w, im_h):
        """Postprocess YOLO detections to image coordinates"""
        detections = non_max_suppression(blks, self.config.conf_thresh, self.config.nms_thresh)[0]
        
        if detections.shape[0] == 0:
            return detections
            
        # Map back to original image
        # Center padding (dw, dh) needs to be subtracted, then divided by ratio
        detections[:, [0, 2]] = (detections[:, [0, 2]] - dw) / ratio
        detections[:, [1, 3]] = (detections[:, [1, 3]] - dh) / ratio
        
        # Clip to image bounds
        detections[:, [0, 2]] = np.clip(detections[:, [0, 2]], 0, im_w)
        detections[:, [1, 3]] = np.clip(detections[:, [1, 3]], 0, im_h)
        
        return detections
