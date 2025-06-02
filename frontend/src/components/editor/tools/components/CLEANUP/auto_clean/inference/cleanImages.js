import processWithTesseract from "../../../../handlers/useTesseract";
import { filterRectangles } from "./preprocesing/filterRectangles";
import { croppImages } from "./preprocesing/croppImages";
import { upscaleCroppedImages } from "../components/handlers/scalingImages";
import getBackgroundColor from "./preprocesing/getBackgroundColor";
import { cleanCroppedImages } from "./postprocesing/cleanCroppedImages";
import { PreProcess } from "./preprocesing/getBoundingBoxes";
import { prepareRecorteGroups, processOCRResults, identifyNonSolidBackgrounds } from "./postprocesing/sortFinalData";

/**
 * Main function for automatic image cleaning using OCR and processing
 * @async
 * @param {Array} rectangles - Array of annotation rectangles to process
 * @param {Array} images - Array of background images
 * @param {Function} [onProgress] - Callback for reporting progress (current, total)
 * @param {string} selectedLanguage - Selected language for OCR
 * @param {Function} [onDownloadProgress] - Callback for model download progress
 * @param {boolean} selectAllImages - Whether to process all images or only the active one
 * @returns {Promise<Object>} Object with:
 *      croppedImages: Array of cleaned images
 *      tesseractResults: OCR results
 *      nonSolidBackgroundRects: Rectangles with non-solid backgrounds
 * @throws {Error} If an error occurs during processing
 */
const cleanImages = async (
    rectangles,
    images,
    onProgress = () => {},
    selectedLanguage,
    onDownloadProgress = () => {}
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
        let processedRectangles = 0;
        const GROUP_SIZE = 2;

        const { recorteGroups, recorteMapping, totalRecortes } = prepareRecorteGroups(ocrImages, counts, GROUP_SIZE);

        const tesseractResultsFlat = await processWithTesseract(
            recorteGroups,
            selectedLanguage,
            (m) => {
                if (m.status === "recognizing text" && m.progress === 1) {
                    processedRectangles += 1;
                    const recorteProgressRatio = processedRectangles / totalRecortes;
                    const completedCanvases = Math.min(
                        Math.floor(recorteProgressRatio * validCanvases),
                        validCanvases
                    );
                    onProgress({
                        canvasProgress: { current: completedCanvases, total: validCanvases },
                        recorteProgress: { current: processedRectangles, total: totalRecortes },
                    });
                }
            },
            onDownloadProgress
        );

        const downscaledResults = processOCRResults(tesseractResultsFlat, recorteMapping, ocrImages, GROUP_SIZE);

        const cleanedImages = await cleanCroppedImages(originalImages, counts, images);

        const nonSolidBackgroundRects = identifyNonSolidBackgrounds(cleanedImages, counts);

        const tesseractResults = downscaledResults.map((canvasResults, canvasIndex) =>
            canvasResults.map((result) => tesseractResultsFlat
                .flat()
                .find((r, i) => {
                    const { canvasIndex, cropIndex } = recorteMapping[i] || {};
                    return canvasIndex === canvasIndex && cropIndex === canvasResults.indexOf(result);
                })
            )
        );

        return {
            croppedImages: cleanedImages,
            tesseractResults,
            nonSolidBackgroundRects,
        };
    } catch (error) {
        console.error("Error en cleanImages:", error);
        throw error;
    }
};

export default cleanImages;