/**
 * Crea una máscara canvas que cubre el texto detectado, conectando líneas de forma progresiva
 * @param {Object{x,y,w,h}} boundingRect - Bounding rect inicial para optimizar el escaneo
 * @param {HTMLCanvasElement} binarizedCanvas - Canvas con el OCR binarizado (texto en negro, fondo en blanco)
 * @returns {HTMLCanvasElement|null} Canvas con la máscara (texto en blanco, fondo transparente) o null si no es válido
 */
export const createMaskFromBoundingBoxes = (boundingRect, binarizedCanvas) => {
  if (!boundingRect || !boundingRect.x || !boundingRect.y || !boundingRect.w || !boundingRect.h) {
    console.log("No hay bounding box válido para crear máscara");
    return null;
  }

  const maskCanvas = document.createElement('canvas');
  const maskCtx = maskCanvas.getContext('2d');
  maskCanvas.width = binarizedCanvas.width;
  maskCanvas.height = binarizedCanvas.height;

  const ctx = binarizedCanvas.getContext('2d');
  const imageData = ctx.getImageData(boundingRect.x, boundingRect.y, boundingRect.w, boundingRect.h);
  const data = imageData.data;

  // Paso 1: Detectar líneas de texto y agrupar en bloques
  const lineBounds = detectTextLines(data, boundingRect);
  const textBlocks = groupLinesIntoBlocks(lineBounds);

  // Paso 2: Construir el polígono para la máscara
  maskCtx.beginPath();
  constructMaskPolygon(maskCtx, textBlocks);

  // Paso 3: Rellenar el polígono
  maskCtx.fillStyle = 'rgba(255, 255, 255, 1)';
  maskCtx.fill();

  // Paso 4: Hacer transparente fuera del polígono
  const maskImageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
  const maskData = maskImageData.data;
  for (let i = 0; i < maskData.length; i += 4) {
    const x = (i / 4) % maskCanvas.width;
    const y = Math.floor((i / 4) / maskCanvas.width);
    if (!maskCtx.isPointInPath(x, y)) {
      maskData[i + 3] = 0; // Transparente
    }
  }
  maskCtx.putImageData(maskImageData, 0, 0);

  return maskCanvas;
};

// Detectar líneas de texto
function detectTextLines(data, boundingRect) {
  const lineBounds = {};
  for (let y = 0; y < boundingRect.h; y++) {
    let minX = boundingRect.w;
    let maxX = 0;
    let hasText = false;
    for (let x = 0; x < boundingRect.w; x++) {
      const i = (y * boundingRect.w + x) * 4;
      const r = data[i];
      if (r < 50) { // Píxel negro (texto)
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        hasText = true;
      }
    }
    if (hasText) {
      lineBounds[y + boundingRect.y] = { minX: minX + boundingRect.x, maxX: maxX + boundingRect.x };
    }
  }
  return lineBounds;
}

// Agrupar líneas en bloques
function groupLinesIntoBlocks(lineBounds) {
  const yValues = Object.keys(lineBounds).map(Number).sort((a, b) => a - b);
  const blocks = [];
  let currentBlock = [];
  for (let i = 0; i < yValues.length; i++) {
    if (i === 0 || yValues[i] - yValues[i - 1] <= 10) { // Umbral de 10 píxeles
      currentBlock.push(yValues[i]);
    } else {
      blocks.push(currentBlock);
      currentBlock = [yValues[i]];
    }
  }
  if (currentBlock.length > 0) {
    blocks.push(currentBlock);
  }
  return blocks.map(block => block.map(y => ({ y, ...lineBounds[y] })));
}

// Construir el polígono con curvas
function constructMaskPolygon(ctx, textBlocks) {
  for (let blockIndex = 0; blockIndex < textBlocks.length; blockIndex++) {
    const block = textBlocks[blockIndex];
    const firstLine = block[0];
    const lastLine = block[block.length - 1];

    // Iniciar en el minX de la primera línea del bloque
    ctx.moveTo(firstLine.minX, firstLine.y);

    // Conectar hacia maxX dentro del bloque
    for (let i = 0; i < block.length; i++) {
      const current = block[i];
      const next = block[i + 1];
      if (next) {
        ctx.bezierCurveTo(
          current.maxX, current.y + (next.y - current.y) / 2, // Punto de control 1
          next.maxX, next.y - (next.y - current.y) / 2,       // Punto de control 2
          next.maxX, next.y                                   // Destino
        );
      } else {
        ctx.lineTo(current.maxX, current.y);
      }
    }

    // Conectar con el siguiente bloque si existe
    if (blockIndex < textBlocks.length - 1) {
      const nextBlock = textBlocks[blockIndex + 1];
      const nextFirstLine = nextBlock[0];
      ctx.bezierCurveTo(
        lastLine.maxX, lastLine.y + (nextFirstLine.y - lastLine.y) / 3,   // Punto de control 1
        nextFirstLine.maxX, nextFirstLine.y - (nextFirstLine.y - lastLine.y) / 3, // Punto de control 2
        nextFirstLine.maxX, nextFirstLine.y                               // Destino
      );
    }

    // Volver por el lado opuesto (minX)
    for (let i = block.length - 1; i >= 0; i--) {
      const current = block[i];
      const prev = block[i - 1];
      if (prev) {
        ctx.bezierCurveTo(
          current.minX, current.y - (current.y - prev.y) / 2, // Punto de control 1
          prev.minX, prev.y + (current.y - prev.y) / 2,       // Punto de control 2
          prev.minX, prev.y                                   // Destino
        );
      } else {
        ctx.lineTo(current.minX, current.y);
      }
    }

    // Conectar con el bloque anterior para cerrar el camino
    if (blockIndex > 0) {
      const prevBlock = textBlocks[blockIndex - 1];
      const prevLastLine = prevBlock[prevBlock.length - 1];
      ctx.bezierCurveTo(
        firstLine.minX, firstLine.y - (firstLine.y - prevLastLine.y) / 3, // Punto de control 1
        prevLastLine.minX, prevLastLine.y + (firstLine.y - prevLastLine.y) / 3, // Punto de control 2
        prevLastLine.minX, prevLastLine.y                         // Destino
      );
    }

    ctx.closePath();
  }
}