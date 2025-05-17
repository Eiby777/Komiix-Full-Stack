/**
 * Recorta imágenes basándose en rectángulos filtrados
 * @param {Array<Array<Object>>} filteredRectangles - Array de arrays de rectángulos con coordenadas
 * @param {Array<HTMLCanvasElement>} images - Array de canvases fuente
 * @returns {Array<Array<Object>>} - Array de arrays con imágenes recortadas y metadatos
 * @throws {Error} - Si no se encuentra un canvas para algún índice
 */
export const croppImages = (filteredRectangles, images) => {
    const croppedImages = filteredRectangles.map(
      (canvasRectangles, canvasIndex) => {
        const sourceCanvas = images[canvasIndex];
        if (!sourceCanvas) {
          console.error(`No se encontró canvas para el índice ${canvasIndex}`);
          return [];
        }
  
        return canvasRectangles.map((rect) => {
          const { left, top, width, height } = rect.coords;
          const cropCanvas = document.createElement("canvas");
          cropCanvas.width = width;
          cropCanvas.height = height;
          const ctx = cropCanvas.getContext("2d");
  
          ctx.drawImage(
            sourceCanvas,
            left,
            top,
            width,
            height,
            0,
            0,
            width,
            height,
          );
  
          const pngDataUrl = cropCanvas.toDataURL("image/png");
          return {
            id: rect.id,
            image: pngDataUrl,
            coords: rect.coords,
            color: rect.color,
            canvas: cropCanvas,
            canvasIndex,
          };
        });
      },
    );
    return croppedImages;
  };
