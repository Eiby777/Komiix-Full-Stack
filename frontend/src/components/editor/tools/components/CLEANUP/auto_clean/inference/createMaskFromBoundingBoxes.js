/**
 * Crea una máscara canvas basada en los bounding boxes de Tesseract
 * @param {Object} tesseractResult - Resultados de Tesseract con bounding boxes y texto
 * @param {string} selectedLanguage - Idioma usado para el OCR
 * @returns {HTMLCanvasElement|null} Canvas con la máscara o null si no hay boxes válidos
 */
export const createMaskFromBoundingBoxes = (tesseractResult, selectedLanguage) => {
  const { boundingBoxes, text, coords } = tesseractResult;
  if (!boundingBoxes || !boundingBoxes.length || !text) {
    console.log(
      "No hay bounding boxes o texto para crear máscara:",
      tesseractResult.id,
    );
    return null;
  }

  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = coords.width;
  maskCanvas.height = coords.height;
  const ctx = maskCanvas.getContext("2d");

  const validBoxes = boundingBoxes
    .map((box) => {
      const confidence = box.confidence || 0;
      const boxText = box.text?.trim() || "";
      const width = box.bbox.x1 - box.bbox.x0;
      const height = box.bbox.y1 - box.bbox.y0;

      // Enhanced noise detection
      const isShortNonsense = boxText.length <= 2 && !/[A-Za-z]{2,}/.test(boxText); // e.g., "Il", "|", "3"
      const isNoise =
        (boxText.length === 1 && (confidence < 70 || width < 15 || height < 15)) ||
        (isShortNonsense && confidence < 80);

      return {
        ...box,
        isValid:
          confidence >= 30 &&
          boxText.length > 0 &&
          !/^\s+$/.test(boxText) &&
          !isNoise,
      };
    })
    .filter((box) => box.isValid);

  if (validBoxes.length === 0) {
    return null;
  }

  const filteredBoxes = validBoxes.map((box) => ({
    text: box.text,
    confidence: box.confidence,
    bbox: box.bbox,
  }));

  if (filteredBoxes.length === 0) {
    return null;
  }

  const clusterBoxes = () => {
    const clusters = [];
    const used = new Set();
    const distanceThresholdX = 20;
    const distanceThresholdY = 50;

    filteredBoxes.forEach((box, index) => {
      if (used.has(index)) return;

      const cluster = [box];
      used.add(index);

      filteredBoxes.forEach((otherBox, otherIndex) => {
        if (index === otherIndex || used.has(otherIndex)) return;

        const dx = Math.min(
          Math.abs(box.bbox.x0 - otherBox.bbox.x1),
          Math.abs(box.bbox.x1 - otherBox.bbox.x0),
        );
        const dy = Math.min(
          Math.abs(box.bbox.y0 - otherBox.bbox.y1),
          Math.abs(box.bbox.y1 - otherBox.bbox.y0),
        );

        if (dx < distanceThresholdX || dy < distanceThresholdY) {
          cluster.push(otherBox);
          used.add(otherIndex);
        }
      });

      clusters.push(cluster);
    });

    return clusters;
  };

  const clusters = clusterBoxes();

  const filteredClusters = clusters.filter((cluster) => {
    const minX = Math.min(...cluster.map((box) => box.bbox.x0));
    const maxX = Math.max(...cluster.map((box) => box.bbox.x1));
    const minY = Math.min(...cluster.map((box) => box.bbox.y0));
    const maxY = Math.max(...cluster.map((box) => box.bbox.y1));

    const width = maxX - minX;
    const height = maxY - minY;
    const avgConfidence =
      cluster.reduce((sum, box) => sum + box.confidence, 0) / cluster.length;

    const isSingleWordValid =
      cluster.length === 1 &&
      (width > 30 || height > 15 || avgConfidence > 85) &&
      cluster[0].text.length > 2;

    const marginTop = 10;
    const marginBottom = 5;
    const marginSides = 10;
    const isNearEdge =
      minX < marginSides ||
      maxX > coords.width - marginSides ||
      minY < marginTop ||
      maxY > coords.height - marginBottom;

    return (cluster.length >= 2 || isSingleWordValid) && !isNearEdge;
  });

  if (filteredClusters.length === 0) {
    return null;
  }

  const lines = [];
  filteredClusters.forEach((cluster) => {
    const minY = Math.min(...cluster.map((box) => box.bbox.y0));
    const maxY = Math.max(...cluster.map((box) => box.bbox.y1));
    const minX = Math.min(...cluster.map((box) => box.bbox.x0));
    const maxX = Math.max(...cluster.map((box) => box.bbox.x1));

    lines.push({
      minX,
      maxX,
      minY,
      maxY,
      cluster,
    });
  });

  lines.sort((a, b) => a.minY - b.minY);

  lines.forEach((line) => {
    const padding = 5;
    const adjustedMinX = Math.max(0, line.minX - padding);
    const adjustedMaxX = Math.min(coords.width, line.maxX + padding);
    const adjustedMinY = Math.max(0, line.minY - padding);
    const adjustedMaxY = Math.min(coords.height, line.maxY + padding);

    ctx.fillRect(
      adjustedMinX,
      adjustedMinY,
      adjustedMaxX - adjustedMinX,
      adjustedMaxY - adjustedMinY,
    );
  });

  if (lines.length > 0) {
    const overallMinY = Math.min(...lines.map((line) => line.minY));
    const overallMaxY = Math.max(...lines.map((line) => line.maxY));
    const avgWidth =
      lines.reduce((sum, line) => sum + (line.maxX - line.minX), 0) /
      lines.length;

    const avgMinX =
      lines.reduce((sum, line) => sum + line.minX, 0) / lines.length;
    const avgMaxX =
      lines.reduce((sum, line) => sum + line.maxX, 0) / lines.length;
    const centerX = (avgMinX + avgMaxX) / 2;
    const adjustedMinX = Math.max(0, centerX - avgWidth / 2);
    const adjustedMaxX = Math.min(coords.width, centerX + avgWidth / 2);

    const padding = 5;
    const finalMinY = Math.max(0, overallMinY - padding);
    const finalMaxY = Math.min(coords.height, overallMaxY + padding);

    ctx.fillRect(
      adjustedMinX,
      finalMinY,
      adjustedMaxX - adjustedMinX,
      finalMaxY - finalMinY,
    );
  }
  return maskCanvas;
};
