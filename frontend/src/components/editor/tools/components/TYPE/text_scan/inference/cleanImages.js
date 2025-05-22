import processWithTesseract from "../../../../handlers/useTesseract";
import { filterRectangles } from "./filterRectangles";
import { croppImages } from "./croppImages";
import detectTextOrientation from "./detectTextOrientation";
import reorderTextByOrientation from "./reorderTextByOrientation";
import { upscaleCroppedImages } from "./scalingImages";
import { supabase } from "../../../../../../../lib/supabaseClient";
/**
 * Procesa imágenes recortadas para detectar y reordenar texto utilizando Tesseract.js.
 * Filtra rectángulos, recorta imágenes, escala las imágenes, realiza OCR, detecta la orientación del texto
 * y reordena el texto según la orientación detectada.
 *
 * @async
 * @function cleanImages
 * @param {Array<Array<Object>>} rectangles - Arreglo de rectángulos por lienzo, cada uno con coordenadas y otros datos.
 * @param {Array<string>} images - Arreglo de imágenes en formato base64 o URLs para procesar.
 * @param {function} [onProgress] - Callback opcional para reportar progreso. Recibe `(completedCanvases, validCanvases)`.
 * @param {string} selectedLanguage - Código del idioma seleccionado para OCR (ej. "eng", "spa", "jpn", "chi_sim", "kor").
 * @param {function} [onDownloadProgress] - Callback opcional para reportar progreso de descarga de Tesseract.
 * @returns {Promise<Array<Array<Object>>>} - Resultados procesados por lienzo, cada uno con:
 *  - `id`: Identificador del rectángulo.
 *  - `originalText`: Texto original detectado por Tesseract.
 *  - `reorderedText`: Texto reordenado según orientación o "same" si no cambió.
 *  - `predictedOrientation`: Orientación detectada (ej. "horizontal-left-to-right").
 *  - `top`, `left`, `width`, `height`: Coordenadas y dimensiones del rectángulo.
 *  - `centerTop`: Coordenada y del centro del rectángulo.
 *  - `centerLeft`: Coordenada x del centro del rectángulo.
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
    const { scaledImages, scaleFactors } = upscaleCroppedImages(croppedImages);

    const counts = filteredData.counts;
    const totalRecortes = counts.reduce((sum, count) => sum + count, 0);
    const validCanvases = counts.reduce((sum, count) => sum + (count > 0 ? 1 : 0), 0);
    let processedRectangles = 0;

    const LANGUAGE = selectedLanguage;

    const GROUP_SIZE = 2;
    const recorteGroups = [];
    const recorteMapping = [];
    let flatRecortes = [];

    scaledImages.forEach((canvasCrops, canvasIndex) => {
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

    const tesseractResults = Array(scaledImages.length).fill().map(() => []);
    const downscaledResults = Array(scaledImages.length).fill().map(() => []);
    tesseractResultsFlat.forEach((group, groupIndex) => {
      group.forEach((result, resultIndex) => {
        const flatIndex = groupIndex * GROUP_SIZE + resultIndex;
        const { canvasIndex, cropIndex } = recorteMapping[flatIndex] || {};
        if (canvasIndex !== undefined && cropIndex !== undefined) {
          tesseractResults[canvasIndex][cropIndex] = result;
          downscaledResults[canvasIndex][cropIndex] = {
            ...result
          };
        }
      });
    });

    const orientations = detectTextOrientation(downscaledResults, LANGUAGE);
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
        };
      });
    });

    if (!results) {
      console.error("Hubo un problema detectando los textos");
      setIsLoading(false);
      return;
    }
    return results
  } catch (error) {
    console.error("Error en cleanImages:", error);
    throw error;
  }
};

export default cleanImages;