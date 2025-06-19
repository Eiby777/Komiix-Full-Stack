import OcrService from "./ocr/callOCREndpoint"; // Updated: Now imports the OcrService class
import { filterRectangles } from "./preprocesing/filterRectangles";
import { croppImages } from "./preprocesing/croppImages";
import detectTextOrientation from "./postprocesing/detectTextOrientation";
import reorderTextByOrientation from "./postprocesing/reorderTextByOrientation";
import { upscaleCroppedImages } from "./preprocesing/scalingImages";
import getBackgroundColor from "./preprocesing/getBackgroundColor";
import { PreProcess } from "./preprocesing/getBoundingBoxes";
import { prepareRecorteGroups, processOCRResults } from "./postprocesing/sortFinalData";

/**
 * Procesa imágenes recortadas para detectar y reordenar texto utilizando un endpoint OCR.
 * Filtra rectángulos, recorta imágenes, escala las imágenes, realiza OCR, detecta la orientación del texto
 * y reordena el texto según la orientación detectada.
 *
 * @async
 * @function cleanImages
 * @param {Array<Array<Object>>} rectangles - Arreglo de rectángulos por lienzo, cada uno con coordenadas y otros datos.
 * @param {Array<string>} images - Arreglo de imágenes en formato base64 o URLs para procesar.
 * @param {function} [onProgress] - Callback opcional para reportar progreso. Recibe `(completedCanvases, validCanvases)`.
 * @param {string} selectedLanguage - Código del idioma seleccionado para OCR (ej. "eng", "spa", "jpn", "chi_sim", "kor").
 * @param {function} [onDownloadProgress] - Callback opcional para reportar progreso de descarga.
 * @param {function} [setIsLoading] - Callback para actualizar el estado de carga (ej. para UI).
 * @returns {Promise<Array<Array<Object>>>} - Resultados procesados por lienzo, cada uno con:
 * - `id`: Identificador del rectángulo.
 * - `originalText`: Texto original detectado por el endpoint.
 * - `reorderedText`: Texto reordenado según orientación o "same" si no cambió.
 * - `predictedOrientation`: Orientación detectada (ej. "horizontal-left-to-right").
 * - `top`, `left`, `width`, `height`: Coordenadas y dimensiones del rectángulo.
 * - `centerTop`: Coordenada y del centro del rectángulo.
 * - `centerLeft`: Coordenada x del centro del rectángulo.
 * @throws {Error} - Si ocurre un error durante el procesamiento.
 */
const cleanImages = async (
  rectangles,
  images,
  onProgress = () => { },
  selectedLanguage,
  onDownloadProgress = () => { },
  setIsLoading
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

    const ocrService = new OcrService(
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
      }
    );

    const tesseractResultsFlat = await ocrService.callOcrEndpoint(
      recorteGroups
    );

    const downscaledResults = processOCRResults(tesseractResultsFlat, recorteMapping, ocrImages, GROUP_SIZE);

    const orientations = detectTextOrientation(downscaledResults, selectedLanguage);
    const reorderedResults = reorderTextByOrientation(downscaledResults, orientations);

    const results = reorderedResults.map((canvasResults, canvasIndex) => {
      return canvasResults.map((result, resultIndex) => {
        const { id, originalText, reorderedText } = result;
        const { top, left, width, height } = filteredData.filteredRectangles[canvasIndex][resultIndex].coords;
        const color = filteredData.filteredRectangles[canvasIndex][resultIndex].color;
        return {
          id,
          color,
          originalText,
          reorderedText: originalText === reorderedText ? "same" : reorderedText.replace(/\n/g, ""),
          predictedOrientation: orientations[canvasIndex][resultIndex].orientation,
          top,
          left,
          width,
          height,
          centerTop: top + height / 2,
          centerLeft: left + width / 2,
          canvasIndex: canvasIndex,
        };
      });
    });

    if (!results) {
      console.error("Hubo un problema detectando los textos");
      setIsLoading(false);
      return;
    }
    return results;
  } catch (error) {
    console.error("Error en cleanImages:", error);
    if (setIsLoading) {
      setIsLoading(false);
    }
    throw error;
  }
};

export default cleanImages;