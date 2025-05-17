/**
 * Obtiene las imágenes de fondo de todos los canvas instances
 * @async
 * @param {Array} canvasInstances - Array de instancias de canvas de Fabric.js
 * @returns {Promise<Array<HTMLCanvasElement>>} Array de canvases con las imágenes de fondo
 * @throws {Error} Si ocurre un error al procesar las imágenes
 */
const getImages = async (canvasInstances, setIsLoading) => {
  try {
    const canvasImagePromises = canvasInstances.map((canvas) => {
      return new Promise((resolve, reject) => {
        const objects = canvas.getObjects();
        const imageObject = objects.find((object) => object.backgroundImage);

        if (!imageObject || !imageObject._element?.src) {
          console.error("No valid background image found for canvas:", canvas);
          return resolve(null);
        }

        const backgroundImageCanvas = document.createElement("canvas");
        const ctx = backgroundImageCanvas.getContext("2d");
        backgroundImageCanvas.width = imageObject.width;
        backgroundImageCanvas.height = imageObject.height;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageObject._element.src;

        img.onload = () => {
          ctx.drawImage(img, 0, 0, imageObject.width, imageObject.height);
          resolve(backgroundImageCanvas);
        };
        img.onerror = (error) => {
          console.error("Error loading image:", error);
          reject(error);
        };
      });
    });

    const canvasImages = await Promise.all(canvasImagePromises);
    const validImages = canvasImages.filter((img) => img !== null);

    if (!validImages || validImages.length === 0) {
      setIsLoading(false);
      console.error("No se encontraron imágenes válidas para procesar");
    }
    return validImages;
  } catch (error) {
    console.error("Error processing images:", error);
    return [];
  }
};

export default getImages;