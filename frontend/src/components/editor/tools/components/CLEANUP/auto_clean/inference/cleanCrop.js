import { createMaskFromBoundingBoxes } from "./createMaskFromBoundingBoxes";
import { getDominantColorAndCount } from "./getDominantColorAndCount";
/**
 * Mapeo de colores a tipos de anotación
 * @constant
 * @type {Object}
 */
export const colorToTypeMap = {
  "#4a90e2": "normal",
  "#ff6b6b": "scream",
  "#9775fa": "touched",
  "#69db7c": "think",
  "#ffa94d": "sentence",
  "#FFFF00": "text",
};

/**
 * Valida si el canvas del recorte está definido
 * @param {Object} crop - Objeto que representa el recorte
 * @returns {boolean} Verdadero si el canvas está definido, falso en caso contrario
 */
const validateCanvas = (crop) => {
  if (!crop.canvas) {
    console.error("Canvas no definido para el recorte:", crop.id);
    return false;
  }
  return true;
};

/**
 * Extiende las coordenadas y el canvas para recortes de tipo "text"
 * @param {Object} crop - Objeto que representa el recorte
 * @param {string} rectType - Tipo de rectángulo (e.g., "text")
 * @returns {Object|null} Objeto con coords y canvas extendidos, o null si falla
 */
const extendRectangleForText = (crop, rectType) => {
  if (rectType !== "text") {
    return { coords: crop.coords, canvas: crop.canvas };
  }

  const EXPANSION = 2;
  const sourceCanvas =
    crop.canvasIndex < crop.images?.length
      ? crop.images[crop.canvasIndex]
      : null;

  if (!sourceCanvas) {
    console.error(
      "No se encontró sourceCanvas para extender el rectángulo:",
      crop.id
    );
    return null;
  }

  const extendedCoords = {
    left: Math.max(0, crop.coords.left - EXPANSION),
    top: Math.max(0, crop.coords.top - EXPANSION),
    width: crop.coords.width + 2 * EXPANSION,
    height: crop.coords.height + 2 * EXPANSION,
  };

  extendedCoords.width = Math.min(
    extendedCoords.width,
    sourceCanvas.width - extendedCoords.left
  );
  extendedCoords.height = Math.min(
    extendedCoords.height,
    sourceCanvas.height - extendedCoords.top
  );

  const extendedCanvas = document.createElement("canvas");
  extendedCanvas.width = extendedCoords.width;
  extendedCanvas.height = extendedCoords.height;
  const ctx = extendedCanvas.getContext("2d");
  ctx.drawImage(
    sourceCanvas,
    extendedCoords.left,
    extendedCoords.top,
    extendedCoords.width,
    extendedCoords.height,
    0,
    0,
    extendedCoords.width,
    extendedCanvas.height
  );

  return { coords: extendedCoords, canvas: extendedCanvas };
};



/**
 * Analiza colores en el área de fondo, excluyendo la máscara de texto
 * @param {HTMLCanvasElement} extendedCanvas - Canvas extendido
 * @param {HTMLCanvasElement} maskCanvas - Canvas de la máscara de texto
 * @returns {Object} Objeto con colores ordenados, porcentaje, colores únicos y total de píxeles
 */
const analyzeMaskedColors = (extendedCanvas, maskCanvas) => {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = extendedCanvas.width;
  tempCanvas.height = extendedCanvas.height;
  const tempCtx = tempCanvas.getContext("2d");

  tempCtx.drawImage(extendedCanvas, 0, 0);
  tempCtx.globalCompositeOperation = "destination-out";
  tempCtx.drawImage(maskCanvas, 0, 0);
  tempCtx.globalCompositeOperation = "source-over";

  const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
  const data = imageData.data;
  const colorCount = {};
  let totalPixels = 0;

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a === 0) continue;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const key = `${r},${g},${b},${a}`;
    colorCount[key] = (colorCount[key] || 0) + 1;
    totalPixels++;
  }

  const sortedColors = Object.entries(colorCount)
    .map(([key, count]) => ({
      color: key.split(",").map(Number),
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const dominantCount = sortedColors[0]?.count || 0;
  const percentage = totalPixels > 0 ? (dominantCount / totalPixels) * 100 : 0;
  const uniqueColors = sortedColors.length;

  return { sortedColors, percentage, uniqueColors, totalPixels };
};

/**
 * Llena la máscara y la imagen con colores representativos
 * @param {Object} crop - Objeto que representa el recorte
 * @param {HTMLCanvasElement} extendedCanvas - Canvas extendido
 * @param {Object} extendedCoords - Coordenadas extendidas
 * @param {HTMLCanvasElement} maskCanvas - Canvas de la máscara
 * @param {Array} sortedColors - Colores ordenados por frecuencia
 * @param {number} percentage - Porcentaje del color dominante
 * @param {number} uniqueColors - Número de colores únicos
 * @returns {Object} Objeto con imagen limpia, URL de máscara y estado del fondo
 */
const fillMaskWithColors = (
  crop,
  extendedCanvas,
  extendedCoords,
  maskCanvas,
  sortedColors,
  percentage,
  uniqueColors
) => {
  const isSolidBackground = true;  // Siempre true cuando se rellena
  if (percentage < 24) {
    return { ...crop, coords: extendedCoords, isSolidBackground: true };
  }

  try {
    const dominantColor = sortedColors[0].color;
    const threshold = uniqueColors > 5 ? 40 : 60;

    const colorDistance = (c1, c2) => {
      const [r1, g1, b1] = c1;
      const [r2, g2, b2] = c2;
      return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
    };

    const similarColors = sortedColors.filter(
      (c) => colorDistance(c.color, dominantColor) < threshold
    );

    let rSum = 0, gSum = 0, bSum = 0, totalCount = 0;
    similarColors.forEach((c) => {
      rSum += c.color[0] * c.count;
      gSum += c.color[1] * c.count;
      bSum += c.color[2] * c.count;
      totalCount += c.count;
    });
    const fillColor = [
      Math.round(rSum / totalCount),
      Math.round(gSum / totalCount),
      Math.round(bSum / totalCount),
      255,
    ];

    const fillCanvas = document.createElement("canvas");
    fillCanvas.width = extendedCoords.width;
    fillCanvas.height = extendedCoords.height;
    const fillCtx = fillCanvas.getContext("2d");
    fillCtx.drawImage(maskCanvas, 0, 0);
    const maskImageData = fillCtx.getImageData(0, 0, fillCanvas.width, fillCanvas.height);
    const maskData = maskImageData.data;

    for (let i = 0; i < maskData.length; i += 4) {
      if (maskData[i + 3] === 0) continue;
      maskData[i] = fillColor[0];
      maskData[i + 1] = fillColor[1];
      maskData[i + 2] = fillColor[2];
      maskData[i + 3] = fillColor[3];
    }
    fillCtx.putImageData(maskImageData, 0, 0);
    const cleanedMaskUrl = fillCanvas.toDataURL("image/png");

    const ctx = extendedCanvas.getContext("2d");
    ctx.drawImage(maskCanvas, 0, 0);
    const imageData = ctx.getImageData(0, 0, extendedCanvas.width, extendedCanvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue;
      data[i] = fillColor[0];
      data[i + 1] = fillColor[1];
      data[i + 2] = fillColor[2];
      data[i + 3] = fillColor[3];
    }
    ctx.putImageData(imageData, 0, 0);

    const cleanedImage = extendedCanvas.toDataURL("image/png");
    return {
      ...crop,
      image: cleanedImage,
      cleanedMaskUrl,
      coords: extendedCoords,
      isSolidBackground,
    };
  } catch (error) {
    console.error(`Error limpiando recorte ${crop.id}:`, error);
    return { ...crop, coords: extendedCoords, isSolidBackground };
  }
};

/**
 * Llena el canvas con un color sólido
 * @param {Object} crop - Objeto que representa el recorte
 * @param {HTMLCanvasElement} canvas - Canvas a llenar
 * @param {Object} coords - Coordenadas del canvas
 * @param {Array} fillColor - Color [R,G,B,A] para llenar
 * @returns {Object} Objeto con imagen limpia, URL de máscara y estado del fondo
 */
const fillSolidBackground = (crop, canvas, coords, fillColor) => {
  try {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = `rgba(${fillColor[0]}, ${fillColor[1]}, ${fillColor[2]}, ${fillColor[3] / 255})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const cleanedImage = canvas.toDataURL("image/png");
    return {
      ...crop,
      image: cleanedImage,
      cleanedMaskUrl: cleanedImage,
      coords,
      isSolidBackground: true,
    };
  } catch (error) {
    console.error(`Error llenando fondo sólido para recorte ${crop.id}:`, error);
    return { ...crop, coords, isSolidBackground: true };
  }
};

/**
 * Limpia un recorte de imagen basado en los resultados de Tesseract OCR
 * @async
 * @param {Object} crop - Objeto que representa el recorte a limpiar
 * @param {Object} tesseractResult - Resultados del OCR de Tesseract
 * @param {string} selectedLanguage - Idioma seleccionado para el OCR
 * @returns {Promise<Object>} Objeto con imagen limpia, máscara, coordenadas y estado
 */
export const cleanCrop = async (crop, tesseractResult, selectedLanguage) => {
  if (!validateCanvas(crop)) {
    return crop;
  }

  const rectType = colorToTypeMap[crop.color.toUpperCase()] || "normal";
  const extended = extendRectangleForText(crop, rectType);
  if (!extended) {
    return crop;
  }

  // Para rectángulos no "text" (globos), siempre usar máscara
  if (rectType !== "text") {
    const maskCanvas = createMaskFromBoundingBoxes(tesseractResult, selectedLanguage);
    if (!maskCanvas) {
      return { ...crop, coords: extended.coords };
    }

    const { sortedColors, percentage, uniqueColors, totalPixels } = analyzeMaskedColors(
      extended.canvas,
      maskCanvas
    );

    return fillMaskWithColors(
      crop,
      extended.canvas,
      extended.coords,
      maskCanvas,
      sortedColors,
      percentage,
      uniqueColors,
      totalPixels
    );
  }

  // Para rectángulos "text" (recortes ajustados)
  let colorStats = getDominantColorAndCount(extended.canvas);
  const maskCanvas = createMaskFromBoundingBoxes(tesseractResult, selectedLanguage);
  if (maskCanvas) {
    colorStats = getDominantColorAndCount(extended.canvas, maskCanvas);
  }

  // Si el fondo es sólido, llenar todo el canvas
  if (colorStats.percentage >= 20 || colorStats.uniqueColors <= 3) {
    return fillSolidBackground(
      crop,
      extended.canvas,
      extended.coords,
      colorStats.color
    );
  }

  // Si no es sólido y hay máscara, llenar solo el área de texto
  if (maskCanvas) {
    const { sortedColors, percentage, uniqueColors } = analyzeMaskedColors(
      extended.canvas,
      maskCanvas
    );
    return fillMaskWithColors(
      crop,
      extended.canvas,
      extended.coords,
      maskCanvas,
      sortedColors,
      percentage,
      uniqueColors
    );
  }

  // Si no hay máscara ni fondo sólido, devolver con coordenadas extendidas
  return { ...crop, coords: extended.coords };
};