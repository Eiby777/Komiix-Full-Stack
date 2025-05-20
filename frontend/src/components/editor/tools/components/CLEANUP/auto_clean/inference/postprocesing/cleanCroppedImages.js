import { cleanCrop } from "./cleanCrop";
/**
 * Cleans cropped images using OCR results
 * @param {Array} scaledOriginalImages - Array of scaled original image crops
 * @param {Array} downscaledResults - Array of downscaled OCR results
 * @param {Array<number>} counts - Array of rectangle counts per canvas
 * @param {Array} images - Array of background images
 * @param {string} selectedLanguage - Selected language for OCR
 * @returns {Array} Array of cleaned image crops organized by canvas
 */
export const cleanCroppedImages = async (scaledOriginalImages, downscaledResults, counts, images, selectedLanguage) => {
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
            const tesseractResult = downscaledResults[canvasIndex]?.[cropIndex] || {
                text: "",
                confidence: 0,
                boundingBoxes: [],
            };
            try {
                const cleanedCrop = await cleanCrop({ ...crop, images }, tesseractResult, selectedLanguage);
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
