import { LAYERS } from "../../../../constants/layers";

/**
 * Obtiene los objetos de limpieza del canvas y los procesa para obtener la mascara de limpieza
 * @param {fabric.Canvas} canvas - Canvas que contiene los objetos de limpieza
 * @returns {Object} Objeto con la mascara de limpieza en base64, el ancho y alto del canvas original
 */
const getCleanupObjectsData = (canvas) => {
    if (!canvas) return null;

    const bgObj = canvas.getObjects().find((obj) => obj.backgroundImage);
    if (!bgObj) return null;

    const imgWidth = Math.round(bgObj.width * bgObj.scaleX);
    const imgHeight = Math.round(bgObj.height * bgObj.scaleY);
    const bgLeft = canvas.width / 2 - imgWidth / 2;
    const bgTop = canvas.height / 2 - imgHeight / 2;

    const offCanvas = document.createElement('canvas');
    offCanvas.width = imgWidth;
    offCanvas.height = imgHeight;
    const ctx = offCanvas.getContext('2d');

    const cleanupObjects = canvas.getObjects().filter((obj) => obj.layer === LAYERS.CLEANUP.id);
    if (cleanupObjects.length === 0) return { mask64: null, width: imgWidth, height: imgHeight, positions: [] };

    cleanupObjects.forEach((obj) => {
        const relativeLeft = obj.left - bgLeft;
        const relativeTop = obj.top - bgTop;
        const width = obj.width * (obj.scaleX || 1);
        const height = obj.height * (obj.scaleY || 1);

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = imgWidth;
        tempCanvas.height = imgHeight;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.save();
        tempCtx.translate(relativeLeft, relativeTop);
        tempCtx.scale(obj.scaleX || 1, obj.scaleY || 1);

        if (obj.type === 'image' && obj.getElement) {
            const imgElement = obj.getElement();
            tempCtx.drawImage(imgElement, 0, 0, obj.width, obj.height);
        } else {
            obj._render(tempCtx);
        }

        tempCtx.restore();
        ctx.drawImage(tempCanvas, 0, 0);
    });

    return { mask64: offCanvas.toDataURL(), width: imgWidth, height: imgHeight };
};

/**
 * Convierte un blob en un canvas
 * @param {string|Blob} blobUrl - URL del blob o el blob mismo
 * @returns {Promise<HTMLCanvasElement>} Promesa que se resuelve con el canvas
 */
const convertBlobToCanvas = (blobUrl) => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const image = new Image();
        image.src = blobUrl.src || blobUrl;
        image.onload = () => {
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            ctx.drawImage(image, 0, 0);
            resolve(canvas);
        };
        image.onerror = () => console.error('Error loading image:', blobUrl);
    });
};

/**
 * Carga una imagen y la limpia utilizando los objetos de limpieza del canvas
 * @param {fabric.Canvas} canvas - Canvas que contiene los objetos de limpieza
 * @param {Object} image - Imagen a limpiar
 * @returns {Promise<HTMLCanvasElement>} Promesa que se resuelve con el canvas limpio
 */
const loadAndCleanImage = async (canvas, image) => {
    const canvasImage = await convertBlobToCanvas(image);
    const cleanupData = getCleanupObjectsData(canvas);
    if (cleanupData && cleanupData.mask64) {
        const ctx = canvasImage.getContext('2d');
        const cleanupImage = new Image();
        cleanupImage.src = cleanupData.mask64;
        await new Promise((resolve, reject) => {
            cleanupImage.onload = () => resolve();
            cleanupImage.onerror = (error) => reject(error);
        });
        ctx.drawImage(cleanupImage, 0, 0);
    }
    return canvasImage;
};

export { getCleanupObjectsData, loadAndCleanImage }