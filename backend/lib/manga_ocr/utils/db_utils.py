import cv2
import numpy as np
from pyclipper import PyclipperOffset, ET_CLOSEDPOLYGON, JT_ROUND

class SegDetectorRepresenter:
    def __init__(self, thresh=0.3, box_thresh=0.6, max_candidates=1000, unclip_ratio=1.5):
        self.thresh = thresh
        self.box_thresh = box_thresh
        self.max_candidates = max_candidates
        self.unclip_ratio = unclip_ratio

    def __call__(self, batch, pred):
        """
        pred: [B, C, H, W]
        """
        # We assume batch size 1
        segmentation = pred[0, 0, :, :]
        # segmentation = (segmentation > self.thresh).astype(np.uint8) * 255
        
        # Simplified representation logic
        # In a real scenario, this would extract polygons from the segmentation map
        # For now, let's provide a basic implementation using OpenCV
        
        # This is a placeholder for the complex DBNet post-processing
        # We'll use the one from the original repo if possible, but simplified
        
        return self.boxes_from_bitmap(pred[0, 0, :, :], batch[0], batch[1])

    def boxes_from_bitmap(self, bitmap, dest_width, dest_height):
        """
        bitmap: [H, W]
        """
        height, width = bitmap.shape
        bitmap = (bitmap > self.thresh).astype(np.uint8) * 255
        
        contours, _ = cv2.findContours(bitmap, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
        
        num_contours = min(len(contours), self.max_candidates)
        boxes = []
        scores = []
        
        for index in range(num_contours):
            contour = contours[index]
            points, sside = self.get_mini_boxes(contour)
            if sside < 3:
                continue
            points = np.array(points)
            score = self.box_score_fast(bitmap, points.reshape(-1, 2))
            if self.box_thresh > score:
                continue
            
            box = self.unclip(points).reshape(-1, 1, 2)
            box, sside = self.get_mini_boxes(box)
            if sside < 3:
                continue
            box = np.array(box)
            
            # Map back to original size
            box[:, 0] = box[:, 0] * dest_width / width
            box[:, 1] = box[:, 1] * dest_height / height
            
            boxes.append(box.reshape(-1, 8))
            scores.append(score)
            
        return np.array(boxes), np.array(scores)

    def unclip(self, box):
        unclip_ratio = self.unclip_ratio
        area = cv2.contourArea(box)
        length = cv2.arcLength(box, True)
        distance = area * unclip_ratio / length

        offset = PyclipperOffset()
        offset.AddPath(box, JT_ROUND, ET_CLOSED_POLYGON)
        expanded = np.array(offset.Execute(distance))
        return expanded

    def get_mini_boxes(self, contour):
        bounding_box = cv2.minAreaRect(contour)
        points = sorted(list(cv2.boxPoints(bounding_box)), key=lambda x: x[0])

        index_1, index_2, index_3, index_4 = 0, 1, 2, 3
        if points[1][1] > points[0][1]:
            index_1 = 0
            index_4 = 1
        else:
            index_1 = 1
            index_4 = 0
        if points[3][1] > points[2][1]:
            index_2 = 2
            index_3 = 3
        else:
            index_2 = 3
            index_3 = 2

        box = [points[index_1], points[index_2], points[index_3], points[index_4]]
        return box, min(bounding_box[1])

    def box_score_fast(self, bitmap, _box):
        h, w = bitmap.shape[:2]
        box = _box.copy()
        xmin = np.clip(np.floor(box[:, 0].min()).astype(np.int32), 0, w - 1)
        xmax = np.clip(np.ceil(box[:, 0].max()).astype(np.int32), 0, w - 1)
        ymin = np.clip(np.floor(box[:, 1].min()).astype(np.int32), 0, h - 1)
        ymax = np.clip(np.ceil(box[:, 1].max()).astype(np.int32), 0, h - 1)

        mask = np.zeros((ymax - ymin + 1, xmax - xmin + 1), dtype=np.uint8)
        box[:, 0] -= xmin
        box[:, 1] -= ymin
        cv2.fillPoly(mask, box.reshape(1, -1, 2).astype(np.int32), 1)
        return cv2.mean(bitmap[ymin:ymax + 1, xmin:xmax + 1], mask)[0] / 255.0
