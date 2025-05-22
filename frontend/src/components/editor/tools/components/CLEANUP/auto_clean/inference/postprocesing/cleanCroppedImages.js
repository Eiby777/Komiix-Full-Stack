import { cleanCrop } from "./cleanCrop";
/**
 * Cleans cropped images using OCR results
 * @param {Array} scaledOriginalImages - Array of scaled original image crops
 * @param {Array<number>} counts - Array of rectangle counts per canvas
 * @param {Array} images - Array of background images
 * @returns {Array} Array of cleaned image crops organized by canvas
 */
export const cleanCroppedImages = async (scaledOriginalImages, counts, images) => {
    const cleanedImages = [];

    for (let canvasIndex = 0; canvasIndex < scaledOriginalImages.length; canvasIndex++) {
        if (counts[canvasIndex] === 0) {
            cleanedImages.push([]);
            continue;
        }
        const canvasCrops = scaledOriginalImages[canvasIndex];
        const canvasResults = [];
        for (let cropIndex = 0; cropIndex < canvasCrops.length; cropIndex++) {
            const crop = canvasCrops[cropIndex];
            try {
                const cleanedCrop = await cleanCrop({ ...crop, images });
                canvasResults.push(cleanedCrop);
            } catch (error) {
                console.error(`Error en cleanCrop (canvas ${canvasIndex}, crop ${cropIndex}):`, error);
                canvasResults.push(crop);
            }
        }
        cleanedImages.push(canvasResults);
    }

    return cleanedImages;
};
