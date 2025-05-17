import fabric from "../../../../../../../constants/fabricInstance";
import { calculateRelativePointer } from "../../../../handlers/calculatePositions";
import { LAYERS } from "../../../../../../../constants/layers";

const createFabricCanvas = (canvasElement, cleanImage) => {
    const fabricCanvas = new fabric.Canvas(canvasElement, {
        width: cleanImage.width,
        height: cleanImage.height,
        selection: false,
        preserveObjectStacking: true,
        enableRetinaScaling: false,
    });

    const fabricImage = new fabric.FabricImage(cleanImage, {
        left: 0,
        top: 0,
        scaleX: 1,
        scaleY: 1,
        selectable: false,
        evented: false,
    });
    fabricCanvas.add(fabricImage);
    return fabricCanvas;
}

const addTextToCanvas = async (canvasInstance, fabricCanvas, textObjects, cleanImage) => {
    await Promise.all(
        textObjects.map(async (textObj) => {
            const clonedTextObj = await textObj.clone();
            console.log('textObj', clonedTextObj.left, clonedTextObj.top);
            const adjustedCoords = calculateRelativePointer(
                { x: clonedTextObj.left, y: clonedTextObj.top },
                canvasInstance,
                cleanImage
            );

            console.log(adjustedCoords);

            if (adjustedCoords) {
                clonedTextObj.set({
                    left: adjustedCoords.x,
                    top: adjustedCoords.y,
                    opacity: 1,
                });

                fabricCanvas.add(clonedTextObj);
                fabricCanvas.bringObjectToFront(clonedTextObj);
            } else {
                console.warn('No se pudieron calcular las coordenadas relativas para el Textbox');
            }
        })
    );
}

/**
   * Agrega texto a imágenes de canvas.
   * @param {HTMLCanvasElement[]} arrayCanvasImages - Matriz de imágenes de canvas.
   * @returns {Promise<string[]>} Matriz de imágenes codificadas en base64 con texto.
   */
const handleAddText = async (
    arrayCanvasImages, 
    canvasInstances, 
    activeImageIndex
) => {
    const result = [];

    for (const [index, canvasImage] of arrayCanvasImages.entries()) {
        if (!canvasImage) {
            console.error(`No se encontró la imagen para el canvas en el índice ${index}`);
            continue;
        }

        const canvasElement = document.createElement('canvas');
        const fabricCanvas = createFabricCanvas(canvasElement, canvasImage);
        let textObjects;
        if (arrayCanvasImages.length === 1) {
            textObjects = canvasInstances[activeImageIndex].getObjects().filter((obj) => obj.layer === LAYERS.TEXT.id);
            await addTextToCanvas(canvasInstances[activeImageIndex], fabricCanvas, textObjects, canvasImage);
        } else {
            textObjects = canvasInstances[index].getObjects().filter((obj) => obj.layer === LAYERS.TEXT.id);
            await addTextToCanvas(canvasInstances[index], fabricCanvas, textObjects, canvasImage);
        }



        fabricCanvas.requestRenderAll();
        fabricCanvas.renderAll();

        const dataURL = fabricCanvas.toDataURL();
        result.push(dataURL);

        fabricCanvas.dispose();
        canvasElement.remove();
    }
    return result;
};


export default handleAddText;