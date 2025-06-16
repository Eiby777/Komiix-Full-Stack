import { filterRectangles } from "./preprocesing/filterRectangles";
import { croppImages } from "./preprocesing/croppImages";
import { upscaleCroppedImages } from "../components/handlers/scalingImages";
import getBackgroundColor from "./preprocesing/getBackgroundColor";
import { cleanCroppedImages } from "./postprocesing/cleanCroppedImages";
import { PreProcess } from "./preprocesing/getBoundingBoxes";
import { identifyNonSolidBackgrounds } from "./postprocesing/sortFinalData";

/**
 * Main function for automatic image cleaning
 * @async
 * @param {Array} rectangles - Array of annotation rectangles to process
 * @param {Array} images - Array of background images
 * @param {Function} [onProgress] - Callback for reporting progress (current, total)
 * @param {string} selectedLanguage - Selected language for text processing
 * @returns {Promise<Object>} Object with:
 *      croppedImages: Array of cleaned images
 *      tesseractResults: Empty array (maintained for compatibility)
 *      nonSolidBackgroundRects: Rectangles with non-solid backgrounds
 * @throws {Error} If an error occurs during processing
 */
const cleanImages = async (
    rectangles,
    images,
    onProgress = () => {},
    selectedLanguage
) => {
    try {
        const filteredData = filterRectangles(rectangles);
        const croppedImages = croppImages(filteredData.filteredRectangles, images);
        const backgroundColors = getBackgroundColor(croppedImages);
        // Preprocess to detect bounding boxes and remove furigana (if Japanese)
        const preprocessor = new PreProcess();
        preprocessor.setVerticalOrientation(false); // Set if vertical text is known
        const processedResults = preprocessor.processImages(backgroundColors, selectedLanguage);

        const { ocrImages, originalImages } = upscaleCroppedImages(processedResults);

        const counts = filteredData.counts;
        const validCanvases = counts.reduce((sum, count) => sum + (count > 0 ? 1 : 0), 0);
        
        // Report starting progress
        onProgress({
            canvasProgress: { current: 0, total: validCanvases },
            recorteProgress: { current: 0, total: 1 },
        });

        // Process images without OCR
        const cleanedImages = await cleanCroppedImages(originalImages, counts, images);
        
        // Report progress after processing images
        onProgress({
            canvasProgress: { current: validCanvases / 2, total: validCanvases },
            recorteProgress: { current: 0.5, total: 1 },
        });
        
        const nonSolidBackgroundRects = identifyNonSolidBackgrounds(cleanedImages, counts);

        // Report completion
        onProgress({
            canvasProgress: { current: validCanvases, total: validCanvases },
            recorteProgress: { current: 1, total: 1 },
        });

        return {
            croppedImages: cleanedImages,
            tesseractResults: [], // Return empty array to maintain return structure
            nonSolidBackgroundRects,
        };
    } catch (error) {
        console.error("Error en cleanImages:", error);
        throw error;
    }
};

export default cleanImages;