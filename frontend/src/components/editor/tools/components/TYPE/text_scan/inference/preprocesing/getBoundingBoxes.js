import { Furigana } from './furigana.js';

class CanvasPreProcessor {
  constructor(scaleFactor = 3.5, darkBgThreshold = 0.6) {
    this.scaleFactor = scaleFactor;
    this.darkBgThreshold = darkBgThreshold;
    this.borderWidth = 10;
    this.targetTextHeight = { min: 20, max: 30 }; //
  }

  /**
   * Convierte el canvas a escala de grises
   * @param {HTMLCanvasElement} canvas - Canvas a procesar
   * @returns {HTMLCanvasElement} Canvas en escala de grises
   */
  convertToGrayscale(canvas) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const gray = 0.299 * r + 0.587 * g + 0.114 * b; // Fórmula de luminancia
      data[i] = data[i + 1] = data[i + 2] = gray;
      data[i + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  /**
   * Detecta el tamaño de una letra a partir del pixel superior izquierdo negro
   * @param {HTMLCanvasElement} canvas - Canvas binarizado
   * @param {number} textValue - Valor del texto
   * @returns {Object} { width: number, height: number, letterImage64: string } Tamaño de la letra en píxeles y imagen data64 del rectangulo de la letra encontrada
   */
  detectLetterSize(canvas, textValue) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    // Función auxiliar para verificar si un bloque de 3x3 contiene textValue
    function hasTextInBlock(startX, startY, checkHeight = 3, checkWidth = 3) {
      for (let y = Math.max(0, startY); y < Math.min(height, startY + checkHeight); y++) {
        for (let x = Math.max(0, startX); x < Math.min(width, startX + checkWidth); x++) {
          const idx = (y * width + x) * 4;
          if (data[idx] === textValue) {
            return true;
          }
        }
      }
      return false;
    }

    // Función auxiliar para verificar si una fila está vacía (sin textValue)
    function isRowEmpty(y, startX, endX) {
      for (let x = Math.max(0, startX); x <= Math.min(width - 1, endX); x++) {
        const idx = (y * width + x) * 4;
        if (data[idx] === textValue) {
          return false;
        }
      }
      return true;
    }

    // Función auxiliar para verificar si una columna está vacía (sin textValue)
    function isColumnEmpty(x, startY, endY) {
      for (let y = Math.max(0, startY); y <= Math.min(height - 1, endY); y++) {
        const idx = (y * width + x) * 4;
        if (data[idx] === textValue) {
          return false;
        }
      }
      return true;
    }

    // Buscar el primer bloque de 3x3 con texto desde la esquina superior izquierda
    let startX = 0, startY = 0;
    outerLoop: for (let y = 0; y < height; y += 3) {
      for (let x = 0; x < width; x += 3) {
        if (hasTextInBlock(x, y)) {
          startX = x;
          startY = y;
          break outerLoop;
        }
      }
    }

    // Expandir hasta encontrar los límites iniciales de la letra
    let left = startX, top = startY, right = startX, bottom = startY;
    const maxExpansion = 90; // Cubre letras altas como la "I"

    // Expandir hacia la izquierda
    for (let x = startX; x > Math.max(0, startX - maxExpansion); x -= 3) {
      if (!hasTextInBlock(x - 3, top, 3, 3)) break;
      left = x - 3;
    }

    // Expandir hacia arriba
    for (let y = startY; y > Math.max(0, startY - maxExpansion); y -= 3) {
      if (!hasTextInBlock(left, y - 3, 3, right - left + 3)) break;
      top = y - 3;
    }

    // Expandir hacia la derecha
    for (let x = startX; x < Math.min(width - 3, startX + maxExpansion); x += 3) {
      if (!hasTextInBlock(x + 3, top, 3, 3)) break;
      right = x + 3;
    }

    // Expandir hacia abajo
    for (let y = startY; y < Math.min(height - 3, startY + maxExpansion); y += 3) {
      if (!hasTextInBlock(left, y + 3, 3, right - left + 3)) break;
      bottom = y + 3;
    }

    // Refinar los límites para eliminar filas y columnas vacías
    // Ajustar 'top' (eliminar filas vacías desde arriba)
    while (top < bottom && isRowEmpty(top, left, right)) {
      top++;
    }

    // Ajustar 'bottom' (eliminar filas vacías desde abajo)
    while (bottom > top && isRowEmpty(bottom, left, right)) {
      bottom--;
    }

    // Ajustar 'left' (eliminar columnas vacías desde la izquierda)
    while (left < right && isColumnEmpty(left, top, bottom)) {
      left++;
    }

    // Ajustar 'right' (eliminar columnas vacías desde la derecha)
    while (right > left && isColumnEmpty(right, top, bottom)) {
      right--;
    }

    const letterWidth = right - left + 1; // Ajustar al área exacta
    const letterHeight = bottom - top + 1;

    // Crear una imagen data64 del rectángulo encerrado de la letra encontrada
    const letterCanvas = document.createElement('canvas');
    letterCanvas.width = letterWidth;
    letterCanvas.height = letterHeight;
    const letterCtx = letterCanvas.getContext('2d');
    letterCtx.drawImage(canvas, left, top, letterWidth, letterHeight, 0, 0, letterWidth, letterHeight);
    const letterImage64 = letterCanvas.toDataURL();

    return { width: letterWidth, height: letterHeight, letterImage64 };
  }
  /**
    * Escala el canvas para que la altura del texto esté entre 20 y 30 píxeles
    * @param {HTMLCanvasElement} canvas - Canvas a escalar
    * @param {Object} scaleFactor - Factor de escala
    * @returns {HTMLCanvasElement} Canvas escalado
    */
  scale(canvas, scaleFactor) {
    const factor = 25 / scaleFactor.height;
    const scaledCanvas = document.createElement('canvas');
    const ctx = scaledCanvas.getContext('2d');
    scaledCanvas.width = canvas.width * factor;
    scaledCanvas.height = canvas.height * factor;
    ctx.scale(factor, factor);
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
    return scaledCanvas;
  }
  /**
   * Suaviza la imagen para mejorar la calidad de OCR
   * @param {HTMLCanvasElement} canvas - Canvas a suavizar
   * @returns {HTMLCanvasElement} Canvas suavizado
   */
  smoothForOCR(canvas) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    // Suavizado específico para OCR en imágenes binarias
    const threshold = 128; // Umbral para blanco/negro

    // Crear una copia de los datos para el suavizado
    const smoothedData = new Uint8ClampedArray(data);

    // Aplicar suavizado con kernel 3x3 en cada píxel
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let sum = 0;
        let count = 0;

        // Kernel 3x3 para suavizado
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;

            // Verificar si estamos dentro de los límites
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const idx = (ny * width + nx) * 4;
              sum += data[idx]; // Solo usamos el canal rojo ya que es binario
              count++;
            }
          }
        }

        // Calcular el nuevo valor basado en el promedio del vecindario
        const idx = (y * width + x) * 4;
        const avg = sum / count;

        // Aplicar umbral suave para mantener bordes pero suavizar ruido
        const newValue = avg > threshold ? 255 : 0;

        smoothedData[idx] = smoothedData[idx + 1] = smoothedData[idx + 2] = newValue;
        smoothedData[idx + 3] = 255; // Mantener alpha
      }
    }

    // Actualizar la imagen con los datos suavizados
    ctx.putImageData(new ImageData(smoothedData, width, height), 0, 0);
    return canvas;
  }

  /**
    * Aplica un filtro de enfoque (unsharp masking simplificado)
    * @param {HTMLCanvasElement} canvas - Canvas a enfocar
    * @returns {HTMLCanvasElement} Canvas enfocado
    */
  unsharpMask(canvas) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    const blurredData = new Uint8ClampedArray(data);
    const radius = 5;
    const fract = 2.5;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let sum = 0;
        let count = 0;
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const idx = (ny * width + nx) * 4;
              sum += blurredData[idx];
              count++;
            }
          }
        }
        const idx = (y * width + x) * 4;
        const avg = sum / count;
        blurredData[idx] = blurredData[idx + 1] = blurredData[idx + 2] = avg;
      }
    }

    for (let i = 0; i < data.length; i += 4) {
      const original = data[i];
      const blurred = blurredData[i];
      const sharpened = original + fract * (original - blurred);
      const value = Math.max(0, Math.min(255, sharpened));
      data[i] = data[i + 1] = data[i + 2] = value;
      data[i + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  /**
 * Reduce el ruido eliminando blobs pequeños
 * @param {HTMLCanvasElement} canvas - Canvas binarizado
 * @param {number} backgroundValue - Valor del fondo
 * @param {number} textValue - Valor del texto
 * @returns {HTMLCanvasElement} Canvas con ruido reducido
 */
  removeNoise(canvas, backgroundValue, textValue) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    const minBlobSize = 6; // Tamaño mínimo para considerar un blob

    const visited = new Array(height).fill().map(() => new Array(width).fill(false));
    const toRemove = new Set();

    const floodFill = (x, y) => {
      const stack = [[x, y]];
      const blob = [];
      while (stack.length > 0) {
        const [cx, cy] = stack.pop();
        if (cx < 0 || cx >= width || cy < 0 || cy >= height || visited[cy][cx] || data[(cy * width + cx) * 4] !== textValue) {
          continue;
        }
        visited[cy][cx] = true;
        blob.push([cx, cy]);
        stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
      }
      return blob;
    };

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (!visited[y][x] && data[(y * width + x) * 4] === textValue) {
          const blob = floodFill(x, y);
          if (blob.length < minBlobSize) {
            blob.forEach(([bx, by]) => toRemove.add(by * width + bx));
          }
        }
      }
    }

    for (const idx of toRemove) {
      const dataIdx = idx * 4;
      data[dataIdx] = data[dataIdx + 1] = data[dataIdx + 2] = backgroundValue;
      data[dataIdx + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  /**
   * Detecta e invierte el fondo oscuro basado en valores predefinidos
   * @param {HTMLCanvasElement} canvas - Canvas binarizado
   * @param {number} backgroundValue - Valor del fondo (0 o 255)
   * @param {number} textValue - Valor del texto (0 o 255)
   * @returns {Object} Objeto con el canvas procesado, backgroundValue y textValue
   */
  detectAndInvertDarkBackground(canvas, backgroundValue, textValue) {
    let finalBackgroundValue = backgroundValue;
    let finalTextValue = textValue;

    if (backgroundValue === 0) { // Fondo oscuro, invertir colores
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = data[i + 1] = data[i + 2] = 255 - data[i]; // Invertir colores
        data[i + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
      // Actualizar los valores después de la inversión
      finalBackgroundValue = 255;
      finalTextValue = 0;
    }

    return { canvas, backgroundValue: finalBackgroundValue, textValue: finalTextValue };
  }



  /**
   * Recorta el canvas al área del texto
   * @param {HTMLCanvasElement} canvas - Canvas binarizado
   * @param {{x:number, y:number, w:number, h:number}} boundingRect - Coordenadas de recorte
   * @returns {HTMLCanvasElement} Canvas recortado
   */
  clipToForeground(canvas, boundingRect) {
    const ctx = canvas.getContext('2d');
    const clippedCanvas = document.createElement('canvas');
    clippedCanvas.width = boundingRect.w;
    clippedCanvas.height = boundingRect.h;
    const clippedCtx = clippedCanvas.getContext('2d');
    clippedCtx.drawImage(canvas, boundingRect.x, boundingRect.y, boundingRect.w, boundingRect.h, 0, 0, boundingRect.w, boundingRect.h);
    return clippedCanvas;
  }

  /**
   * Agrega un borde blanco de 10 píxeles
   * @param {HTMLCanvasElement} canvas - Canvas a procesar
   * @returns {HTMLCanvasElement} Canvas con borde
   */
  addBorder(canvas) {
    const borderedCanvas = document.createElement('canvas');
    borderedCanvas.width = canvas.width + 2 * this.borderWidth;
    borderedCanvas.height = canvas.height + 2 * this.borderWidth;
    const ctx = borderedCanvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, borderedCanvas.width, borderedCanvas.height);
    ctx.drawImage(canvas, this.borderWidth, this.borderWidth);
    return borderedCanvas;
  }

  /**
   * Procesa el canvas para OCR
   * @param {HTMLCanvasElement} canvas - Canvas original
   * @param {Object} background - Propiedades del fondo
   * @param {Object} text - Propiedades del texto
   * @param {boolean} verticalText - Orientación del texto
   * @param {boolean} removeFurigana - Si eliminar furigana
   * @param {Function} binarizeCanvas - Función para binarizar
   * @param {Function} dilateCanvas - Función para dilatar
   * @param {Function} removeBorderText - Función para eliminar bordes conectados
   * @param {Function} extractTextBlock - Función para extraer bloques de texto
   * @returns {Object{HTMLCanvasElement, Object}} Canvas procesado y coordenadas del texto
   */
  processForOCR(canvas, background, text, textColor, color, verticalText, removeFurigana, binarizeCanvas, dilateCanvas, removeBorderText, extractTextBlock) {
    let processedCanvas = this.convertToGrayscale(canvas);
    processedCanvas = binarizeCanvas(processedCanvas, background, text, false);
    const backgroundValue = background.color === 'oscuro' ? 0 : 255;
    const textValue = background.color === 'oscuro' ? 255 : 0;
    const { canvas: invertedCanvas, backgroundValue: finalBackgroundValue, textValue: finalTextValue } =
      this.detectAndInvertDarkBackground(processedCanvas, backgroundValue, textValue);
    processedCanvas = invertedCanvas;

    if (color !== textColor) {
      processedCanvas = removeBorderText(processedCanvas, finalBackgroundValue, finalTextValue);
    }
    processedCanvas = binarizeCanvas(processedCanvas, background, text, false);
    const letterSize = this.detectLetterSize(processedCanvas, finalTextValue);

    processedCanvas = this.unsharpMask(processedCanvas);
    processedCanvas = this.removeNoise(processedCanvas, finalBackgroundValue, finalTextValue);
    const binarizedCanvas = binarizeCanvas(processedCanvas, background, text, false);

    const dilatedCanvas = dilateCanvas(binarizedCanvas);
    const center_x = dilatedCanvas.width / 2;
    const center_y = dilatedCanvas.height / 2;
    const boundingRect = extractTextBlock(dilatedCanvas, background, center_x, center_y, true);
    if (!boundingRect) {
      console.error("No se pudo detectar el texto en el canvas");
    }
    const furiganaProcessor = new Furigana();
    if (removeFurigana) {
      const { canvas: updatedCanvas, numTextLines } = verticalText
        ? furiganaProcessor.eraseFuriganaVertical(processedCanvas, this.scaleFactor)
        : furiganaProcessor.eraseFuriganaHorizontal(processedCanvas, this.scaleFactor);
      processedCanvas = updatedCanvas;
    }

    processedCanvas = this.clipToForeground(processedCanvas, boundingRect);

    const scaledCanvas = this.scale(processedCanvas, letterSize);
    processedCanvas = scaledCanvas;
    processedCanvas = this.addBorder(processedCanvas);
    processedCanvas = this.smoothForOCR(processedCanvas);


    return { processedCanvas, boundingRect, binarizedCanvas };
  }
}

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
    this.canvasPreProcessor = new CanvasPreProcessor(this.scaleFactor, this.darkBgThreshold);
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
  * @param {boolean} dilate - Whether to apply dilation to connect text
  * @returns {HTMLCanvasElement} Binarized canvas copy
  */
  binarizeCanvas(canvas, background, text, dilate = true) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
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

    if (dilate) {
      canvas = this.dilateCanvas(canvas);
    }

    return canvas;
  }

  /**
 * Applies dilation to a binarized canvas copy
 * @param {HTMLCanvasElement} canvas - Input canvas to dilate
 * @param {number} iterations - Number of dilation iterations
 * @returns {HTMLCanvasElement} Dilated canvas copy
 */
  dilateCanvas(canvas, iterations = 2) {
    const copyCanvas = document.createElement('canvas');
    copyCanvas.width = canvas.width;
    copyCanvas.height = canvas.height;
    const ctx = copyCanvas.getContext('2d');
    ctx.drawImage(canvas, 0, 0);

    const imageData = ctx.getImageData(0, 0, copyCanvas.width, copyCanvas.height);
    let currentData = imageData.data;

    const dilationRadius = 2; // 5x5 window (radius 2)

    for (let iter = 0; iter < iterations; iter++) {
      const newData = new Uint8ClampedArray(currentData.length);
      for (let i = 0; i < currentData.length; i += 4) {
        const x = (i / 4) % copyCanvas.width;
        const y = Math.floor((i / 4) / copyCanvas.width);
        let isBackground = currentData[i] === 0; // Check for black (background)
        if (!isBackground) { // If pixel is not black, check neighbors
          for (let dy = -dilationRadius; dy <= dilationRadius; dy++) {
            for (let dx = -dilationRadius; dx <= dilationRadius; dx++) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= 0 && nx < copyCanvas.width && ny >= 0 && ny < copyCanvas.height) {
                const nIdx = (ny * copyCanvas.width + nx) * 4;
                if (currentData[nIdx] === 0) { // If neighbor is black
                  isBackground = true;
                  break;
                }
              }
            }
            if (isBackground) break;
          }
        }
        newData[i] = newData[i + 1] = newData[i + 2] = isBackground ? 0 : 255; // Black if background, white otherwise
        newData[i + 3] = 255; // Opaque
      }
      currentData = newData;
    }

    const outputImageData = new ImageData(currentData, copyCanvas.width, copyCanvas.height);
    ctx.putImageData(outputImageData, 0, 0);

    return copyCanvas;
  }

  removeBorderText(canvas, backgroundValue, textValue) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    const visited = new Array(height).fill().map(() => new Array(width).fill(false));
    const toInvert = new Set();

    const floodFill = (x, y) => {
      const stack = [[x, y]];
      while (stack.length > 0) {
        const [cx, cy] = stack.pop();
        const idx = (cy * width + cx) * 4;
        if (cx < 0 || cx >= width || cy < 0 || cy >= height || visited[cy][cx] || data[idx] !== textValue) {
          continue;
        }
        visited[cy][cx] = true;
        toInvert.add(idx / 4);
        stack.push([cx + 1, cy]);
        stack.push([cx - 1, cy]);
        stack.push([cx, cy + 1]);
        stack.push([cx, cy - 1]);
      }
    };

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

    for (const idx of toInvert) {
      const dataIdx = idx * 4;
      data[dataIdx] = data[dataIdx + 1] = data[dataIdx + 2] = backgroundValue;
      data[dataIdx + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  extractTextBlock(canvas, background, pt_x, pt_y) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const backgroundValue = background.color === 'oscuro' ? 0 : 255;
    const textValue = background.color === 'oscuro' ? 255 : 0;

    if (backgroundValue !== 0 && backgroundValue !== 255) {
      console.warn(`Invalid backgroundValue: ${backgroundValue}. Expected 0 or 255.`);
    }

    pt_x = Math.round(pt_x);
    pt_y = Math.round(pt_y);
    pt_x = Math.max(0, Math.min(pt_x, canvas.width - 1));
    pt_y = Math.max(0, Math.min(pt_y, canvas.height - 1));

    const initialIdx = (pt_y * canvas.width + pt_x) * 4;

    if (data[initialIdx] !== textValue || data[initialIdx + 1] !== textValue || data[initialIdx + 2] !== textValue) {
      let foundTextPixel = false;
      const searchRadius = 5;
      for (let dy = -searchRadius; dy <= searchRadius && !foundTextPixel; dy++) {
        for (let dx = -searchRadius; dx <= searchRadius && !foundTextPixel; dx++) {
          const newX = pt_x + dx;
          const newY = pt_y + dy;
          if (newX >= 0 && newX < canvas.width && newY >= 0 && newY < canvas.height) {
            const idx = (newY * canvas.width + newX) * 4;
            if (data[idx] === textValue && data[idx + 1] === textValue && data[idx + 2] === textValue) {
              pt_x = newX;
              pt_y = newY;
              foundTextPixel = true;
            }
          }
        }
      }
      if (!foundTextPixel) {
        console.error(`No se encontró píxel de texto en el radio de búsqueda. Retornando null.`);
        return null;
      }
    }

    const maxNoTextIterations = Math.min(Math.round((Math.min(canvas.width, canvas.height) / 10) * this.scaleFactor), 100);
    for (let i = -maxNoTextIterations; i <= maxNoTextIterations; i++) {
      for (let j = -maxNoTextIterations; j <= maxNoTextIterations; j++) {
        const newX = pt_x + j;
        const newY = pt_y + i;
        if (newX >= 0 && newX < canvas.width && newY >= 0 && newY < canvas.height) {
          const idx = (newY * canvas.width + newX) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
        }
      }
    }

    let left = pt_x;
    let top = pt_y;
    let right = pt_x;
    let bottom = pt_y;

    let leftNoTextCount = 0;
    let topNoTextCount = 0;
    let rightNoTextCount = 0;
    let bottomNoTextCount = 0;

    let expandLeft = true;
    let expandTop = true;
    let expandRight = true;
    let expandBottom = true;

    while (expandLeft || expandTop || expandRight || expandBottom) {
      let foundTextThisIteration = false;

      if (expandLeft && left > 0) {
        let foundText = false;
        const xStart = Math.max(0, left - 1);
        const xEnd = Math.max(0, left - 5); // Aumentar rango de búsqueda
        for (let x = xStart; x >= xEnd; x--) {
          for (let y = top; y <= bottom; y++) {
            const idx = (y * canvas.width + x) * 4;
            if (data[idx] !== backgroundValue || data[idx + 1] !== backgroundValue || data[idx + 2] !== backgroundValue) {
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

      if (expandTop && top > 0) {
        let foundText = false;
        const yStart = Math.max(0, top - 1);
        const yEnd = Math.max(0, top - 5); // Aumentar rango de búsqueda
        for (let y = yStart; y >= yEnd; y--) {
          for (let x = left; x <= right; x++) {
            const idx = (y * canvas.width + x) * 4;
            if (data[idx] !== backgroundValue || data[idx + 1] !== backgroundValue || data[idx + 2] !== backgroundValue) {
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

      if (expandRight && right < canvas.width - 1) {
        let foundText = false;
        const xStart = Math.min(canvas.width - 1, right + 1);
        const xEnd = Math.min(canvas.width - 1, right + 5); // Aumentar rango de búsqueda
        for (let x = xStart; x <= xEnd; x++) {
          for (let y = top; y <= bottom; y++) {
            const idx = (y * canvas.width + x) * 4;
            if (data[idx] !== backgroundValue || data[idx + 1] !== backgroundValue || data[idx + 2] !== backgroundValue) {
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

      if (expandBottom && bottom < canvas.height - 1) {
        let foundText = false;
        const yStart = Math.min(canvas.height - 1, bottom + 1);
        const yEnd = Math.min(canvas.height - 1, bottom + 5); // Aumentar rango de búsqueda
        for (let y = yStart; y <= yEnd; y++) {
          for (let x = left; x <= right; x++) {
            const idx = (y * canvas.width + x) * 4;
            if (data[idx] !== backgroundValue || data[idx + 1] !== backgroundValue || data[idx + 2] !== backgroundValue) {
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

      if (!foundTextThisIteration && !expandLeft && !expandTop && !expandRight && !expandBottom) {
        break;
      }
    }

    const w = right - left + 1;
    const h = bottom - top + 1;
    if (w < 3 || h < 3) {
      return null;
    }
    return { x: left, y: top, w, h };
  }

  processImages(analysisResults, selectedLanguage) {
    const textColor = "#FFFF00";
    this.setRemoveFurigana(selectedLanguage === 'jap');
    const processedGroupedResults = [];
    analysisResults.forEach((canvasGroup, canvasIndex) => {
      if (!canvasGroup || canvasGroup.length === 0) {
        processedGroupedResults[canvasIndex] = [];
        return; 
      }
      if (!processedGroupedResults[canvasIndex]) {
        processedGroupedResults[canvasIndex] = [];
      }
      canvasGroup.forEach(result => {
        const { canvas, id, coords, color, image, background, text } = result;
        if (result.error) {
          processedGroupedResults[canvasIndex].push({ ...result, boundingRect: null, numTextLines: 0, annotatedImage: null, ocrCanvas: null });
          return;
        }
  
        const { processedCanvas, boundingRect, binarizedCanvas } = this.canvasPreProcessor.processForOCR(
          canvas,
          background,
          text,
          textColor,
          color,
          this.verticalText,
          this.removeFurigana,
          this.binarizeCanvas.bind(this),
          this.dilateCanvas.bind(this),
          this.removeBorderText.bind(this),
          this.extractTextBlock.bind(this)
        );
  
        processedGroupedResults[canvasIndex].push({
          id,
          coords,
          color,
          image,
          canvas,
          canvasIndex, // Keep canvasIndex for consistency
          ocrCanvas: processedCanvas,
          boundingRect,
          binarizedCanvas,
        });
      });
    });
  
    return processedGroupedResults;
  }
}