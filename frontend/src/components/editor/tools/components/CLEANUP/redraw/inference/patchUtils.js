import { decodeBase64Image } from "./imageUtils.js";

export function scalePositions(positions, scaleX, scaleY, xOffset, yOffset) {
  return positions.map((pos) => ({
    x: Math.round(pos.x * scaleX + xOffset),
    y: Math.round(pos.y * scaleY + yOffset),
    width: Math.round(pos.width * scaleX),
    height: Math.round(pos.height * scaleY),
  }));
}

export function combineBounds(bounds1, bounds2) {
  const xMin = Math.max(0, Math.min(bounds1.x, bounds2.x));
  const yMin = Math.max(0, Math.min(bounds1.y, bounds2.y));
  const xMax = Math.max(bounds1.x + bounds1.width, bounds2.x + bounds2.width);
  const yMax = Math.max(bounds1.y + bounds1.height, bounds2.y + bounds2.height);
  return {
    x: xMin,
    y: yMin,
    width: Math.max(1, xMax - xMin),
    height: Math.max(1, yMax - yMin),
  };
}

export function getDynamicPatches(
  positions,
  imageWidth,
  imageHeight,
  targetSize = 512
) {
  const patches = [];
  const usedStrokes = new Set();

  positions.forEach((stroke, index) => {
    if (usedStrokes.has(index)) return;

    let groupBounds = {
      x: stroke.x,
      y: stroke.y,
      width: stroke.width,
      height: stroke.height,
    };
    let groupStrokes = [stroke];
    usedStrokes.add(index);

    for (let j = index + 1; j < positions.length; j++) {
      if (usedStrokes.has(j)) continue;
      const otherStroke = positions[j];
      const combinedBounds = combineBounds(groupBounds, otherStroke);

      if (
        combinedBounds.width <= targetSize &&
        combinedBounds.height <= targetSize
      ) {
        groupBounds = combinedBounds;
        groupStrokes.push(otherStroke);
        usedStrokes.add(j);
      }
    }

    const centerX = groupBounds.x + groupBounds.width / 2;
    const centerY = groupBounds.y + groupBounds.height / 2;

    let patchX = Math.round(centerX - targetSize / 2);
    let patchY = Math.round(centerY - targetSize / 2);

    patchX = Math.max(0, Math.min(patchX, imageWidth - targetSize));
    patchY = Math.max(0, Math.min(patchY, imageHeight - targetSize));

    const patchWidth = Math.min(targetSize, imageWidth - patchX);
    const patchHeight = Math.min(targetSize, imageHeight - patchY);

    const patch = {
      bounds: { x: patchX, y: patchY, width: patchWidth, height: patchHeight },
      strokes: groupStrokes,
    };

    patches.push(patch);
  });

  return patches;
}

export async function combinePatches(
  patchResults,
  originalWidth,
  originalHeight,
  originalImage,
  globalScaleX,
  globalScaleY,
  xOffset,
  yOffset
) {
  const canvas = document.createElement("canvas");
  canvas.width = originalWidth;
  canvas.height = originalHeight;
  const ctx = canvas.getContext("2d");

  // Dibujar imagen original como base
  const imageObj = await decodeBase64Image(originalImage);
  ctx.drawImage(imageObj, 0, 0, originalWidth, originalHeight);

  const patchSize = 512;

  for (const { resultData, bounds } of patchResults) {
    try {
      // Convertir datos del parche a ImageData
      const imageData = new ImageData(
        new Uint8ClampedArray(resultData),
        patchSize,
        patchSize
      );
      
      // Crear canvas temporal para el parche
      const patchCanvas = document.createElement("canvas");
      patchCanvas.width = patchSize;
      patchCanvas.height = patchSize;
      const patchCtx = patchCanvas.getContext("2d");
      patchCtx.putImageData(imageData, 0, 0);

      // Calcular coordenadas originales compensando el padding
      const originalX = (bounds.x - xOffset) / globalScaleX;
      const originalY = (bounds.y - yOffset) / globalScaleY;
      const originalPatchWidth = bounds.width / globalScaleX;
      const originalPatchHeight = bounds.height / globalScaleY;

      // Asegurar que no se excedan los límites de la imagen
      const drawX = Math.max(0, originalX);
      const drawY = Math.max(0, originalY);
      const drawWidth = Math.min(originalPatchWidth, originalWidth - drawX);
      const drawHeight = Math.min(originalPatchHeight, originalHeight - drawY);

      // Escalar el parche al tamaño original
      const scaledCanvas = document.createElement("canvas");
      scaledCanvas.width = drawWidth;
      scaledCanvas.height = drawHeight;
      const scaledCtx = scaledCanvas.getContext("2d");
      
      scaledCtx.drawImage(
        patchCanvas,
        0, 0, patchSize, patchSize, // Fuente
        0, 0, drawWidth, drawHeight // Destino
      );

      // Dibujar en la posición correcta
      ctx.drawImage(
        scaledCanvas,
        0, 0, drawWidth, drawHeight,
        drawX, drawY, drawWidth, drawHeight
      );
    } catch (e) {
      console.error(`Error procesando parche en (${bounds.x}, ${bounds.y}):`, e);
    }
  }

  return canvas.toDataURL("image/png");
}