import calculateTextCoordinates from "../../../../../../../hooks/textCoordinatesApi";
import { calculateRelativeObjectPosition } from "../../../../handlers/calculatePositions";
import { loadAndCleanImage } from "../../../../handlers/loadAndCleanImage";

/**
 * Adjusts text positions and properties on canvas after translation
 * @param {Array} canvasInstances - Array of Fabric.js canvas instances
 * @param {Array<Array<Object>>} translatedResult - Array of translated text objects grouped by canvas
 *  - `id`: Identificador del rectángulo.
 *  - `originalText`: Texto original detectado por Tesseract.
 *  - `reorderedText`: Texto reordenado según orientación o "same" si no cambió.
 *  - `predictedOrientation`: Orientación detectada (ej. "horizontal-left-to-right").
 *  - `translatedText`: Texto traducido.
 *  - `top`, `left`, `width`, `height`: Coordenadas y dimensiones del rectángulo.
 *  - `centerTop`: Coordenada y del centro del rectángulo.
 *  - `centerLeft`: Coordenada x del centro del rectángulo.
 *  - `isText`: Boolean|null indicating rectangle type (true, false, or null).
 * @param {Array} images - Original image data for each canvas
 * @param {Array} dimensionImages - Dimension information for each canvas
 * @param {Function} setIsLoading - Function to update loading state
 * @param {number} activeImageIndex - The index of the active canvas when processing a single image
 * @returns {Promise<Array<Array<Object>>>} Array of updated text objects with adjusted positions and properties
 */
const adjustTexts = async (canvasInstances, translatedResult, images, dimensionImages, setIsLoading, activeImageIndex) => {
    const handleText = async (object, canvas, cropCanvas, cropX, cropY, croppedPointer, canvasIndex, rect) => {
        try {
            // Get font ID (use default if not available)
            const fontId = object.fontId || object.fontFamily || 'default';

            // Call async API to calculate text coordinates
            const updatedText = await calculateTextCoordinates(cropCanvas, croppedPointer, {
                text: object.translatedText,
            }, object.isText, rect, fontId);

            if (!updatedText) {
                console.warn(`No se pudieron calcular las coordenadas para el objeto ${object.id}`);
                return null;
            }

            // Adjust coordinates back to full image
            updatedText.left += cropX;
            updatedText.top += cropY;

            const { canvasLeft, canvasTop } = calculateRelativeObjectPosition(
                canvas,
                updatedText,
                dimensionImages[canvasIndex]
            );
            if (canvasLeft == null || canvasTop == null) {
                console.warn(`No se pudieron calcular las posiciones relativas para el objeto ${object.id}`);
                return null;
            }

            const updatedData = {
                ...object,
                left: canvasLeft,
                top: canvasTop,
                fontSize: updatedText.fontSize,
                width: updatedText.width,
                canvasIndex: canvasIndex,
            };

            return updatedData;
        } catch (error) {
            console.error(`Error procesando el objeto ${object.id}:`, error);
            return null;
        }
    };

    // If canvasInstances has only one canvas, use activeImageIndex as the canvasIndex
    const indicesToProcess = canvasInstances.length === 1
        ? [activeImageIndex]
        : translatedResult.map((_, index) => index);

    const updatedResults = await Promise.all(
        indicesToProcess.map(async (canvasIndex, arrayIndex) => {
            const canvas = canvasInstances[arrayIndex];
            if (!canvas) {
                console.warn(`No se encontró canvas en el índice ${arrayIndex}`);
                return [];
            }

            if (!translatedResult[canvasIndex]) {
                console.warn(`No se encontraron resultados traducidos para el índice ${canvasIndex}`);
                return [];
            }

            if (!images[canvasIndex] || !dimensionImages[canvasIndex]) {
                console.warn(`Imagen o dimensiones no encontradas para el índice ${canvasIndex}`);
                return [];
            }

            const image = await loadAndCleanImage(canvas, images[canvasIndex]);
            if (!image) {
                console.warn(`No se pudo cargar la imagen para el índice ${canvasIndex}`);
                return [];
            }

            // Collect crop regions for all text objects in this canvas
            const canvasResults = translatedResult[canvasIndex];
            const cropRegions = canvasResults.map((result) => {
                const relativePointer = { x: result.centerLeft, y: result.centerTop };
                let cropX, cropY, cropWidth, cropHeight;

                // Usar siempre el rectángulo con un padding de 50px
                const padding = 0;
                cropX = Math.max(0, result.left - padding);
                cropY = Math.max(0, result.top - padding);
                cropWidth = result.width + 2 * padding;
                cropHeight = result.height + 2 * padding;

                // Adjust if crop exceeds image boundaries
                if (cropX + cropWidth > image.width) {
                    cropX = Math.max(0, image.width - cropWidth);
                }
                if (cropY + cropHeight > image.height) {
                    cropY = Math.max(0, image.height - cropHeight);
                }
                cropWidth = Math.min(cropWidth, image.width - cropX);
                cropHeight = Math.min(cropHeight, image.height - cropY);

                // Create cropped canvas
                const cropCanvas = document.createElement('canvas');
                cropCanvas.width = cropWidth;
                cropCanvas.height = cropHeight;
                const cropCtx = cropCanvas.getContext('2d');
                cropCtx.drawImage(
                    image,
                    cropX,
                    cropY,
                    cropWidth,
                    cropHeight,
                    0,
                    0,
                    cropWidth,
                    cropHeight
                );

                // Adjust pointer for cropped image
                const croppedPointer = {
                    x: relativePointer.x - cropX,
                    y: relativePointer.y - cropY,
                };

                // Rectangle coordinates relative to crop
                const rect = {
                    x: result.left - cropX,
                    y: result.top - cropY,
                    w: result.width,
                    h: result.height,
                };

                return { result, cropCanvas, cropX, cropY, croppedPointer, rect };
            });

            // Process each text object using its cropped region
            const updatedCanvasResults = await Promise.all(
                cropRegions.map(async ({ result, cropCanvas, cropX, cropY, croppedPointer, rect }) => {
                    const updatedObject = await handleText(
                        result,
                        canvas,
                        cropCanvas,
                        cropX,
                        cropY,
                        croppedPointer,
                        canvasIndex,
                        rect
                    );
                    return updatedObject;
                })
            );

            return updatedCanvasResults.filter((result) => result !== null);
        })
    );

    if (!updatedResults) {
        console.warn("Hubo un problema ajustando el texto");
        setIsLoading(false);
        return;
    }

    return updatedResults;
};

export default adjustTexts;