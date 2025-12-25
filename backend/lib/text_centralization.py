"""
Text Centralization Library for Manga/Comic Bubble Text Placement

This module provides functionality to analyze speech bubbles in manga/comic images
and calculate optimal text placement with automatic font sizing and Spanish hyphenation.
"""

import cv2
import numpy as np
from PIL import ImageFont
import pyphen
from typing import Tuple, List, Optional


def get_bubble_mask(image: np.ndarray, seed_point: Tuple[int, int]) -> np.ndarray:
    """
    Extracts the bubble mask using flood fill from a seed point.
    
    Args:
        image: Input image (numpy array).
        seed_point: Tuple (x, y) inside the bubble.
        
    Returns:
        binary_mask: A binary mask (0 and 255) of the bubble.
    """
    # Convert to grayscale if needed
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image

    # Create a mask for floodFill (needs to be 2 pixels larger than image)
    h, w = gray.shape[:2]
    mask = np.zeros((h + 2, w + 2), np.uint8)
    
    # Flood fill
    # We assume the bubble interior is somewhat uniform. 
    # Using a loDiff and upDiff to handle some noise or compression artifacts.
    flags = 4 | (255 << 8) | cv2.FLOODFILL_FIXED_RANGE | cv2.FLOODFILL_MASK_ONLY
    cv2.floodFill(gray, mask, seed_point, 255, loDiff=(5, 5, 5), upDiff=(5, 5, 5), flags=flags)
    
    # Crop the mask back to original size
    binary_mask = mask[1:-1, 1:-1]
    
    return binary_mask


def largest_rectangle_in_histogram(heights: List[int]) -> Tuple[int, Tuple[int, int, int]]:
    """
    Finds the largest rectangle in a histogram.
    
    Args:
        heights: List of heights.
        
    Returns:
        max_area, (x, h_rect, w) relative to the histogram row.
    """
    stack = []
    max_area = 0
    best_rect = (0, 0, 0)  # x, h_rect, w
    
    # Append a 0 to flush the stack at the end
    heights = list(heights) + [0]
    
    for i, h in enumerate(heights):
        start = i
        while stack and stack[-1][1] > h:
            index, height = stack.pop()
            width = i - index
            area = width * height
            if area > max_area:
                max_area = area
                best_rect = (index, height, width) 
            start = index
        stack.append((start, h))
        
    return max_area, best_rect


def get_largest_inscribed_rect(mask: np.ndarray) -> Tuple[int, int, int, int]:
    """
    Finds the largest axis-aligned inscribed rectangle in a binary mask.
    
    Args:
        mask: Binary mask (numpy array, 0 and 255).
        
    Returns:
        (x, y, w, h) of the largest rectangle.
    """
    # Ensure mask is 0 and 1
    binary = (mask > 0).astype(np.int32)
    rows, cols = binary.shape
    
    heights = np.zeros(cols, dtype=np.int32)
    max_area = 0
    best_rect = (0, 0, 0, 0)  # x, y, w, h
    
    for r in range(rows):
        # Update heights: if binary[r, c] is 1, increment height, else reset to 0
        heights = (heights + 1) * binary[r]
        
        area, (x_rel, h_rect, w_rect) = largest_rectangle_in_histogram(heights)
        
        if area > max_area:
            max_area = area
            # The rectangle bottom is at row r.
            # Top is at r - h_rect + 1
            best_rect = (x_rel, r - h_rect + 1, w_rect, h_rect)
            
    return best_rect


def calculate_centroid(mask: np.ndarray) -> Tuple[int, int]:
    """
    Calculates the centroid of the mask.
    
    Args:
        mask: Binary mask (numpy array).
        
    Returns:
        (cX, cY): Centroid coordinates.
    """
    M = cv2.moments(mask)
    if M["m00"] != 0:
        cX = int(M["m10"] / M["m00"])
        cY = int(M["m01"] / M["m00"])
    else:
        cX, cY = 0, 0
    return cX, cY


def wrap_text_with_hyphenation(
    text: str, 
    font: ImageFont.FreeTypeFont, 
    max_width: float, 
    language: str = 'es'
) -> Tuple[List[str], List[Tuple[int, str, str]]]:
    """
    Wraps text based on actual pixel width with hyphenation support.
    
    Args:
        text: Text to wrap.
        font: PIL ImageFont object.
        max_width: Maximum width in pixels.
        language: Language code for hyphenation (default: 'es' for Spanish).
        
    Returns:
        (lines, hyphenations) where hyphenations is a list of tuples:
        (line_index, word_text_before_hyphen, word_text_after_hyphen)
    """
    hyphenator = pyphen.Pyphen(lang=language)
    words = text.split()
    lines = []
    hyphenations = []  # List of (line_index, before_text, after_text)
    current_line = []
    
    for word in words:
        # Try adding this word to current line
        test_line = ' '.join(current_line + [word])
        test_width = font.getlength(test_line)
        
        if test_width <= max_width:
            current_line.append(word)
        else:
            # Word doesn't fit, try hyphenation
            if current_line:
                # Try to fit the word with hyphenation
                hyphenated = False
                
                # Get all possible hyphenation points
                pairs = hyphenator.iterate(word)
                best_split = None
                
                for before, after in pairs:
                    # Try adding "before-" to current line
                    test_with_hyphen = ' '.join(current_line + [before + '-'])
                    if font.getlength(test_with_hyphen) <= max_width:
                        best_split = (before, after)
                    else:
                        break  # No point checking shorter splits
                
                if best_split:
                    before, after = best_split
                    current_line.append(before + '-')
                    lines.append(' '.join(current_line))
                    hyphenations.append((len(lines) - 1, before, after))
                    current_line = [after]
                    hyphenated = True
                
                if not hyphenated:
                    # Couldn't hyphenate or word is too long even with hyphenation
                    lines.append(' '.join(current_line))
                    current_line = [word]
            else:
                # Current line is empty, word is too long
                # Try to hyphenate it anyway
                pairs = list(hyphenator.iterate(word))
                if pairs:
                    before, after = pairs[0]  # Take first valid split
                    lines.append(before + '-')
                    hyphenations.append((len(lines) - 1, before, after))
                    current_line = [after]
                else:
                    # Can't hyphenate, add it anyway
                    lines.append(word)
    
    # Add remaining words
    if current_line:
        lines.append(' '.join(current_line))
    
    return lines, hyphenations


def calculate_optimal_font_size(
    text: str, 
    font_path: str, 
    max_w: float, 
    max_h: float
) -> Tuple[int, List[Tuple[int, str, str]]]:
    """
    Calculates the largest font size such that the text fits in the box.
    
    Args:
        text: Text to fit.
        font_path: Path to the font file.
        max_w: Maximum width in pixels.
        max_h: Maximum height in pixels.
        
    Returns:
        (font_size, hyphenations)
    """
    low = 1
    high = 500  # Reasonable upper bound
    best_size = 1
    best_hyphenations = []
    
    while low <= high:
        mid = (low + high) // 2
        try:
            font = ImageFont.truetype(font_path, mid)
        except Exception:
            # Fallback if font loading fails
            return 10, []
            
        # Wrap text using hyphenation-aware wrapping
        lines, hyphenations = wrap_text_with_hyphenation(text, font, max_w)
        
        # Measure actual size
        max_line_w = 0
        total_h = 0
        
        # Get line height (ascent + descent)
        ascent, descent = font.getmetrics()
        line_height = ascent + descent
        
        total_h = len(lines) * line_height
        
        for line in lines:
            w = font.getlength(line)
            if w > max_line_w:
                max_line_w = w
                
        if max_line_w <= max_w and total_h <= max_h:
            best_size = mid
            best_hyphenations = hyphenations
            low = mid + 1
        else:
            high = mid - 1
            
    return best_size, best_hyphenations


def process_bubble(
    image_path: str, 
    seed_point: Tuple[int, int], 
    font_path: str, 
    text: str
) -> Tuple[Tuple[int, int, int, int], int, List[Tuple[int, str, str]]]:
    """
    Main function to analyze the bubble and calculate optimal text placement.
    
    Args:
        image_path: Path to the image file.
        seed_point: Tuple (x, y) inside the bubble.
        font_path: Path to the font file.
        text: The text to place inside.
        
    Returns:
        ((x, y, h, w), font_size, hyphenations)
    """
    # 1. Load Image
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Could not load image at {image_path}")
        
    # 2. Get Mask
    mask = get_bubble_mask(image, seed_point)
    mask_area = np.count_nonzero(mask)
    
    # 3. Get Largest Inscribed Rectangle
    rx, ry, rw, rh = get_largest_inscribed_rect(mask)
    rect_area = rw * rh
    
    # 4. Apply 80% Area Rule
    # Scale down if rectangle is too large to provide margins
    target_area = mask_area * 0.8
    
    final_w, final_h = rw, rh
    final_x, final_y = rx, ry
    
    if rect_area > target_area:
        # Scale down
        scale = (target_area / rect_area) ** 0.5
        final_w = int(rw * scale)
        final_h = int(rh * scale)
        # Re-center
        center_x = rx + rw // 2
        center_y = ry + rh // 2
        final_x = center_x - final_w // 2
        final_y = center_y - final_h // 2
    
    # 5. Calculate Font Size with Hyphenation
    font_size, hyphenations = calculate_optimal_font_size(text, font_path, final_w, final_h)
    
    return (final_x, final_y, final_h, final_w), font_size, hyphenations


def process_bubble_from_array(
    image: np.ndarray, 
    seed_point: Tuple[int, int], 
    font_path: str, 
    text: str
) -> Tuple[Tuple[int, int, int, int], int, List[Tuple[int, str, str]]]:
    """
    Process bubble from numpy array instead of file path.
    
    Args:
        image: Image as numpy array.
        seed_point: Tuple (x, y) inside the bubble.
        font_path: Path to the font file.
        text: The text to place inside.
        
    Returns:
        ((x, y, h, w), font_size, hyphenations)
    """
    if image is None:
        raise ValueError("Image array is None")
        
    # 2. Get Mask
    mask = get_bubble_mask(image, seed_point)
    mask_area = np.count_nonzero(mask)
    
    # 3. Get Largest Inscribed Rectangle
    rx, ry, rw, rh = get_largest_inscribed_rect(mask)
    rect_area = rw * rh
    
    # 4. Apply 80% Area Rule
    target_area = mask_area * 0.8
    
    final_w, final_h = rw, rh
    final_x, final_y = rx, ry
    
    if rect_area > target_area:
        # Scale down
        scale = (target_area / rect_area) ** 0.5
        final_w = int(rw * scale)
        final_h = int(rh * scale)
        # Re-center
        center_x = rx + rw // 2
        center_y = ry + rh // 2
        final_x = center_x - final_w // 2
        final_y = center_y - final_h // 2
    
    # 5. Calculate Font Size with Hyphenation
    font_size, hyphenations = calculate_optimal_font_size(text, font_path, final_w, final_h)
    
    return (final_x, final_y, final_h, final_w), font_size, hyphenations
