/**
 * Reordena el texto si la orientación no es la predeterminada y devuelve texto original y reordenado.
 * @param {Array<Array<Object>>} tesseractResults - Resultados de Tesseract
 * @param {Array<Array<{id: number, orientation: string}>>} orientations - Orientaciones detectadas
 * @returns {Array<Array<{id: number, originalText: string, reorderedText: string}>>} - Texto original y reordenado por rectángulo
 */
const reorderTextByOrientation = (tesseractResults, orientations) => {
  const yThreshold = 10; // Umbral para agrupar palabras en la misma línea
  const xThreshold = 10; // Umbral para separar columnas
  const defaultOrientation = "horizontal-left-to-right";

  return tesseractResults.map((canvasResults, canvasIndex) => {
    return canvasResults.map((result, resultIndex) => {
      const { id, text, boundingBoxes } = result;
      const orientationInfo = orientations[canvasIndex][resultIndex];
      let reorderedText = text;

      // Si la orientación es la predeterminada o no hay boundingBoxes, mantener el texto original
      if (!boundingBoxes || boundingBoxes.length === 0 || orientationInfo.orientation === defaultOrientation) {
        return { id, originalText: text, reorderedText };
      }

      // Agrupar por columnas para vertical-top-to-bottom, o por líneas para horizontal
      const columnsOrLines = {};
      boundingBoxes.forEach(box => {
        const key = orientationInfo.orientation === "vertical-top-to-bottom"
          ? box.bbox.x0 // Usar x0 para columnas en vertical
          : box.bbox.y0; // Usar y0 para líneas en horizontal
        let groupKey = Object.keys(columnsOrLines).find(k => Math.abs(k - key) <= (orientationInfo.orientation === "vertical-top-to-bottom" ? xThreshold : yThreshold));
        if (!groupKey) groupKey = key;
        columnsOrLines[groupKey] = columnsOrLines[groupKey] || [];
        columnsOrLines[groupKey].push(box);
      });

      // Reordenar según orientación
      const orderedText = Object.keys(columnsOrLines)
        .sort((a, b) => {
          if (orientationInfo.orientation === "vertical-top-to-bottom") {
            // Solo ordenar de derecha a izquierda si es multilinea
            const isMultiline = Object.keys(columnsOrLines).length > 1;
            return isMultiline ? b - a : a - b;
          }
          return a - b; // Líneas de arriba abajo para horizontal
        })
        .map(key => {
          const boxes = columnsOrLines[key];
          if (orientationInfo.orientation === "horizontal-right-to-left") {
            // Ordenar palabras de derecha a izquierda por x0
            return boxes
              .sort((a, b) => b.bbox.x0 - a.bbox.x0)
              .map(w => w.text)
              .join(" ");
          } else if (orientationInfo.orientation === "vertical-top-to-bottom") {
            // Ordenar palabras de arriba hacia abajo por y0 (dentro de cada columna)
            return boxes
              .sort((a, b) => a.bbox.y0 - b.bbox.y0)
              .map(w => w.text)
              .join(""); // Sin espacios para japonés/chino vertical
          }
          // Por defecto (horizontal-left-to-right)
          return boxes
            .sort((a, b) => a.bbox.x0 - b.bbox.x0)
            .map(w => w.text)
            .join(" ");
        });

      // Unir el texto reordenado sin saltos de línea
      reorderedText = orderedText.join("");

      return { id, originalText: text, reorderedText };
    });
  });
};

export default reorderTextByOrientation;
