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

        const handleCropping = (relativePointer, image) => {
            // Define crop dimensions (300x300 pixels)
            const cropSize = 500;
            const halfCrop = cropSize / 2;

            // Calculate crop boundaries centered at relativePointer
            let cropX = Math.max(0, relativePointer.x - halfCrop);
            let cropY = Math.max(0, relativePointer.y - halfCrop);
            let cropWidth = cropSize;
            let cropHeight = cropSize;

            // Adjust if crop exceeds image boundaries
            if (cropX + cropWidth > image.width) {
                cropX = Math.max(0, image.width - cropWidth);
            }
            if (cropY + cropHeight > image.height) {
                cropY = Math.max(0, image.height - cropHeight);
            }
            cropWidth = Math.min(cropSize, image.width - cropX);
            cropHeight = Math.min(cropSize, image.height - cropY);

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

        const handleMouseDown = async (options) => {
            if (!options.target && !options.e.ctrlKey) {
                selectedObject = null;
                canvas.discardActiveObject();
                canvas.requestRenderAll();
            } else if (options.e.ctrlKey && selectedObject) {
                const pointer = canvas.getPointer(options.e);
                const relativePointer = calculateRelativePointer(pointer, canvas, dimensionImages[currentImageIndex]);

                const image = await loadAndCleanImage(
                    canvas,
                    images[currentImageIndex]
                );

                const {croppedPointer, cropX, cropY, cropCanvas} = handleCropping(relativePointer, image)

                const updatedText = calculateTextCoordinates(
                    cropCanvas,
                    croppedPointer,
                    selectedObject
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