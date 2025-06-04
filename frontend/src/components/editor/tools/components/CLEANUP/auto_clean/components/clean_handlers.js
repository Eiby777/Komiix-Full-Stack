import fabric from "../../../../../../../constants/fabricInstance";
import { LAYERS } from "../../../../../../../constants/layers";
import { v4 as uuidv4 } from "uuid";
import ObjectStatus from "../../../../../floating-menus/components/UndoRedoMenu/handlers/enumObjectRequests";

/**
 * Obtiene las imágenes de fondo de todos los canvas instances
 * @async
 * @param {Array} canvasInstances - Array de instancias de canvas de Fabric.js
 * @returns {Promise<Array<HTMLCanvasElement>>} Array de canvases con las imágenes de fondo
 * @throws {Error} Si ocurre un error al procesar las imágenes
 */
export const getImages = async (canvasInstances) => {
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
        return validImages;
    } catch (error) {
        console.error("Error processing images:", error);
    }
};

/**
 * Obtiene y normaliza las coordenadas de los rectángulos de anotación en los canvas
 * @async 
 * @param {Array} canvasInstances - Array de instancias de canvas
 * @param {Array} images - Array de imágenes de fondo correspondientes
 * @returns {Promise<Array>} Array de rectángulos con coordenadas normalizadas
 */
export const getRectangles = async (canvasInstances, images) => {
    let rectangles = [];

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

            const mappedRectangles = filteredRectangles.map((rectangle) => {
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

            return mappedRectangles;
        });

        rectangles = await Promise.all(canvasImagePromises);
        return rectangles;
    } catch (error) {
        console.error("Error processing rectangles:", error);
        return [];
    }
};

/**
 * Añade los objetos limpiados al canvas original
 * @async
 * @param {Object} result - Resultado del procesamiento con las imágenes limpiadas
 * @param {Array} canvasInstances - Array de instancias de canvas originales
 * @returns {Promise<void>}
 */
export const addCleanedObjects = async (result, canvasInstances, saveState) => {
    for (const [canvasIndex, canvasCrops] of result.croppedImages.entries()) {

        const canvas = canvasInstances[canvasIndex];
        if (!canvas) {
            console.error(`No se encontró canvas original para el índice ${canvasIndex}`);
            continue;
        }

        const bgObj = canvas.getObjects().find((obj) => obj.backgroundImage);
        if (!bgObj) {
            console.error(`No se encontró imagen de fondo en el canvas ${canvasIndex}`);
            continue;
        }

        const imgWidth = bgObj.width * bgObj.scaleX;
        const imgHeight = bgObj.height * bgObj.scaleY;
        const imgCenterX = bgObj.left;
        const imgCenterY = bgObj.top;
        const imgLeft = imgCenterX - imgWidth / 2;
        const imgTop = imgCenterY - imgHeight / 2;

        for (const crop of canvasCrops) {
            if (crop.cleanedMaskUrl) {
                const { coords } = crop;
                const adjustedLeft = imgLeft + coords.left;
                const adjustedTop = imgTop + coords.top;

                const fabricImg = await fabric.FabricImage.fromURL(crop.cleanedMaskUrl);
                fabricImg.set({
                    left: adjustedLeft,
                    top: adjustedTop,
                    selectable: false,
                    layer: LAYERS.CLEANUP.id,
                    id: uuidv4(),
                    src: crop.cleanedMaskUrl,
                });

                canvas.add(fabricImg);
                canvas.requestRenderAll();
                saveState(fabricImg, ObjectStatus.ADD);
            }
            else {
                console.error(`No se encontró cleanedMaskUrl para el recorte ${crop.id}`);
            }
        }
    }
};

/**
 * Maneja los rectángulos con fondo no sólido creando máscaras blancas
 * @async
 * @param {Object} result - Resultado del procesamiento
 * @param {Array} canvasInstances - Array de instancias de canvas
 * @param {Object} MASK - Configuración de la capa MASK
 * @returns {Promise<void>}
 */
export const nonSolidBackgroundRects = async (result, canvasInstances, MASK, saveState) => {
    for (const rect of result.nonSolidBackgroundRects) {
        const canvas = canvasInstances[rect.canvasIndex];
        if (!canvas) continue;

        const bgObj = canvas.getObjects().find((obj) => obj.backgroundImage);
        if (!bgObj) continue;

        const imgWidth = bgObj.width * bgObj.scaleX;
        const imgHeight = bgObj.height * bgObj.scaleY;
        const imgCenterX = bgObj.left;
        const imgCenterY = bgObj.top;
        const imgLeft = imgCenterX - imgWidth / 2;
        const imgTop = imgCenterY - imgHeight / 2;

        const adjustedLeft = imgLeft + rect.left;
        const adjustedTop = imgTop + rect.top;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = rect.width;
        tempCanvas.height = rect.height;
        const ctx = tempCanvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, rect.width, rect.height);

        const whiteImageUrl = tempCanvas.toDataURL();

        const imgObj = await fabric.FabricImage.fromURL(whiteImageUrl);
        imgObj.set({
            left: adjustedLeft,
            top: adjustedTop,
            selectable: false,
            layer: MASK.id,
            opacity: 0,
            id: uuidv4(),
            src: whiteImageUrl,
        });

        canvas.add(imgObj);
        canvas.requestRenderAll();
        saveState(imgObj, ObjectStatus.ADD);
    }
}
