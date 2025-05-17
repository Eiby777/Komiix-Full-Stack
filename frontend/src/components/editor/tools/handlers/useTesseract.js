import Tesseract from "tesseract.js";

/**
 * Determina parámetros de procesamiento según la cantidad de recortes
 * @returns {{ maxWorkers: number, batchSize: number }} - Configuración dinámica
 */
const getDynamicConfig = () => {
  const { cores } = navigator.hardwareConcurrency || { cores: 2 };

  const maxWorkers = cores > 2 ? 2 : 1;
  const batchSize = cores > 2 ? 2 : 1;

  return { maxWorkers, batchSize };
};

/**
 * Procesa un lote de imágenes con Tesseract.js usando workers paralelos
 * @async
 * @function processBatch
 * @param {Array<Object>} images - Array de recortes con propiedad image
 * @param {string} language - Idioma para el reconocimiento
 * @param {function} logger - Función para registrar progreso
 * @param {function} onDownloadProgress - Callback para eventos de descarga
 * @param {number} batchSize - Tamaño del lote
 * @param {number} maxWorkers - Número máximo de workers paralelos
 * @returns {Promise<Array<Object>>} - Array de resultados de reconocimiento
 */
const processBatch = async (images, language, logger, onDownloadProgress, batchSize, maxWorkers) => {
  const results = [];

  for (let i = 0; i < images.length; i += batchSize) {
    const batch = images.slice(i, i + batchSize);

    const batchResults = await Promise.all(
      batch.map(async (recorte, index) => {
        let worker;
        try {
          const workerOptions = {
            logger: (m) => {
              logger(m);
              if (m.status === "loading language traineddata" || m.status === "downloading") {
                onDownloadProgress(true);
              } else if (m.status === "loaded language traineddata" || m.status === "initialized") {
                onDownloadProgress(false);
              }
            },
            maxWorkers: maxWorkers
          };

          worker = await Tesseract.createWorker(workerOptions);
          await worker.loadLanguage(language);
          await worker.initialize(language);

          const { data } = await worker.recognize(recorte.image);
          await worker.terminate();

          return {
            id: recorte.id,
            text: data.text || "",
            confidence: data.confidence || 0,
            boundingBoxes: (data.words || []).map((word) => ({
              text: word.text,
              confidence: word.confidence,
              bbox: { x0: word.bbox.x0, y0: word.bbox.y0, x1: word.bbox.x1, y1: word.bbox.y1 },
            })),
            coords: recorte.coords,
            color: recorte.color,
          };
        } catch (error) {
          console.error(`[Batch ${i}] Error procesando recorte ${index}:`, error);
          if (worker) await worker.terminate();
          return {
            id: recorte.id,
            text: "",
            confidence: 0,
            boundingBoxes: [],
            coords: recorte.coords,
            color: recorte.color,
          };
        }
      })
    );

    results.push(...batchResults);
    batchResults.fill(null);
  }

  return results;
};

/**
 * Procesa grupos de recortes con Tesseract.js de forma optimizada
 * @async
 * @function processWithTesseract
 * @param {Array<Array<Object>>} recorteGroups - Array de grupos de recortes
 * @param {string} language - Idioma para reconocimiento (default: 'eng+jpn')
 * @param {function} onProgress - Callback para eventos de progreso
 * @param {function} onDownloadProgress - Callback para progreso de descarga
 * @returns {Promise<Array<Array<Object>>>} - Array de grupos con resultados estructurados
 * @throws {Error} - Si ocurre un error en el procesamiento general
 */
const processWithTesseract = async (recorteGroups, language, onProgress, onDownloadProgress) => {
  const { maxWorkers, batchSize } = getDynamicConfig();
  const LANGUAGE = language || "eng+jpn";

  const logger = (m) => {
    if (onProgress) onProgress(m);
  };

  try {
    const results = [];

    for (const [groupIndex, group] of recorteGroups.entries()) {
      const batchResults = await processBatch(group, LANGUAGE, logger, onDownloadProgress, batchSize, maxWorkers);
      results.push(batchResults);
    }

    return results;
  } catch (error) {
    console.error("Error general en processWithTesseract:", error);
    throw error;
  } finally {
    if (typeof window !== "undefined" && window.gc) {
      window.gc();
    }
  }
};

export default processWithTesseract;
