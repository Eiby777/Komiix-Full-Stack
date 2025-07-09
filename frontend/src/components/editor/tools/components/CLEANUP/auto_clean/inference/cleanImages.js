import { filterRectangles } from "./preprocesing/filterRectangles";
import { croppImages } from "./preprocesing/croppImages";
import { cleanCroppedImages } from "./postprocesing/cleanCroppedImages";
import { identifyNonSolidBackgrounds } from "./postprocesing/sortFinalData";
import OcrService from "../../../TYPE/text_scan/inference/ocr/callOCREndpoint";

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
        console.log(croppedImages);

        const counts = filteredData.counts;
        const validCanvases = counts.reduce((sum, count) => sum + (count > 0 ? 1 : 0), 0);
        
        onProgress({
            canvasProgress: { current: 0, total: validCanvases },
            recorteProgress: { current: 0, total: 1 },
            status: "Processing OCR..."
        });

        // Process images with OCR
        let processedRectangles = 0;
        const totalRecortes = croppedImages.flat().length;
        
        const ocrService = new OcrService((m) => {
            if (m.status === "recognizing text" && m.progress === 1) {
                processedRectangles += 1;
                const recorteProgressRatio = processedRectangles / totalRecortes;
                const completedCanvases = Math.min(
                    Math.floor(recorteProgressRatio * validCanvases),
                    validCanvases
                );
                onProgress({
                    status: m.status,
                    canvasProgress: { 
                        current: completedCanvases, 
                        total: validCanvases 
                    },
                    recorteProgress: { 
                        current: processedRectangles, 
                        total: totalRecortes 
                    }
                });
            }
        });
        
        // Create a flat list of all crops with their original IDs
        const allCrops = [];
        const ocrInput = croppedImages.map((group, groupIndex) => 
            group.map((crop, imageIndex) => {
                const image = crop?.image || crop;
                const cropId = crop.id || `crop-${groupIndex}-${imageIndex}`;
                allCrops.push({ ...crop, originalId: cropId });
                return {
                    image,
                    id: cropId
                };
            })
        );

        const ocrResults = await ocrService.callOcrEndpoint(ocrInput);
        console.log('OCR Results:', ocrResults);

        // Create a map of OCR results by ID for easy lookup
        const ocrResultsMap = new Map();
        ocrResults.flat().forEach(result => {
            if (result && result.id) {
                ocrResultsMap.set(result.id, result);
            }
        });

        const cleanedImages = await cleanCroppedImages(ocrResultsMap, croppedImages, counts, images);
        
        onProgress({
            canvasProgress: { current: validCanvases / 2, total: validCanvases },
            recorteProgress: { current: 0.5, total: 1 },
        });
        
        const nonSolidBackgroundRects = identifyNonSolidBackgrounds(cleanedImages, counts);

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