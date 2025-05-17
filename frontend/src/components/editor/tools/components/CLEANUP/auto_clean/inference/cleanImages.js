import processWithTesseract from "../../../../handlers/useTesseract";
import { filterRectangles } from "./filterRectangles";
import { croppImages } from "./croppImages";
import { cleanCrop } from "./cleanCrop";
import { upscaleCroppedImages, downScaleBoundingBoxes } from "../components/handlers/scalingImages";

/**
    Función principal para limpieza automática de imágenes usando OCR y procesamiento
    @async
    @param {Array} rectangles - Array de rectángulos de anotación a procesar
    @param {Array} images - Array de imágenes de fondo correspondientes
    @param {Function} [onProgress] - Callback para reportar progreso (current, total)
    @param {string} selectedLanguage - Idioma seleccionado para el OCR
    @param {Function} [onDownloadProgress] - Callback para progreso de descarga de modelos
    @returns {Promise<Object>} Objeto con:
        croppedImages: Array de imágenes limpiadas
        tesseractResults: Resultados del OCR
        nonSolidBackgroundRects: Rectángulos con fondo no sólido
    @throws {Error} Si ocurre algún error durante el procesamiento
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
        const { scaledBinarizedImages, scaledOriginalImages, scaleFactors } = upscaleCroppedImages(croppedImages);
        
        const counts = filteredData.counts;
        const totalRecortes = counts.reduce((sum, count) => sum + count, 0);
        const validCanvases = counts.reduce((sum, count) => sum + (count > 0 ? 1 : 0), 0);
        let processedRectangles = 0;

        const GROUP_SIZE = 2;
        const recorteGroups = [];
        const recorteMapping = [];
        let flatRecortes = [];

        scaledBinarizedImages.forEach((canvasCrops, canvasIndex) => {
            if (counts[canvasIndex] === 0) return;
            canvasCrops.forEach((crop, cropIndex) => {
                flatRecortes.push({
                    image: crop.image,
                    id: crop.id,
                    coords: crop.coords,
                    color: crop.color,
                    canvasIndex,
                    cropIndex,
                });
                recorteMapping.push({ canvasIndex, cropIndex });
            });
        });

        for (let i = 0; i < flatRecortes.length; i += GROUP_SIZE) {
            recorteGroups.push(flatRecortes.slice(i, i + GROUP_SIZE));
        }

        const LANGUAGE = selectedLanguage;

        const tesseractResultsFlat = await processWithTesseract(
            recorteGroups,
            LANGUAGE,
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

        const tesseractResults = Array(scaledBinarizedImages.length).fill().map(() => []);
        const downscaledResults = Array(scaledBinarizedImages.length).fill().map(() => []);
        tesseractResultsFlat.forEach((group, groupIndex) => {
            group.forEach((result, resultIndex) => {
                const flatIndex = groupIndex * GROUP_SIZE + resultIndex;
                const { canvasIndex, cropIndex } = recorteMapping[flatIndex] || {};
                if (canvasIndex !== undefined && cropIndex !== undefined) {
                    tesseractResults[canvasIndex][cropIndex] = result;
                    downscaledResults[canvasIndex][cropIndex] = {
                        ...result,
                        boundingBoxes: downScaleBoundingBoxes(
                            result.boundingBoxes,
                            scaleFactors[canvasIndex]?.[cropIndex] || 1
                        ),
                    };
                }
            });
        });

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

        const nonSolidBackgroundRects = [];
        for (let canvasIndex = 0; canvasIndex < cleanedImages.length; canvasIndex++) {
            if (counts[canvasIndex] === 0) continue;
            const canvasCrops = cleanedImages[canvasIndex];
            for (let cropIndex = 0; cropIndex < canvasCrops.length; cropIndex++) {
                const crop = canvasCrops[cropIndex];
                if (crop.isSolidBackground === false || !crop.isSolidBackground) {
                    nonSolidBackgroundRects.push({
                        left: crop.coords.left,
                        top: crop.coords.top,
                        width: crop.coords.width,
                        height: crop.coords.height,
                        canvasIndex,
                        type: crop.isSolidBackground === false ? "non-solid" : "inpainting",
                    });
                }
            }
        }

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