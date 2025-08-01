import getImages from "../../../../../handlers/getImages";
import { getRectangles } from "../../handlers/handlers";
import cleanImages from "../../inference/cleanImages";
import translateText from "../../handlers/translateTexts";
import adjustTexts from "../../handlers/adjustTexts";
import createTextBoxes from "../../handlers/createTextBoxes";
import useLayerHistory from "../../../../../../floating-menus/components/UndoRedoMenu/handlers/fabricHistoryManager";

const Buttons = ({
  originalOCRLanguage,
  selectedOCRTargetLanguage,
  originalTranslationLanguage,
  selectedTranslationLanguage,
  setOCRLanguageError,
  setOCRTargetLanguageError,
  setShowWarning,
  setIsLoading,
  setIsDownloadingModels,
  canvasInstances,
  images,
  dimensionImages,
  setProgress,
  colorToTypeTextMap,
  handleCancel,
  scanOption,
  activeImageIndex
}) => {
  const { saveState } = useLayerHistory();
  const updateDownloadingStatus = (isDownloading) => {
    setIsDownloadingModels(isDownloading);
  };

  const handleAccept = async () => {
    let hasError = false;
    if (!originalOCRLanguage) {
      setOCRLanguageError(true);
      hasError = true;
    }
    if (!selectedOCRTargetLanguage) {
      setOCRTargetLanguageError(true);
      hasError = true;
    }
    if (hasError) return;

    setShowWarning(false);
    setIsLoading(true);

    try {
      // Fase 1: Scanning
      setProgress(prev => ({ ...prev, phase: 'scanning' }));

      // Fetch images based on scanOption
      let targetCanvasInstances = canvasInstances;
      if (scanOption === "current") {
        targetCanvasInstances = [canvasInstances[activeImageIndex]];
      }

      const fetchedImages = await getImages(targetCanvasInstances, setIsLoading);
      const fetchedRectangles = await getRectangles(targetCanvasInstances, fetchedImages, setIsLoading);

      const result = await cleanImages(
        fetchedRectangles,
        fetchedImages,
        (progressData) => setProgress(prev => ({ ...prev, ...progressData })),
        originalOCRLanguage,
        updateDownloadingStatus,
        setIsLoading
      );

      // Fase 2: Translation
      setProgress(prev => ({ ...prev, phase: 'translating' }));

      let translatedResult = await translateText(result, originalTranslationLanguage, selectedTranslationLanguage, setIsLoading);

      if (scanOption === "current" && translatedResult.length === 1) {
        const reindexedResult = new Array(images.length).fill(null);
        reindexedResult[activeImageIndex] = translatedResult[0];
        translatedResult = reindexedResult;
      }

      // Fase 3: Creating text boxes
      setProgress(prev => ({ ...prev, phase: 'creating' }));

      const adjustedResults = await adjustTexts(targetCanvasInstances, translatedResult, images, dimensionImages, setIsLoading, activeImageIndex);
      createTextBoxes(adjustedResults, targetCanvasInstances, colorToTypeTextMap, saveState);

    } catch (error) {
      console.error("Error durante el escaneo de texto:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-end gap-4">
      <button
        onClick={handleCancel}
        className="px-4 py-2 bg-gray-600/50 text-white/90 rounded-md hover:bg-gray-700/50 transition-colors duration-200"
      >
        Cancelar
      </button>
      <button
        onClick={handleAccept}
        className={`px-4 py-2 text-white/90 rounded-md transition-colors duration-200 ${originalOCRLanguage && selectedOCRTargetLanguage
            ? "bg-[#4a90e2] hover:bg-[#357abd]"
            : "bg-gray-600/50 cursor-not-allowed"
          }`}
        disabled={!originalOCRLanguage || !selectedOCRTargetLanguage}
      >
        Aceptar
      </button>
    </div>
  );
};

export default Buttons;