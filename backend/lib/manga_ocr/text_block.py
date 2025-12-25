from dataclasses import dataclass, field
from typing import List, Tuple, Any
import numpy as np

@dataclass
class TextBlock:
    """Data structure for representing a detected text block"""
    xyxy: List[float]  # [x1, y1, x2, y2]
    confidence: float
    lines: List[np.ndarray] = field(default_factory=list)  # Polygons for each line
    mask: np.ndarray = None  # Segmentation mask
    language: str = "unknown"  # eng, ja, or unknown

    def to_dict(self) -> dict:
        """Convert to dictionary for serialization"""
        return {
            "xyxy": self.xyxy,
            "confidence": float(self.confidence),
            "language": self.language
        }

    @property
    def box_int(self) -> Tuple[int, int, int, int]:
        """Returns rounded integer coordinates"""
        return tuple(map(int, self.xyxy))
