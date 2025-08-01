/**
 * Limpia el texto eliminando saltos de línea, múltiples espacios, y caracteres especiales.
 * @param {string} text - Texto a limpiar.
 * @returns {string} - Texto limpio.
 */
const cleanText = (text) => {
    return text
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/\/|\\|\-/g, function (match) {
            if (match === '-') {
                return ' ';
            }
            return '';
        })
        .replace(/\s(?=[\s-])|(?<=[\s-])\s/g, '')
        .trim();
};

/**
 * Fallback function to calculate text coordinates based on rectangle bounds
 * @param {string} text - Text to measure
 * @param {string} fontFamily - Font family
 * @param {Object} rect - Rectangle coordinates and dimensions {x, y, w, h}
 * @param {CanvasRenderingContext2D} ctx - Canvas context for text measurement
 * @returns {Object} - {top, left, width, height, fontSize}
 */
const calculateFallbackCoordinates = (text, fontFamily, rect, ctx) => {
    const margin = 10;
    const textMaxWidth = rect.w - 2 * margin;
    const textMaxHeight = rect.h - 2 * margin;

    // Function to wrap text
    const wrapText = (ctx, text, maxWidth) => {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0] || '';

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        if (currentLine) {
            lines.push(currentLine);
        }
        return lines;
    };

    // Binary search for optimal font size
    const minFontSize = 8;
    const maxFontSize = 32;
    let low = minFontSize;
    let high = maxFontSize;
    let optimalFontSize = minFontSize;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        ctx.font = `${mid}px ${fontFamily}`;
        const lines = wrapText(ctx, text, textMaxWidth);
        const lineHeight = mid * 1.2;
        const height = lines.length * lineHeight;
        if (height <= textMaxHeight) {
            optimalFontSize = mid;
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    let fontSize = optimalFontSize;
    ctx.font = `${fontSize}px ${fontFamily}`;
    const lines = wrapText(ctx, text, textMaxWidth);
    const lineHeight = fontSize * 1.2;
    let textHeight = lines.length * lineHeight;

    // Adjust fontSize if text exceeds height
    if (textHeight > textMaxHeight) {
        const scaleFactor = textMaxHeight / textHeight;
        fontSize = Math.floor(fontSize * scaleFactor);
        fontSize = Math.max(minFontSize, fontSize);
        ctx.font = `${fontSize}px ${fontFamily}`;
        const adjustedLines = wrapText(ctx, text, textMaxWidth);
        textHeight = adjustedLines.length * (fontSize * 1.2);
    }

    // Calculate width based on longest line
    const maxLineWidth = lines.length > 0 ? Math.max(...lines.map(line => ctx.measureText(line).width)) : 0;
    const textWidth = Math.min(textMaxWidth, maxLineWidth);

    // Center text in rectangle
    const left = rect.x + (rect.w - textWidth) / 2;
    const top = rect.y + (rect.h - textHeight) / 2;

    return {
        top,
        left,
        width: textWidth,
        height: textHeight,
        fontSize,
    };
};

/**
 * Calcula las coordenadas y dimensiones del rectángulo de texto dentro de un globo.
 * @param {HTMLCanvasElement} canvas - Canvas con la imagen recortada donde se detectará el globo.
 * @param {Object} relativePointer - Coordenadas del clic relativo {x, y} en el recorte.
 * @param {fabric.Text} textObject - Objeto de Fabric.js con texto, fontSize, fontFamily, etc.
 * @param {boolean|null} isText - Indicates rectangle type (true, false, or null).
 * @param {Object} rect - Rectangle coordinates and dimensions {x, y, w, h}.
 * @returns {Object} - {top, left, width, height, fontSize} ajustados.
 */
const calculateTextCoordinates = (canvas, relativePointer, textObject, isText = null, rect = null) => {
    // Extraer y preprocesar el texto
    let text = textObject.text || '';
    text = cleanText(text);
    const fontFamily = textObject.fontFamily || 'sans-serif';

    // Obtener contexto con willReadFrequently optimizado para lecturas múltiples
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Fallback if primary calculation fails and isText is true or false
    const useFallback = () => {
        if (isText === true || isText === false) {
            // For isText=true, use original rectangle dimensions
            const fallbackRect = isText === true ? rect : rect;
            return calculateFallbackCoordinates(text, fontFamily, fallbackRect, ctx);
        }
        return null;
    };

    // Obtener color del píxel clicado
    const pixelData = ctx.getImageData(relativePointer.x, relativePointer.y, 1, 1).data;
    const targetColor = { r: pixelData[0], g: pixelData[1], b: pixelData[2] };

    // Verificar color con tolerancia
    const isSameColor = (x, y) => {
        const data = ctx.getImageData(x, y, 1, 1).data;
        const tolerance = 10;
        return (
            Math.abs(data[0] - targetColor.r) < tolerance &&
            Math.abs(data[1] - targetColor.g) < tolerance &&
            Math.abs(data[2] - targetColor.b) < tolerance
        );
    };

    // Resto del código permanece igual...
    // Explorar región con BFS para detectar el globo
    const visited = new Set();
    const queue = [{ x: relativePointer.x, y: relativePointer.y }];
    const regionPixels = [];
    let minX = relativePointer.x,
        maxX = relativePointer.x;
    let minY = relativePointer.y,
        maxY = relativePointer.y;

    while (queue.length > 0) {
        const { x, y } = queue.shift();
        const key = `${x},${y}`;
        if (
            visited.has(key) ||
            x < 0 ||
            x >= canvas.width ||
            y < 0 ||
            y >= canvas.height ||
            !isSameColor(x, y)
        )
            continue;

        visited.add(key);
        regionPixels.push({ x, y });
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);

        queue.push({ x: x + 1, y });
        queue.push({ x: x - 1, y });
        queue.push({ x: x, y: y + 1 });
        queue.push({ x: x, y: y - 1 });
    }

    // If no region detected, use fallback
    if (regionPixels.length === 0 && (isText === true || isText === false)) {
        return useFallback();
    }

    // Calcular centroide
    const centerX = Math.floor(regionPixels.reduce((sum, p) => sum + p.x, 0) / regionPixels.length);
    const centerY = Math.floor(regionPixels.reduce((sum, p) => sum + p.y, 0) / regionPixels.length);

    // Dimensiones del globo con márgenes
    const margin = 10;
    const balloonWidth = maxX - minX + 1 - 2 * margin;
    const balloonHeight = maxY - minY + 1 - 2 * margin;

    // Factor de reducción para el subespacio (80% del espacio disponible)
    const reductionFactor = 0.8;

    // Dimensiones del subespacio reducido
    const textMaxWidth = balloonWidth * reductionFactor;
    const textMaxHeight = balloonHeight * reductionFactor;

    // Calcular el padding implícito que resulta de la reducción
    const horizontalPaddingFromReduction = (balloonWidth - textMaxWidth) / 2;
    const verticalPaddingFromReduction = (balloonHeight - textMaxHeight) / 2;

    // Función auxiliar para envolver el texto
    const wrapText = (ctx, text, maxWidth) => {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0] || '';

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        if (currentLine) {
            lines.push(currentLine);
        }
        return lines;
    };

    // Función para calcular la altura del texto envuelto
    const getWrappedTextHeight = (fontSize) => {
        ctx.font = `${fontSize}px ${fontFamily}`;
        const lines = wrapText(ctx, text, textMaxWidth);
        const lineHeight = fontSize * 1.2;
        return { height: lines.length * lineHeight, lineCount: lines.length };
    };

    // Búsqueda binaria para encontrar el tamaño de fuente óptimo
    const minFontSize = 8;
    const maxFontSize = 32;
    let low = minFontSize;
    let high = maxFontSize;
    let optimalFontSize = minFontSize;
    let optimalLineCount = 1;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const { height, lineCount } = getWrappedTextHeight(mid);
        if (height <= textMaxHeight) {
            optimalFontSize = mid;
            optimalLineCount = lineCount;
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    // Aplicar factor de reducción dinámico basado en el número de líneas
    const baseReductionFactor = optimalLineCount > 1 ? 0.9 : 1.0;
    const additionalReduction = Math.max(0, (optimalLineCount - 5) * 0.02);
    const fontSizeReductionFactor = baseReductionFactor - additionalReduction;
    let fontSize = Math.floor(optimalFontSize * fontSizeReductionFactor);

    // Asegurar que el tamaño de fuente esté dentro de los límites
    fontSize = Math.max(minFontSize, Math.min(maxFontSize, fontSize));

    // Configurar el tamaño de fuente final
    ctx.font = `${fontSize}px ${fontFamily}`;
    const lines = wrapText(ctx, text, textMaxWidth);
    const lineHeight = fontSize * 1.2;
    let textHeight = lines.length * lineHeight;

    // Ajustar el fontSize si el texto aún excede los límites
    if (textHeight > textMaxHeight) {
        const scaleFactor = textMaxHeight / textHeight;
        fontSize = Math.floor(fontSize * scaleFactor);
        fontSize = Math.max(minFontSize, fontSize);
        ctx.font = `${fontSize}px ${fontFamily}`;
        const adjustedLines = wrapText(ctx, text, textMaxWidth);
        textHeight = adjustedLines.length * (fontSize * 1.2);
    }

    // Calcular el ancho del texto basado en la línea más larga
    const maxLineWidth = lines.length > 0 ? Math.max(...lines.map(line => ctx.measureText(line).width)) : 0;
    const fabricPadding = textObject.padding || 0;
    const textWidth = Math.min(textMaxWidth, maxLineWidth + 2 * fabricPadding);

    // Calcular la posición top para centrar verticalmente dentro del subespacio
    let top = centerY - textHeight / 2;
    top = Math.max(minY + margin + verticalPaddingFromReduction, top);
    top = Math.min(maxY - margin - verticalPaddingFromReduction - textHeight, top);

    // Calcular la posición left para centrar horizontalmente dentro del subespacio
    let left = centerX - textWidth / 2;
    left = Math.max(minX + margin + horizontalPaddingFromReduction, left);
    left = Math.min(maxX - margin - horizontalPaddingFromReduction - textWidth, left);

    const result = {
        top,
        left,
        width: textWidth,
        height: textHeight,
        fontSize,
    };

    // Check if result is outside crop bounds and use fallback if needed
    if (isText === true || isText === false) {
        const isOutOfBounds =
            result.left < 0 ||
            result.top < 0 ||
            result.left + result.width > canvas.width ||
            result.top + result.height > canvas.height;

        if (isOutOfBounds) {
            return useFallback();
        }
    }

    return result;
};

export default calculateTextCoordinates;

export { cleanText };