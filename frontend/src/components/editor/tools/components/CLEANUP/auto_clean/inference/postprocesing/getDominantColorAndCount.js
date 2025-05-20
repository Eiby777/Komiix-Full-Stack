/**
 * Obtiene el color dominante y estadísticas de una imagen
 * @param {HTMLCanvasElement} canvas - Canvas con la imagen a analizar
 * @param {HTMLCanvasElement} [maskCanvas] - Canvas de máscara opcional para excluir texto
 * @returns {Object} Objeto con:
 *   - color: Array [R,G,B,A] del color dominante
 *   - percentage: Porcentaje de píxeles con color similar
 *   - uniqueColors: Número de colores únicos encontrados
 */
export const getDominantColorAndCount = (canvas, maskCanvas = null) => {
  const ctx = canvas.getContext("2d");
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const colorCount = {};
  const colorSimilarityThreshold = 20;
  let totalPixels = 0;

  const colorDistance = (color1, color2) => {
    const [r1, g1, b1] = color1;
    const [r2, g2, b2] = color2;
    return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
  };

  let maskData = null;
  if (maskCanvas) {
    const maskCtx = maskCanvas.getContext("2d");
    maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height).data;
  }

  for (let i = 0; i < data.length; i += 4) {
    if (maskData && maskData[i + 3] > 0) continue;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    const color = [r, g, b];
    const key = `${r},${g},${b},${a}`;

    let foundSimilar = false;
    for (const existingKey in colorCount) {
      const [er, eg, eb] = existingKey.split(",").slice(0, 3).map(Number);
      const existingColor = [er, eg, eb];
      if (colorDistance(color, existingColor) < colorSimilarityThreshold) {
        colorCount[existingKey] = (colorCount[existingKey] || 0) + 1;
        foundSimilar = true;
        break;
      }
    }
    if (!foundSimilar) {
      colorCount[key] = 1;
    }
    totalPixels++;
  }

  let maxCount = 0;
  let dominantColor = null;
  for (const [color, count] of Object.entries(colorCount)) {
    if (count > maxCount) {
      maxCount = count;
      dominantColor = color.split(",").map(Number);
    }
  }

  const percentage = totalPixels > 0 ? (maxCount / totalPixels) * 100 : 0;
  const uniqueColors = Object.keys(colorCount).length;

  return { color: dominantColor || [255, 255, 255, 255], percentage, uniqueColors };
};

