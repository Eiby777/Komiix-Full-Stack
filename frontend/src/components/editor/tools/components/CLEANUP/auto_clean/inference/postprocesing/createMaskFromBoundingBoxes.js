/**
 * Crea una máscara canvas basada en un canvas OCR binarizado
 * @param {Object{x,y,w,h}} boundingRect - Bounding rect que define los límites para procesar píxeles
 * @param {HTMLCanvasElement} binarizedCanvas - Canvas con el OCR binarizado (texto en negro, fondo en blanco)
 * @param {HTMLCanvasElement} canvas - Canvas original (no usado en esta versión)
 * @returns {HTMLCanvasElement|null} Canvas con la máscara (texto en blanco, fondo transparente) o null si no es válido
 */
export const createMaskFromBoundingBoxes = (boundingRect, binarizedCanvas, canvas) => {
  if (!boundingRect || !boundingRect.x || !boundingRect.y || !boundingRect.w || !boundingRect.h) {
    console.log("No hay bounding box válido para crear máscara:");
    return null;
  }

  console.log(binarizedCanvas.toDataURL());

  const maskCanvas = document.createElement('canvas');
  const maskCtx = maskCanvas.getContext('2d');
  maskCanvas.width = binarizedCanvas.width;
  maskCanvas.height = binarizedCanvas.height;

  maskCtx.drawImage(binarizedCanvas, 0, 0);

  const imageData = maskCtx.getImageData(
    boundingRect.x,
    boundingRect.y,
    boundingRect.w,
    boundingRect.h
  );
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r < 50 && g < 50 && b < 50) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = 255;
    } else {
      data[i + 3] = 0;
    }
  }

  maskCtx.putImageData(imageData, boundingRect.x, boundingRect.y);

  return maskCanvas;
};