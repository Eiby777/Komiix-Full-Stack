import { cleanCrop } from "./cleanCrop";
/**
 * Cleans cropped images using OCR results
 * @param {Array} ocrResults - Array of OCR results
 * @param {Array} croppedImages - Array of scaled original image crops
 * @param {Array<number>} counts - Array of rectangle counts per canvas
 * @param {Array} images - Array of background images
 * @returns {Array} Array of cleaned image crops organized by canvas
 */
/**
 * Cleans cropped images using OCR results
 * @param {Map<string, Object>} ocrResultsMap - Map of OCR results by crop ID
 * @param {Array} croppedImages - Array of cropped images organized by canvas and crop
 * @param {Array<number>} counts - Array of rectangle counts per canvas
 * @param {Array} images - Array of background images
 * @returns {Array} Array of cleaned image crops organized by canvas
 */
export const cleanCroppedImages = async (ocrResultsMap, croppedImages, counts, images) => {
    const cleanedImages = [];

    for (let canvasIndex = 0; canvasIndex < croppedImages.length; canvasIndex++) {
        if (counts[canvasIndex] === 0) {
            cleanedImages.push([]);
            continue;
        }
        const canvasCrops = croppedImages[canvasIndex];
        const canvasResults = [];
        
        for (let cropIndex = 0; cropIndex < canvasCrops.length; cropIndex++) {
            const crop = canvasCrops[cropIndex];
            const cropId = crop.id || `crop-${canvasIndex}-${cropIndex}`;
            const ocrResult = ocrResultsMap.get(cropId);
            
            try {
                const cleanedCrop = await cleanCrop({ 
                    ...crop, 
                    images, 
                    ocrResults: ocrResult ? [ocrResult] : [] 
                });
                canvasResults.push(cleanedCrop);
            } catch (error) {
                console.error(`Error en cleanCrop (canvas ${canvasIndex}, crop ${cropIndex}, id: ${cropId}):`, error);
                canvasResults.push(crop);
            }
        }
        cleanedImages.push(canvasResults);
    }

    return cleanedImages;
};
