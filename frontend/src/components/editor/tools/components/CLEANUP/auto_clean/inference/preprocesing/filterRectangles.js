/**
 * Filtra rectángulos eliminando aquellos que están completamente dentro de otros
 * @param {Array} rectangles - Array de rectángulos agrupados por canvas
 * @returns {Object} Objeto con:
 *   - filteredRectangles: Array de rectángulos filtrados
 *   - counts: Array con conteos de rectángulos por canvas
 */
export const filterRectangles = (rectangles) => {
    const isRectangleInside = (rect1, rect2) => {
      const rect1Left = rect1.coords.left;
      const rect1Right = rect1.coords.left + rect1.coords.width;
      const rect1Top = rect1.coords.top;
      const rect1Bottom = rect1.coords.top + rect1.coords.height;
  
      const rect2Left = rect2.coords.left;
      const rect2Right = rect2.coords.left + rect2.coords.width;
      const rect2Top = rect2.coords.top;
      const rect2Bottom = rect2.coords.top + rect2.coords.height;
  
      return (
        rect1Left >= rect2Left &&
        rect1Right <= rect2Right &&
        rect1Top >= rect2Top &&
        rect1Bottom <= rect2Bottom
      );
    };
  
    const filteredData = rectangles.map((canvasRectangles) => {
      const result = [];
      const toRemove = new Set();

      canvasRectangles.forEach((rect1, index1) => {
        const isOutside = canvasRectangles.some((rect2, index2) => {
          if (index1 === index2) return false;
          return isRectangleInside(rect2, rect1);
        });
        if (isOutside) {
          toRemove.add(index1);
        }
      });

      canvasRectangles.forEach((rect, index) => {
        if (!toRemove.has(index)) {
          result.push(rect);
        }
      });

      return {
        filteredRectangles: result,
        count: result.length
      };
    });

    return {
      filteredRectangles: filteredData.map(data => data.filteredRectangles),
      counts: filteredData.map(data => data.count)
    };
  };
