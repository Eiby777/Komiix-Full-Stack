import { LAYERS } from "../../../../../../../constants/layers";


/**
 * Obtiene y normaliza las coordenadas de los rectángulos de anotación en los canvas
 * @async
 * @param {Array} canvasInstances - Array de instancias de canvas
 * @param {Array} images - Array de imágenes de fondo correspondientes
 * @returns {Promise<Array>} Array de rectángulos con coordenadas normalizadas
 */
export const getRectangles = async (canvasInstances, images, setIsLoading) => {
  let rectangles = [];

  /**
   * Calcula las coordenadas relativas de un rectángulo en el canvas
   * @param {fabric.Canvas} canvas - Instancia de canvas de Fabric.js
   * @param {Object} image - Imagen de fondo correspondiente
   * @param {Object} rectangle - Rectángulo de anotación
   * @returns {Object} Coordenadas actualizadas del rectángulo
   */
  const getUpdatedCoords = (canvas, image, rectangle) => {
    const canvasCenterX = canvas.width / 2;
    const canvasCenterY = canvas.height / 2;
    const imageLeft = canvasCenterX - image.width / 2;
    const imageTop = canvasCenterY - image.height / 2;
    const relativeLeft = rectangle.left - imageLeft;
    const relativeTop = rectangle.top - imageTop;

    return {
      left: relativeLeft,
      top: relativeTop,
      width: rectangle.width,
      height: rectangle.height,
    };
  };

  try {
    const canvasImagePromises = canvasInstances.map((canvas, index) => {
      const objects = canvas.getObjects();
      const filteredRectangles = objects.filter(
        (object) => !object.backgroundImage && object.layer === LAYERS.ANNOTATION.id
      );

      return filteredRectangles.map((rectangle) => {
        const coords = getUpdatedCoords(canvas, images[index], rectangle);
        return {
          id: rectangle.id,
          coords: {
            top: coords.top,
            left: coords.left,
            width: coords.width,
            height: coords.height,
          },
          color: rectangle.stroke,
        };
      });
    });

    rectangles = await Promise.all(canvasImagePromises);

    if (!rectangles || rectangles.length === 0) {
      console.warn("No se encontraron rectángulos válidos para procesar");
      setIsLoading(false);
      return;
    }
    return rectangles;
  } catch (error) {
    console.error("Error procesando rectángulos:", error);
    return [];
  }
};

/**
 * Actualiza el estado de los objetos de texto en cada canvas
 * @param {Array} canvasInstances - Array de instancias de canvas
 * @param {Function} setCanvasObjectStatus - Función para actualizar el estado de los objetos de texto
 */
export const handleUpdateObjectsStatus = (canvasInstances, setCanvasObjectStatus) => {
  Object.keys(canvasInstances).forEach((index) => {
    const canvas = canvasInstances[parseInt(index)];
    if (canvas) {
      const texts = canvas.getObjects().filter((object) => object.layer === LAYERS.TEXT.id);
      setCanvasObjectStatus(parseInt(index), texts.length > 0);
    }
  });
};