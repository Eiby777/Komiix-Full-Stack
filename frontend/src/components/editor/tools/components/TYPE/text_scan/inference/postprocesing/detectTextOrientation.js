/**
 * Detecta la orientación del texto para cada rectángulo en tesseractResults.
 * @param {Array<Array<Object>>} tesseractResults - Resultados de Tesseract: [[{id, text, confidence, boundingBoxes, coords, color}, ...], ...]
 * @param {string} selectedLanguage - Idioma seleccionado (por ejemplo, "eng", "jpn", "chi_sim", "kor")
 * @returns {Array<Array<{id: number, orientation: string}>>} - Arreglo con la orientación por rectángulo
 */
const detectTextOrientation = (tesseractResults, selectedLanguage) => {
  return tesseractResults.map(canvasResults => {
    return canvasResults.map(result => {
      const { id, boundingBoxes } = result;

      if (["eng", "spa", "kor"].includes(selectedLanguage)) {
        return { id, orientation: "horizontal-left-to-right" };
      }

      if (!boundingBoxes || boundingBoxes.length === 0) {
        return {
          id,
          orientation: 
            selectedLanguage === "jpn" || selectedLanguage === "chi_sim"
              ? "vertical-top-to-bottom"
              : "horizontal-left-to-right"
        };
      }

      if (selectedLanguage === "jpn") {
        const minX = Math.min(...boundingBoxes.map(box => box.bbox.x0));
        const maxX = Math.max(...boundingBoxes.map(box => box.bbox.x1));
        const minY = Math.min(...boundingBoxes.map(box => box.bbox.y0));
        const maxY = Math.max(...boundingBoxes.map(box => box.bbox.y1));

        const totalWidth = maxX - minX;
        const totalHeight = maxY - minY;

        return {
          id,
          orientation: totalWidth > totalHeight 
            ? "horizontal-left-to-right" 
            : "vertical-top-to-bottom"
        };
      }

      if (selectedLanguage === "chi_sim") {
        const width = boundingBoxes.reduce((sum, box) => sum + (box.bbox.x1 - box.bbox.x0), 0);
        const height = boundingBoxes.reduce((sum, box) => sum + (box.bbox.y1 - box.bbox.y0), 0);
        return {
          id,
          orientation: width > height 
            ? "horizontal-left-to-right" 
            : "vertical-top-to-bottom"
        };
      }

      return { id, orientation: "horizontal-left-to-right" };
    });
  });
};

export default detectTextOrientation;