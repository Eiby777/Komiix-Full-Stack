/**
 * Calcula la posición relativa del objeto en el canvas
 * @param {fabric.Canvas} canvas - Canvas donde se encuentra el objeto
 * @param {Object} updatedText - Objeto de texto actualizado
 * @param {Object} dimensionImage - Dimensiones de la imagen del canvas
 * @returns {Object} Objeto con las coordenadas relativas del objeto
 */
const calculateRelativeObjectPosition = (canvas, updatedText, dimensionImage) => {
    const canvasCenter = {
        x: canvas.width / 2,
        y: canvas.height / 2,
    };
    const imageWidth = dimensionImage.width;
    const imageHeight = dimensionImage.height;
    const imageLeft = canvasCenter.x - imageWidth / 2;
    const imageTop = canvasCenter.y - imageHeight / 2;

    const canvasLeft = updatedText.left + imageLeft;
    const canvasTop = updatedText.top + imageTop;

    return { canvasLeft, canvasTop };
};

/**
 * Calcula la posición relativa del puntero en el canvas en cuanto a la imagen
 * @param {Object} pointer - Coordenadas del puntero
 * @param {fabric.Canvas} canvas - Canvas donde se encuentra el objeto
 * @param {Object} image - Imagen del canvas
 * @returns {Object} Objeto con las coordenadas relativas del puntero
 */
const calculateRelativePointer = (pointer, canvas, image) => {
    if (!canvas || !image) {
        return null;
    }

    const canvasCenter = {
        x: canvas.width / 2,
        y: canvas.height / 2,
    };

    const relativeImage = {
        left: canvasCenter.x - image.width / 2,
        top: canvasCenter.y - image.height / 2,
    };

    const transformedPointer = {
        x: pointer.x - relativeImage.left,
        y: pointer.y - relativeImage.top,
    };

    return transformedPointer;
};

export { calculateRelativeObjectPosition, calculateRelativePointer };