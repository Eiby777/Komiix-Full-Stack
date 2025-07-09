/**
 * Crea una máscara canvas que cubre el texto detectado, conectando líneas de forma progresiva
 * @param {HTMLCanvasElement} canvas - Canvas con el OCR binarizado (texto en negro, fondo en blanco)
 * @param {Array} ocrResults - Resultados del OCR para el recorte
 * @param {number} borderRadius - Radio de redondeo para las esquinas (por defecto 8)
 * @returns {HTMLCanvasElement|null} Canvas con la máscara (texto en blanco, fondo transparente) o null si no es válido
 */
export const createMaskFromBoundingBoxes = (canvas, ocrResults, borderRadius = 8) => {
  console.log(canvas, ocrResults);
  
  // Validar entradas
  if (!canvas || !ocrResults || !Array.isArray(ocrResults) || ocrResults.length === 0) {
    console.warn('Canvas o resultados OCR no válidos');
    return null;
  }
  
  // Crear el canvas de máscara con el mismo tamaño que el canvas original
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = canvas.width;
  maskCanvas.height = canvas.height;
  
  const ctx = maskCanvas.getContext('2d');
  
  // Limpiar el canvas (fondo transparente)
  ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
  
  // Configurar el estilo de relleno a blanco
  ctx.fillStyle = 'white';
  
  // Obtener el primer (y único) resultado del OCR
  const ocrResult = ocrResults[0];
  
  // Verificar que tenga boundingBoxes
  if (!ocrResult.boundingBoxes || !Array.isArray(ocrResult.boundingBoxes)) {
    console.warn('No se encontraron boundingBoxes en el resultado OCR');
    return null;
  }
  
  // Función para dibujar rectángulo con esquinas redondeadas
  const drawRoundedRect = (x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    ctx.fill();
  };

  // Dibujar rectángulos blancos redondeados para cada bounding box
  ocrResult.boundingBoxes.forEach((box, index) => {
    if (box.bbox) {
      const { x0, y0, x1, y1 } = box.bbox;
      
      // Calcular ancho y alto del rectángulo
      const width = x1 - x0;
      const height = y1 - y0;
      
      // Ajustar el radio si es mayor que la mitad del lado más pequeño
      const effectiveRadius = Math.min(borderRadius, Math.min(width, height) / 2);
      
      // Dibujar rectángulo blanco con esquinas redondeadas
      drawRoundedRect(x0, y0, width, height, effectiveRadius);
      
      console.log(`Dibujando box ${index + 1}: x=${x0}, y=${y0}, w=${width}, h=${height}, radio=${effectiveRadius}, texto="${box.text}"`);
    }
  });
  
  return maskCanvas;
};