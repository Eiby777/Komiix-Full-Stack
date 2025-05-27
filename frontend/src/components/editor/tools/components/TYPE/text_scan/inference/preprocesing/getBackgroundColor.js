/**
 * Analyzes an array of cropped images to determine background and text colors
 * @param {Array} croppedImages - Array of cropped image objects from croppImages.js
 * @returns {Array} Array of analysis results with background, text properties, and original metadata
 */
export default function getBackgroundColor(croppedImages) {
  const flatCroppedImages = croppedImages.flatMap((canvasRectangles, canvasIndex) =>
    canvasRectangles.map(img => ({ ...img, canvasIndex }))
  );

  return flatCroppedImages.map(croppedImg => {
    const { canvas, id, coords, color, image, canvasIndex } = croppedImg;
    
    if (!canvas) {
      console.error(`No canvas found for cropped image with id ${id}`);
      return { id, coords, color, image, canvasIndex, error: 'No canvas provided' };
    }

    // Create a canvas for the original image
    const originalCanvas = document.createElement('canvas');
    const originalCtx = originalCanvas.getContext('2d');
    originalCanvas.width = canvas.width;
    originalCanvas.height = canvas.height;
    originalCtx.drawImage(canvas, 0, 0);

    // Create a new canvas for binarization analysis
    const analysisCanvas = document.createElement('canvas');
    const ctx = analysisCanvas.getContext('2d');
    analysisCanvas.width = canvas.width;
    analysisCanvas.height = canvas.height;
    ctx.drawImage(canvas, 0, 0);

    // Step 1: Binarize the image (on analysisCanvas)
    const imageData = ctx.getImageData(0, 0, analysisCanvas.width, analysisCanvas.height);
    const data = imageData.data;
    const luminances = [];

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      luminances.push(lum);
    }

    const threshold = otsuThreshold(luminances);
    const binaryData = new Uint8ClampedArray(data.length);

    for (let i = 0; i < data.length; i += 4) {
      const lum = luminances[i / 4];
      const isDark = lum < threshold;
      const value = isDark ? 0 : 255;
      binaryData[i] = binaryData[i + 1] = binaryData[i + 2] = value;
      binaryData[i + 3] = data[i + 3];
    }

    const binaryImageData = new ImageData(binaryData, analysisCanvas.width, analysisCanvas.height);
    ctx.putImageData(binaryImageData, 0, 0);

    // Step 2: Analyze binarized image
    const histogram = new Array(256).fill(0);
    for (let i = 0; i < binaryData.length; i += 4) {
      const lum = binaryData[i];
      histogram[lum]++;
    }

    const darkCount = histogram[0] || 0;
    const lightCount = histogram[255] || 0;
    const isDarkBg = darkCount > lightCount;
    const bgLum = isDarkBg ? 0 : 255;
    const textLum = isDarkBg ? 255 : 0;

    const bgColor = isDarkBg ? 'oscuro' : 'claro';
    const textColor = isDarkBg ? 'claro' : 'oscuro';
    const bgRGB = { r: bgLum, g: bgLum, b: bgLum };
    const textRGB = { r: textLum, g: textLum, b: textLum };

    // Step 4: Find central background and text pixels
    const bgPixel = getCentralBackgroundPixel(ctx, canvas, isDarkBg);
    // Pass the threshold to getCentralTextPixel
    const textPixel = getCentralTextPixel(originalCtx, originalCanvas, isDarkBg, threshold);

    return {
      id,
      coords,
      color,
      image,
      canvas,
      canvasIndex,
      background: {
        color: bgColor,
        rgb: bgRGB,
        representative: bgPixel.color,
        position: bgPixel.position,
        luminance: bgLum
      },
      text: { 
        color: textColor, 
        rgb: textRGB, 
        luminance: textLum,
        representative: textPixel.color,
        position: textPixel.position
      },
      binarizedThreshold: threshold
    };
  });
}
// Otsu's method for finding optimal threshold
function otsuThreshold(luminances) {
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
 * Function to find a text pixel closest to the image center
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {boolean} isDarkBg - Whether the background is dark
 * @param {number} threshold - The luminance threshold from Otsu's method
 * @returns {Object} Pixel coordinates and color
 */
function getCentralTextPixel(ctx, canvas, isDarkBg, threshold) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const center = {
    x: canvas.width / 2,
    y: canvas.height / 2
  };
  
  let closestPixel = null;
  let minDistance = Infinity;
  
  // Search for the pixel closest to the center that is text
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const index = (y * canvas.width + x) * 4;
      const lum = 0.299 * data[index] + 0.587 * data[index + 1] + 0.114 * data[index + 2];
      
      // If it's text (if the background is dark, the pixel should be above the threshold; if the background is light, below the threshold)
      if ((isDarkBg && lum >= threshold) || (!isDarkBg && lum < threshold)) {
        const distance = Math.sqrt(
          (x - center.x) ** 2 + (y - center.y) ** 2
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          closestPixel = {
            position: { x, y },
            color: {
              r: data[index],
              g: data[index + 1],
              b: data[index + 2],
              a: data[index + 3]
            }
          };
        }
      }
    }
  }
  
  return closestPixel || {
    position: { x: 0, y: 0 },
    color: { r: 0, g: 0, b: 0, a: 255 }
  };
}

function getCentralBackgroundPixel(ctx, canvas, isDarkBg) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const searchRadius = Math.min(canvas.width, canvas.height) / 4; // Search within a quarter of the smallest dimension

  // Define luminance thresholds for background pixel
  const lumThreshold = isDarkBg ? 128 : 127;

  // Track the closest pixel
  let bestPixel = null;
  let minDistance = Infinity;

  // Search in a circular area around the center
  for (let y = centerY - searchRadius; y <= centerY + searchRadius; y++) {
    for (let x = centerX - searchRadius; x <= centerX + searchRadius; x++) {
      if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
        const pixelData = ctx.getImageData(x, y, 1, 1).data;
        const lum = 0.299 * pixelData[0] + 0.587 * pixelData[1] + 0.114 * pixelData[2];
        if ((isDarkBg && lum < lumThreshold) || (!isDarkBg && lum > lumThreshold)) {
          // Calculate Euclidean distance from center
          const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
          if (distance < minDistance) {
            minDistance = distance;
            bestPixel = {
              color: { r: pixelData[0], g: pixelData[1], b: pixelData[2] },
              position: { x, y }
            };
          }
        }
      }
    }
  }

  // Fallback to default background color if no suitable pixel is found
  if (!bestPixel) {
    return {
      color: { r: isDarkBg ? 0 : 255, g: isDarkBg ? 0 : 255, b: isDarkBg ? 0 : 255 },
      position: { x: centerX, y: centerY }
    };
  }

  return bestPixel;
}