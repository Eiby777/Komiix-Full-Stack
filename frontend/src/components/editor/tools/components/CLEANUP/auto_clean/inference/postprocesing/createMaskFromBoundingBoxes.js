/**
 * Crea una máscara canvas que cubre el texto detectado, conectando líneas de forma progresiva
 * @param {Object{x,y,w,h}} boundingRect - Bounding rect inicial para optimizar el escaneo
 * @param {HTMLCanvasElement} binarizedCanvas - Canvas con el OCR binarizado (texto en negro, fondo en blanco)
 * @returns {HTMLCanvasElement|null} Canvas con la máscara (texto en blanco, fondo transparente) o null si no es válido
 */
export const createMaskFromBoundingBoxes = (boundingRect, binarizedCanvas) => {
  if (!boundingRect || !boundingRect.x || !boundingRect.y || !boundingRect.w || !boundingRect.h) {
    console.error("No hay bounding box válido para crear máscara");
    return null;
  }

  const maskCanvas = document.createElement('canvas');
  const maskCtx = maskCanvas.getContext('2d');
  maskCanvas.width = binarizedCanvas.width;
  maskCanvas.height = binarizedCanvas.height;

  const ctx = binarizedCanvas.getContext('2d');
  const imageData = ctx.getImageData(boundingRect.x, boundingRect.y, boundingRect.w, boundingRect.h);
  const data = imageData.data;

  // Paso 1: Dilatar los píxeles negros (texto) en un radio de 3 píxeles
  const dilatedData = dilateText(data, boundingRect.w, boundingRect.h);
  const dilatedImageData = new ImageData(dilatedData, boundingRect.w, boundingRect.h);
  ctx.putImageData(dilatedImageData, boundingRect.x, boundingRect.y);

  // Paso 2: Detectar líneas de texto y agrupar en bloques
  const lineBounds = detectTextLines(dilatedData, boundingRect);
  const textBlocks = groupLinesIntoBlocks(lineBounds);

  // Paso 3: Construir el polígono para la máscara
  maskCtx.beginPath();
  constructMaskPolygon(maskCtx, textBlocks);

  // Paso 4: Rellenar el polígono
  maskCtx.fillStyle = 'rgba(255, 255, 255, 1)';
  maskCtx.fill();

  // Paso 5: Hacer transparente fuera del polígono
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

/**
 * Dilata los píxeles negros (texto) en un radio de 5 píxeles usando propagación de mínimos
 * @param {Uint8ClampedArray} data - Datos del canvas
 * @param {number} width - Ancho del canvas
 * @param {number} height - Alto del canvas
 * @param {number} radius - Radio de dilatación (default: 5)
 * @returns {Uint8ClampedArray} Datos del canvas dilatados
 */
function dilateText(data, width, height, radius = 5) {
  const outputData = new Uint8ClampedArray(data.length);
  const tempData = new Uint8ClampedArray(width * height); // Array temporal para distancias
  const threshold = 50;

  // Inicializar tempData con distancias grandes (infinito)
  tempData.fill(Infinity);

  // Paso 1: Marcar píxeles de texto y propagar distancias horizontalmente
  for (let y = 0; y < height; y++) {
    // Propagación hacia la derecha
    let lastTextX = -radius - 1;
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (data[i] < threshold) {
        lastTextX = x;
        tempData[y * width + x] = 0; // Píxel de texto
      } else if (x - lastTextX <= radius) {
        tempData[y * width + x] = x - lastTextX; // Distancia al píxel de texto más cercano
      }
    }

    // Propagación hacia la izquierda
    lastTextX = width + radius + 1;
    for (let x = width - 1; x >= 0; x--) {
      const i = (y * width + x) * 4;
      if (data[i] < threshold) {
        lastTextX = x;
        tempData[y * width + x] = 0;
      } else if (lastTextX - x <= radius && lastTextX - x < tempData[y * width + x]) {
        tempData[y * width + x] = lastTextX - x;
      }
    }
  }

  // Paso 2: Propagar distancias verticalmente y generar salida
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      let minDistance = tempData[y * width + x];

      // Verificar vecinos verticales
      for (let dy = -radius; dy <= radius; dy++) {
        const ny = y + dy;
        if (ny >= 0 && ny < height) {
          minDistance = Math.min(minDistance, tempData[ny * width + x] + Math.abs(dy));
        }
      }

      // Asignar color según la distancia
      if (minDistance <= radius) {
        outputData[i] = 0;
        outputData[i + 1] = 0;
        outputData[i + 2] = 0;
        outputData[i + 3] = 255;
      } else {
        outputData[i] = 255;
        outputData[i + 1] = 255;
        outputData[i + 2] = 255;
        outputData[i + 3] = 255;
      }
    }
  }

  return outputData;
}

/**
 * Detecta líneas de texto en el canvas usando etiquetado de componentes conectados
 * @param {Uint8ClampedArray} data - Datos del canvas
 * @param {Object} boundingRect - Bounding rect del recorte
 * @returns {Object} Objeto con límites de las líneas de texto
 */
function detectTextLines(data, boundingRect) {
  const { w: width, h: height, x: offsetX, y: offsetY } = boundingRect;
  const labels = new Uint32Array(width * height); // Etiquetas para cada píxel
  const equivalences = new Map(); // Mapa de equivalencias entre etiquetas
  let currentLabel = 1;
  const threshold = 50;

  // Primera pasada: Asignar etiquetas temporales
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (data[i] >= threshold) continue; // Saltar píxeles blancos

      const gi = y * width + x;
      const neighborLabels = [];

      // Verificar vecinos (conectividad de 8)
      for (let dy = -1; dy <= 0; dy++) {
        for (let dx = -1; dx <= (dy === 0 ? -1 : 1); dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const ni = ny * width + nx;
            if (labels[ni] > 0) {
              neighborLabels.push(labels[ni]);
            }
          }
        }
      }

      if (neighborLabels.length === 0) {
        // Nueva componente
        labels[gi] = currentLabel++;
      } else {
        // Asignar la etiqueta mínima y registrar equivalencias
        const minLabel = Math.min(...neighborLabels);
        labels[gi] = minLabel;
        for (const label of neighborLabels) {
          if (label !== minLabel) {
            equivalences.set(label, minLabel);
          }
        }
      }
    }
  }

  // Resolver equivalencias
  const rootLabels = new Map();
  for (let label = 1; label < currentLabel; label++) {
    let root = label;
    while (equivalences.has(root)) {
      root = equivalences.get(root);
    }
    rootLabels.set(label, root);
  }

  // Segunda pasada: Calcular límites por fila
  const lineBounds = {};
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const gi = y * width + x;
      if (labels[gi] === 0) continue;

      // Obtener la etiqueta raíz
      const rootLabel = rootLabels.get(labels[gi]) || labels[gi];
      const globalY = y + offsetY;
      if (!lineBounds[globalY]) {
        lineBounds[globalY] = { minX: Infinity, maxX: -Infinity };
      }

      // Actualizar límites
      lineBounds[globalY].minX = Math.min(lineBounds[globalY].minX, x + offsetX);
      lineBounds[globalY].maxX = Math.max(lineBounds[globalY].maxX, x + offsetX);
    }
  }

  return lineBounds;
}

function groupLinesIntoBlocks(lineBounds) {
  const lines = Object.keys(lineBounds)
    .map(Number)
    .sort((a, b) => a - b)
    .map(y => ({ y, ...lineBounds[y] }));

  const blocks = [];
  if (lines.length === 0) return blocks;

  const verticalThreshold = 20; // Máxima distancia vertical entre líneas
  const blockGapThreshold = 50; // Máximo hueco vertical permitido en un bloque

  let currentBlock = [lines[0]];
  let currentMinY = lines[0].y;
  let currentMaxY = lines[0].y;
  let currentMinX = lines[0].minX;
  let currentMaxX = lines[0].maxX;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const lastLine = currentBlock[currentBlock.length - 1];

    // Calcular distancia vertical desde el último elemento del bloque
    const verticalDistance = line.y - lastLine.y;
    const horizontalOverlap = line.minX <= currentMaxX && line.maxX >= currentMinX;

    // Verificar si debemos continuar el bloque actual
    if (verticalDistance <= verticalThreshold && horizontalOverlap) {
      currentBlock.push(line);
      currentMinY = Math.min(currentMinY, line.y);
      currentMaxY = Math.max(currentMaxY, line.y);
      currentMinX = Math.min(currentMinX, line.minX);
      currentMaxX = Math.max(currentMaxX, line.maxX);
    } else {
      // Verificar si el hueco es pequeño y hay superposición
      const gap = line.y - currentMaxY;
      if (gap <= blockGapThreshold && horizontalOverlap) {
        currentBlock.push(line);
        currentMaxY = line.y;
        currentMinX = Math.min(currentMinX, line.minX);
        currentMaxX = Math.max(currentMaxX, line.maxX);
      } else {
        // Nuevo bloque
        blocks.push(currentBlock);
        currentBlock = [line];
        currentMinY = line.y;
        currentMaxY = line.y;
        currentMinX = line.minX;
        currentMaxX = line.maxX;
      }
    }
  }
  blocks.push(currentBlock);
  return blocks;
}


/**
 * Construye el polígono con curvas
 * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
 * @param {Array} textBlocks - Array de bloques de líneas
 */
function constructMaskPolygon(ctx, textBlocks) {
  const allPoints = [];

  // Recoger todos los puntos de los bloques
  textBlocks.forEach(block => {
    block.forEach(line => {
      allPoints.push({
        x: line.minX,
        y: line.y,
        type: 'left'
      });
      allPoints.push({
        x: line.maxX,
        y: line.y,
        type: 'right'
      });
    });
  });

  // Ordenar puntos: primero por Y, luego por X para lados izquierdos, luego derechos
  allPoints.sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;
    if (a.type !== b.type) return a.type === 'left' ? -1 : 1;
    return a.type === 'left' ? a.x - b.x : b.x - a.x;
  });

  // Construir el lado superior
  ctx.moveTo(allPoints[0].x, allPoints[0].y);
  for (let i = 1; i < allPoints.length; i++) {
    if (allPoints[i].type === 'left') {
      const prev = allPoints[i - 1];
      const curr = allPoints[i];

      if (Math.abs(curr.y - prev.y) > 10) {
        ctx.bezierCurveTo(
          prev.x, prev.y + 5,
          curr.x, curr.y - 5,
          curr.x, curr.y
        );
      } else {
        ctx.lineTo(curr.x, curr.y);
      }
    }
  }

  // Construir el lado inferior (en orden inverso)
  for (let i = allPoints.length - 1; i >= 0; i--) {
    if (allPoints[i].type === 'right') {
      const prev = allPoints[i + 1] || allPoints[i];
      const curr = allPoints[i];

      if (i < allPoints.length - 1 && Math.abs(curr.y - prev.y) > 10) {
        ctx.bezierCurveTo(
          prev.x, prev.y - 5,
          curr.x, curr.y + 5,
          curr.x, curr.y
        );
      } else {
        ctx.lineTo(curr.x, curr.y);
      }
    }
  }

  ctx.closePath();
}
