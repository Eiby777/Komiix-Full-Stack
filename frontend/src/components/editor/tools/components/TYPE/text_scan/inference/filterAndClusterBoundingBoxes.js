/**
 * Filtra bounding boxes ruidosos y agrupa los válidos en clústeres, manteniendo el formato de tesseractResults.
 * @param {Array<Array<Object>>} tesseractResults - Resultados de Tesseract: [[{id, text, confidence, boundingBoxes, coords, color}, ...], ...]
 * @param {string} selectedLanguage - Idioma seleccionado (por ejemplo, "eng", "jpn", "chi_sim", "kor")
 * @returns {Array<Array<Object>>} - Resultados filtrados y agrupados en el mismo formato que tesseractResults
 */
export const filterAndClusterBoundingBoxes = (tesseractResults, selectedLanguage) => {
    return tesseractResults.map(canvasResults => {
      return canvasResults.map(result => {
        const { id, text, boundingBoxes, coords, color } = result;
  
        if (!boundingBoxes || !boundingBoxes.length || !text) {
          console.log("No hay bounding boxes o texto para filtrar:", id);
          return { id, text, boundingBoxes: [], coords, color }; // Devolver vacío si no hay datos
        }
  
        // Filtrar bounding boxes ruidosos
        const validBoxes = boundingBoxes
          .map((box) => {
            const confidence = box.confidence || 0;
            const boxText = box.text?.trim() || "";
            const width = box.bbox.x1 - box.bbox.x0;
            const height = box.bbox.y1 - box.bbox.y0;
  
            // Detección mejorada de ruido
            const isShortNonsense = boxText.length <= 2 && !/[A-Za-z]{2,}/.test(boxText); // Ej. "Il", "|", "3"
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
          console.log("No hay bounding boxes válidos después de filtrar:", id);
          return { id, text, boundingBoxes: [], coords, color };
        }
  
        // Agrupar en clústeres
        const clusters = [];
        const used = new Set();
        const distanceThresholdX = 20;
        const distanceThresholdY = 50;
  
        const filteredBoxes = validBoxes.map((box) => ({
          text: box.text,
          confidence: box.confidence,
          bbox: box.bbox,
        }));
  
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
  
        // Filtrar clústeres válidos
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
          console.log("No hay clústeres válidos después de filtrar:", id);
          return { id, text, boundingBoxes: [], coords, color };
        }
  
        // Combinar todos los bounding boxes de los clústeres filtrados
        const clusteredBoundingBoxes = filteredClusters.flat();
  
        console.log(
          `Filtrados ${clusteredBoundingBoxes.length} bounding boxes válidos en ${id} para idioma ${selectedLanguage}`,
        );
  
        return {
          id,
          text, // Mantener el texto original por compatibilidad
          boundingBoxes: clusteredBoundingBoxes,
          coords,
          color,
        };
      });
    });
  };