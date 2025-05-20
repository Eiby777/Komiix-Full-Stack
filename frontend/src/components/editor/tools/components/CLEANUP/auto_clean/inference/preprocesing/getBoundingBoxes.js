import { Furigana } from './furigana.js';

/**
 * Preprocesses cropped images to detect text bounding boxes and optionally remove furigana
 */
export class PreProcess {
  constructor() {
    this.scaleFactor = 3.5;
    this.darkBgThreshold = 0.6;
    this.verticalText = false;
    this.removeFurigana = false;
    this.japNumTextLines = 0;
  }

  setVerticalOrientation(value) {
    this.verticalText = value;
  }

  setRemoveFurigana(value) {
    this.removeFurigana = value;
  }

  /**
  * Binarizes a canvas copy based on background and text properties
  * @param {HTMLCanvasElement} canvas - Input canvas to copy and binarize
  * @param {Object} background - {color: 'oscuro' | 'claro', rgb: {r, g, b}}
  * @param {Object} text - {color: 'oscuro' | 'claro', rgb: {r, g, b}}
  * @returns {HTMLCanvasElement} Binarized canvas copy
  */
  binarizeCanvas(canvas, background, text) {
    const copyCanvas = document.createElement('canvas');
    copyCanvas.width = canvas.width;
    copyCanvas.height = canvas.height;
    const ctx = copyCanvas.getContext('2d');
    ctx.drawImage(canvas, 0, 0);

    const imageData = ctx.getImageData(0, 0, copyCanvas.width, copyCanvas.height);
    const data = imageData.data;

    // Define tolerance for color matching
    const tolerance = 30; // Adjustable tolerance for RGB comparison

    // Function to check if two RGB values are similar within tolerance
    const isSimilarColor = (rgb1, rgb2) => {
      const dr = Math.abs(rgb1.r - rgb2.r);
      const dg = Math.abs(rgb1.g - rgb2.g);
      const db = Math.abs(rgb1.b - rgb2.b);
      return dr <= tolerance && dg <= tolerance && db <= tolerance;
    };

    // Determine background value based on background.color
    const backgroundValue = background.color === 'oscuro' ? 0 : 255;
    const textValue = background.color === 'oscuro' ? 255 : 0; // Invert for text

    // Binarize based on background and text colors
    for (let i = 0; i < data.length; i += 4) {
      const pixelRGB = { r: data[i], g: data[i + 1], b: data[i + 2] };
      let value;

      if (isSimilarColor(pixelRGB, background.representative)) {
        value = backgroundValue; // Set to background color
      } else if (isSimilarColor(pixelRGB, text.representative)) {
        value = textValue; // Set to text color (inverted from background)
      } else {
        // For pixels not matching background or text, decide based on dominance
        const lum = 0.299 * pixelRGB.r + 0.587 * pixelRGB.g + 0.114 * pixelRGB.b;
        value = lum < 128 ? textValue : backgroundValue; // Fallback to luminance threshold
      }

      data[i] = data[i + 1] = data[i + 2] = value;
      data[i + 3] = 255; // Maintain alpha
    }

    ctx.putImageData(imageData, 0, 0);

    // Apply multiple iterations of dilation to connect text
    let tempData = new Uint8ClampedArray(data);
    const dilationRadius = 2; // 5x5 window (radius 2)
    const dilationIterations = 2; // As adjusted

    for (let iter = 0; iter < dilationIterations; iter++) {
      const newData = new Uint8ClampedArray(tempData.length);
      for (let i = 0; i < tempData.length; i += 4) {
        const x = (i / 4) % copyCanvas.width;
        const y = Math.floor((i / 4) / copyCanvas.width);
        let isForeground = tempData[i] === textValue;
        if (!isForeground) {
          for (let dy = -dilationRadius; dy <= dilationRadius; dy++) {
            for (let dx = -dilationRadius; dx <= dilationRadius; dx++) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= 0 && nx < copyCanvas.width && ny >= 0 && ny < copyCanvas.height) {
                const nIdx = (ny * copyCanvas.width + nx) * 4;
                if (tempData[nIdx] === textValue) {
                  isForeground = true;
                  break;
                }
              }
            }
            if (isForeground) break;
          }
        }
        newData[i] = newData[i + 1] = newData[i + 2] = isForeground ? textValue : backgroundValue;
        newData[i + 3] = 255;
      }
      tempData = newData;
    }

    ctx.putImageData(new ImageData(tempData, copyCanvas.width, copyCanvas.height), 0, 0);
    return copyCanvas;
  }

  /**
   * Otsu's method for finding optimal threshold
   * @param {Array<number>} luminances - Array of luminance values
   * @returns {number} Threshold value
   */
  otsuThreshold(luminances) {
    const histogram = new Array(256).fill(0);
    for (const lum of luminances) {
      histogram[Math.round(lum)]++;
    }

    const total = luminances.length;
    let sum = 0;
    for (let i = 0; i < 256; i++) sum += i * histogram[i];

    let sumB = 0, wB = 0, maxVariance = 0, threshold = 0;

    for (let t = 0; t < 256; t++) {
      wB += histogram[t];
      if (wB === 0) continue;

      const wF = total - wB;
      if (wF === 0) break;

      sumB += t * histogram[t];
      const mB = sumB / wB;
      const mF = (sum - sumB) / wF;
      const variance = wB * wF * (mB - mF) * (mB - mF);

      if (variance > maxVariance) {
        maxVariance = variance;
        threshold = t;
      }
    }

    return threshold;
  }

  /**
   * Processes cropped images to detect text bounding boxes and generates annotated images
   * @param {Array} analysisResults - Output from getBackgroundColor.js
   * @param {string} selectedLanguage - Language code (e.g., 'jap', 'eng')
   * @returns {Array} Processed results with bounding boxes, updated canvases, and annotated images
   */
  processImages(analysisResults, selectedLanguage) {
    const textColor = "#FFFF00";
    const furiganaProcessor = new Furigana();
    this.setRemoveFurigana(selectedLanguage === 'jap');

    return analysisResults.map(result => {
      const { canvas, id, coords, color, image, canvasIndex, background, text, binarizedThreshold } = result;

      if (result.error) {
        return { ...result, boundingRect: null, numTextLines: 0, annotatedImage: null };
      }

      const pt_x = Math.floor(background.position.x);
      const pt_y = Math.floor(background.position.y);
      
      // Create a binarized copy of the canvas
      const binarizedCanvas = this.binarizeCanvas(canvas, background, text);
      // If result color matches text color, return full canvas bounding box
      if (result.color === textColor) {
        return {
          id,
          coords,
          color,
          image,
          canvas,
          canvasIndex,
          background,
          text,
          binarizedThreshold,
          boundingRect: {
            x: 0,
            y: 0,
            w: canvas.width,
            h: canvas.height
          },
          numTextLines: 0,
          annotatedImage: null
        };
      }

      const backgroundValue = background.color === 'oscuro' ? 0 : 255;
      const textValue = background.color === 'oscuro' ? 255 : 0;
      const cleanedCanvas = this.removeBorderText(binarizedCanvas, backgroundValue, textValue);
      const boundingRect = this.extractTextBlock(cleanedCanvas, background, pt_x, pt_y);

      let processedCanvas = canvas; // Preserve original color canvas
      let numTextLines = 0;
      if (this.removeFurigana) {
        const { canvas: updatedCanvas, numTextLines: lines } = this.verticalText
          ? furiganaProcessor.eraseFuriganaVertical(canvas, this.scaleFactor)
          : furiganaProcessor.eraseFuriganaHorizontal(canvas, this.scaleFactor);
        processedCanvas = updatedCanvas;
        numTextLines = lines;
        this.japNumTextLines = lines;
      }

      const updatedImage = processedCanvas.toDataURL('image/png');

      // Create annotated image with bounding rectangle on the bordered canvas
      let annotatedImage = null;
      if (boundingRect) {
        const annotatedCanvas = document.createElement('canvas');
        annotatedCanvas.width = processedCanvas.width;
        annotatedCanvas.height = processedCanvas.height;
        const ctx = annotatedCanvas.getContext('2d');
        ctx.drawImage(processedCanvas, 0, 0);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;

        ctx.strokeRect(
          boundingRect.x,
          boundingRect.y,
          boundingRect.w,
          boundingRect.h
        );
        annotatedImage = annotatedCanvas.toDataURL('image/png');
      }

      return {
        id,
        coords,
        color,
        image: updatedImage,
        canvas: processedCanvas,
        canvasIndex,
        background,
        text,
        binarizedThreshold,
        boundingRect,
        numTextLines,
        annotatedImage
      };
    });
  }

  /**
   * Removes text regions touching the borders by inverting them to background color
   * @param {HTMLCanvasElement} canvas - Binarized canvas
   * @param {number} backgroundValue - Value of background (0 or 255)
   * @param {number} textValue - Value of text (0 or 255)
   * @returns {HTMLCanvasElement} Canvas with border text removed
   */
  removeBorderText(canvas, backgroundValue, textValue) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    // Create a visited array to track pixels during flood fill
    const visited = new Array(height).fill().map(() => new Array(width).fill(false));
    const toInvert = new Set(); // Set to store indices of pixels to invert

    // Function to perform flood fill from a border pixel
    const floodFill = (x, y) => {
      const stack = [[x, y]];
      while (stack.length > 0) {
        const [cx, cy] = stack.pop();
        const idx = (cy * width + cx) * 4;
        if (cx < 0 || cx >= width || cy < 0 || cy >= height || visited[cy][cx] || data[idx] !== textValue) {
          continue;
        }
        visited[cy][cx] = true;
        toInvert.add(idx / 4); // Store the pixel index
        // Check 4-connected neighbors
        stack.push([cx + 1, cy]);
        stack.push([cx - 1, cy]);
        stack.push([cx, cy + 1]);
        stack.push([cx, cy - 1]);
      }
    };

    // Scan borders for text pixels
    for (let x = 0; x < width; x++) {
      const topIdx = (0 * width + x) * 4;
      const bottomIdx = ((height - 1) * width + x) * 4;
      if (data[topIdx] === textValue && !visited[0][x]) {
        floodFill(x, 0);
      }
      if (data[bottomIdx] === textValue && !visited[height - 1][x]) {
        floodFill(x, height - 1);
      }
    }
    for (let y = 0; y < height; y++) {
      const leftIdx = (y * width + 0) * 4;
      const rightIdx = (y * width + (width - 1)) * 4;
      if (data[leftIdx] === textValue && !visited[y][0]) {
        floodFill(0, y);
      }
      if (data[rightIdx] === textValue && !visited[y][width - 1]) {
        floodFill(width - 1, y);
      }
    }

    // Invert all connected pixels to background color
    for (const idx of toInvert) {
      const dataIdx = idx * 4;
      data[dataIdx] = data[dataIdx + 1] = data[dataIdx + 2] = backgroundValue;
      data[dataIdx + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  /**
   * Detects the bounding box around text in a cleaned binarized canvas
   * @param {HTMLCanvasElement} canvas - Binarized canvas
   * @param {Object} background - Background properties from getBackgroundColor
   * @param {number} pt_x - X coordinate of the starting point
   * @param {number} pt_y - Y coordinate of the starting point
   * @returns {Object|null} Bounding box {x, y, w, h} or null if no text found
   */
  extractTextBlock(canvas, background, pt_x, pt_y) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const backgroundValue = background.color === 'oscuro' ? 0 : 255;
    const textValue = background.color === 'oscuro' ? 255 : 0;

    // Validate backgroundValue to ensure it is used
    if (backgroundValue !== 0 && backgroundValue !== 255) {
      console.warn(`Invalid backgroundValue: ${backgroundValue}. Expected 0 or 255.`);
    }

    // Ensure starting point is within canvas bounds
    pt_x = Math.max(0, Math.min(pt_x, canvas.width - 1));
    pt_y = Math.max(0, Math.min(pt_y, canvas.height - 1));

    // Initialize bounding rectangle at the starting point
    let left = pt_x;
    let top = pt_y;
    let right = pt_x;
    let bottom = pt_y;

    // Calculate maxNoTextIterations dynamically
    const baseIterations = Math.min(canvas.width, canvas.height) / 10;
    const maxNoTextIterations = Math.min(Math.round(baseIterations * this.scaleFactor), 100);

    // Track consecutive iterations without finding text for each side
    let leftNoTextCount = 0;
    let topNoTextCount = 0;
    let rightNoTextCount = 0;
    let bottomNoTextCount = 0;

    // Flags to stop expansion for each side
    let expandLeft = true;
    let expandTop = true;
    let expandRight = true;
    let expandBottom = true;

    // Continue expanding until all sides stop
    while (expandLeft || expandTop || expandRight || expandBottom) {
      let foundTextThisIteration = false;

      // Expand Left
      if (expandLeft && left > 0) {
        let foundText = false;
        const xStart = Math.max(0, left - 1);
        const xEnd = Math.max(0, left - 3); // Check a range of columns
        for (let x = xStart; x >= xEnd; x--) {
          for (let y = top; y <= bottom; y++) {
            const idx = (y * canvas.width + x) * 4;
            if (data[idx] === textValue) {
              foundText = true;
              break;
            }
          }
          if (foundText) break;
        }
        if (foundText) {
          left--;
          leftNoTextCount = 0;
          foundTextThisIteration = true;
        } else {
          leftNoTextCount++;
          if (leftNoTextCount >= maxNoTextIterations) {
            expandLeft = false;
          }
        }
      } else {
        expandLeft = false;
      }

      // Expand Top
      if (expandTop && top > 0) {
        let foundText = false;
        const yStart = Math.max(0, top - 1);
        const yEnd = Math.max(0, top - 3); // Check a range of rows
        for (let y = yStart; y >= yEnd; y--) {
          for (let x = left; x <= right; x++) {
            const idx = (y * canvas.width + x) * 4;
            if (data[idx] === textValue) {
              foundText = true;
              break;
            }
          }
          if (foundText) break;
        }
        if (foundText) {
          top--;
          topNoTextCount = 0;
          foundTextThisIteration = true;
        } else {
          topNoTextCount++;
          if (topNoTextCount >= maxNoTextIterations) {
            expandTop = false;
          }
        }
      } else {
        expandTop = false;
      }

      // Expand Right
      if (expandRight && right < canvas.width - 1) {
        let foundText = false;
        const xStart = Math.min(canvas.width - 1, right + 1);
        const xEnd = Math.min(canvas.width - 1, right + 3); // Check a range of columns
        for (let x = xStart; x <= xEnd; x++) {
          for (let y = top; y <= bottom; y++) {
            const idx = (y * canvas.width + x) * 4;
            if (data[idx] === textValue) {
              foundText = true;
              break;
            }
          }
          if (foundText) break;
        }
        if (foundText) {
          right++;
          rightNoTextCount = 0;
          foundTextThisIteration = true;
        } else {
          rightNoTextCount++;
          if (rightNoTextCount >= maxNoTextIterations) {
            expandRight = false;
          }
        }
      } else {
        expandRight = false;
      }

      // Expand Bottom
      if (expandBottom && bottom < canvas.height - 1) {
        let foundText = false;
        const yStart = Math.min(canvas.height - 1, bottom + 1);
        const yEnd = Math.min(canvas.height - 1, bottom + 3); // Check a range of rows
        for (let y = yStart; y <= yEnd; y++) {
          for (let x = left; x <= right; x++) {
            const idx = (y * canvas.width + x) * 4;
            if (data[idx] === textValue) {
              foundText = true;
              break;
            }
          }
          if (foundText) break;
        }
        if (foundText) {
          bottom++;
          bottomNoTextCount = 0;
          foundTextThisIteration = true;
        } else {
          bottomNoTextCount++;
          if (bottomNoTextCount >= maxNoTextIterations) {
            expandBottom = false;
          }
        }
      } else {
        expandBottom = false;
      }

      // If no text was found in this iteration and all sides have stopped, break
      if (!foundTextThisIteration && !expandLeft && !expandTop && !expandRight && !expandBottom) {
        break;
      }
    }

    // Calculate width and height
    const w = right - left + 1;
    const h = bottom - top + 1;

    // Ensure minimum size
    if (w < 3 || h < 3) {
      return null;
    }
    return { x: left, y: top, w, h };
  }

}