import { useEffect } from 'react';
import { useEditorStore } from '../../../../../../stores/editorStore';
import PlusTool from '../../ANNOTATION/plus';
import calculateTextCoordinates from '../../../handlers/calculateTextCoordinates';
import { loadAndCleanImage } from '../../../handlers/loadAndCleanImage';
import { calculateRelativePointer, calculateRelativeObjectPosition } from '../../../handlers/calculatePositions';

const AdjustTextTool = ({ currentImageIndex }) => {
    const { getCanvasInstance, dimensionImages, images } = useEditorStore();

    let selectedObject = null;

    useEffect(() => {
        const canvas = getCanvasInstance(currentImageIndex);
        if (canvas.getActiveObject()) {
            selectedObject = canvas.getActiveObject();
        }
    }, [currentImageIndex, getCanvasInstance]);

    useEffect(() => {
        const canvas = getCanvasInstance(currentImageIndex);
        if (!canvas) {
            console.warn("Canvas not found for index:", currentImageIndex);
            return;
        }

        const handleSelectionChanged = () => {
            const activeObject = canvas.getActiveObject();
            selectedObject = activeObject;
            if (activeObject) {
                activeObject.setCoords();
            }
        };

        const handleCropping = (relativePointer, image, rect = null) => {
            let cropX, cropY, cropWidth, cropHeight;
            const offset = 0; // Offset de 50px para todos los lados

            if (rect) {
                // Calcular la posición de la imagen en el canvas
                const canvasCenter = {
                    x: canvas.width / 2,
                    y: canvas.height / 2
                };
                const imageLeft = canvasCenter.x - image.width / 2;
                const imageTop = canvasCenter.y - image.height / 2;

                // Convertir coordenadas del canvas a coordenadas relativas a la imagen
                const relativeRectX1 = Math.max(0, rect.x1 - imageLeft);
                const relativeRectY1 = Math.max(0, rect.y1 - imageTop);
                const relativeRectX2 = Math.min(image.width, rect.x2 - imageLeft);
                const relativeRectY2 = Math.min(image.height, rect.y2 - imageTop);

                // Aplicar offset a las coordenadas del rectángulo (asegurando que no salgan de los límites)
                cropX = Math.max(0, relativeRectX1 - offset);
                cropY = Math.max(0, relativeRectY1 - offset);
                
                // Calcular ancho y alto con el offset (doble offset porque es para ambos lados)
                const rectWidth = relativeRectX2 - relativeRectX1;
                const rectHeight = relativeRectY2 - relativeRectY1;
                cropWidth = Math.min(rectWidth + (2 * offset), image.width - cropX);
                cropHeight = Math.min(rectHeight + (2 * offset), image.height - cropY);
                
                // Ajustar si el recorte excede los límites de la imagen
                if (cropX + cropWidth > image.width) {
                    cropX = Math.max(0, image.width - cropWidth);
                }
                if (cropY + cropHeight > image.height) {
                    cropY = Math.max(0, image.height - cropHeight);
                }
            } else {
                // Comportamiento original cuando no hay rectángulo
                const cropSize = 500;
                const halfCrop = cropSize / 2;

                // Calcular límites del recorte centrados en el puntero
                cropX = Math.max(0, relativePointer.x - halfCrop);
                cropY = Math.max(0, relativePointer.y - halfCrop);
                cropWidth = cropSize;
                cropHeight = cropSize;

                // Ajustar si el recorte excede los límites de la imagen
                if (cropX + cropWidth > image.width) {
                    cropX = Math.max(0, image.width - cropWidth);
                }
                if (cropY + cropHeight > image.height) {
                    cropY = Math.max(0, image.height - cropHeight);
                }
                cropWidth = Math.min(cropSize, image.width - cropX);
                cropHeight = Math.min(cropSize, image.height - cropY);
            }

            // Create a canvas for cropping
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
            // Adjust relativePointer for the cropped image
            const croppedPointer = {
                x: relativePointer.x - cropX,
                y: relativePointer.y - cropY,
            };

            return {croppedPointer, cropX, cropY, cropCanvas};
        }

        const checkRect = (relativePointer) => {
            // Buscar todos los objetos de tipo rectángulo
            const rects = canvas.getObjects().filter(obj => obj.type === 'rect');
            
            // Verificar cada rectángulo para ver si contiene el puntero
            for (const rect of rects) {
                const { left, top, width, height } = rect;
                const right = left + width;
                const bottom = top + height;
                
                // Verificar si el puntero está dentro de los límites del rectángulo
                if (relativePointer.x >= left && 
                    relativePointer.x <= right && 
                    relativePointer.y >= top && 
                    relativePointer.y <= bottom) {
                    
                    // Devolver las coordenadas del rectángulo: [x1, y1, x2, y2]
                    return {
                        x1: left,
                        y1: top,
                        x2: right,
                        y2: bottom,
                        object: rect // Opcional: incluir el objeto rectángulo completo
                    };
                }
            }
            
            return null; // No se encontró ningún rectángulo que contenga el puntero
        }

        const handleMouseDown = async (options) => {
            if (!options.target && !options.e.ctrlKey) {
                selectedObject = null;
                canvas.discardActiveObject();
                canvas.requestRenderAll();
            } else if (options.e.ctrlKey && selectedObject) {
                const pointer = canvas.getPointer(options.e);
                const relativePointer = calculateRelativePointer(pointer, canvas, dimensionImages[currentImageIndex]);

                const rect = checkRect(pointer);

                const image = await loadAndCleanImage(
                    canvas,
                    images[currentImageIndex]
                );

                const isText = rect ? true : false;

                const {croppedPointer, cropX, cropY, cropCanvas} = handleCropping(relativePointer, image, rect)
                const updatedText = calculateTextCoordinates(
                    cropCanvas,
                    croppedPointer,
                    selectedObject,
                    isText,
                    rect
                );

                updatedText.left += cropX;
                updatedText.top += cropY;

                const { canvasLeft, canvasTop } = calculateRelativeObjectPosition(
                    canvas,
                    updatedText,
                    dimensionImages[currentImageIndex]
                );

                selectedObject.set({
                    left: canvasLeft,
                    top: canvasTop,
                    fontSize: updatedText.fontSize,
                    width: updatedText.width,
                });
                selectedObject.setCoords();
                canvas.bringObjectToFront(selectedObject);
                canvas.discardActiveObject();
                canvas.requestRenderAll();
                
                // Actualizar la selección después del movimiento
                canvas.setActiveObject(selectedObject);
                canvas.requestRenderAll();
            }
        };

        canvas.on('selection:created', handleSelectionChanged);
        canvas.on('selection:updated', handleSelectionChanged);
        canvas.on('mouse:down', handleMouseDown);

        return () => {
            canvas.off('selection:created', handleSelectionChanged);
            canvas.off('selection:updated', handleSelectionChanged);
            canvas.off('mouse:down', handleMouseDown);
        };
    }, [currentImageIndex, getCanvasInstance]);

    return <PlusTool />;
};

export default AdjustTextTool;