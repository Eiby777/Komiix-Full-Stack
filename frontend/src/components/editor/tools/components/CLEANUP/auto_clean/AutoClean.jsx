import React, { useState, useEffect, useRef } from "react";
import { useEditorStore } from "../../../../../../stores/editorStore";
import { X } from "lucide-react";
import cleanImages from "./inference/cleanImages";
import WarningModal from "./components/WarningModal";
import ProgressBar from "./components/ProgressBar";
import LoadingModal from "./components/LoadingModal";
import { getImages, getRectangles, addCleanedObjects, nonSolidBackgroundRects } from "./components/clean_handlers";
import useLayerHistory from "../../../../floating-menus/components/UndoRedoMenu/handlers/fabricHistoryManager";

const AutoClean = () => {
  const { canvasInstances, MASK, getCanvasInstance, setCanvasObjectStatus, resetActiveTools, activeImageIndex } = useEditorStore();
  const [showWarning, setShowWarning] = useState(true);
  const [isDownloadingModels, setIsDownloadingModels] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hideLoading, setHideLoading] = useState(false);
  const [progress, setProgress] = useState({
    canvasProgress: { current: 0, total: 0 },
    recortePercentage: 0,
  });
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [languageError, setLanguageError] = useState(false);
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);
  const downloadCompletedRef = useRef(false);
  const [selectAllImages, setSelectAllImages] = useState(true);
  const { saveState } = useLayerHistory();

  useEffect(() => {
    if (isLoading && isProcessingComplete && progress.canvasProgress.current >= progress.canvasProgress.total && progress.canvasProgress.total > 0) {
      setHideLoading(true);
      setIsLoading(false);
      resetActiveTools();
    }
  }, [isLoading, progress, isProcessingComplete, resetActiveTools]);

  const handleUpdateObjectsStatus = () => {
    Object.keys(canvasInstances).forEach((index) => {
      const canvas = getCanvasInstance(parseInt(index));
      if (canvas) {
        const rects = canvas.getObjects();
        setCanvasObjectStatus(parseInt(index), rects.length > 0);
      }
    });
  };

  const updateProgress = ({ canvasProgress, recorteProgress }) => {
    setProgress({
      canvasProgress, // { current, total } para lienzos
      recortePercentage: Math.min(Math.round((recorteProgress.current / recorteProgress.total) * 100), 100), // Porcentaje de recortes
    });
  };

  const updateDownloadingStatus = (isDownloading) => {
    if (!downloadCompletedRef.current) {
      if (isDownloading) {
        setIsDownloadingModels((prev) => {
          if (!prev) {
            return true;
          }
          return prev;
        });
      } else {
        setIsDownloadingModels((prev) => {
          if (prev) {
            downloadCompletedRef.current = true;
            return false;
          }
          return prev;
        });
      }
    }

  };

  const handleAccept = async () => {
    if (!selectedLanguage) {
      setLanguageError(true);
      return;
    }

    setLanguageError(false);
    setShowWarning(false);
    setIsLoading(true);

    try {
      const selectedCanvasInstances = selectAllImages ? canvasInstances : [canvasInstances[activeImageIndex]];
      const images = await getImages(selectedCanvasInstances);
      if (!images) {
        console.warn("Las imágenes no fueron guardadas");
        setIsLoading(false);
        return;
      }

      const rectangles = await getRectangles(selectedCanvasInstances, images);
      if (!rectangles) {
        console.warn("Hubo un problema recalculando las coordenadas de las imágenes");
        setIsLoading(false);
        return;
      }

      const result = await cleanImages(
        rectangles,
        images,
        updateProgress,
        selectedLanguage,
        updateDownloadingStatus
      );

      console.log("Result: ", result);

      if (!result) {
        console.warn("Hubo un problema limpiando las imágenes");
        setIsLoading(false);
        return;
      }

      await addCleanedObjects(result, selectedCanvasInstances, saveState);
      await nonSolidBackgroundRects(result, selectedCanvasInstances, MASK, saveState);

      setIsProcessingComplete(true);
      setIsLoading(false);
      handleUpdateObjectsStatus();
    } catch (error) {
      console.error("Error en handleAccept:", error);
      setIsLoading(false);
      setIsDownloadingModels(false);
    }
  };

  const handleCancel = () => {
    setShowWarning(false);
    setHideLoading(true);
    resetActiveTools();
  };

  if (hideLoading) {
    return null;
  }

  const progressPercentage = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

  return (
    <div
      className={`z-[600] fixed inset-0 flex items-center justify-center ${showWarning || isDownloadingModels || isLoading ? "" : "hidden"
        }`}
    >
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ease-in-out ${showWarning || isDownloadingModels || isLoading ? "opacity-100" : "opacity-0"
          }`}
      />
      <div
        className={`relative bg-[#1a1a1a] border border-white/20 rounded-md shadow-lg p-6 w-[400px] transition-all duration-300 ease-in-out ${showWarning || isDownloadingModels || isLoading ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
      >
        {showWarning && (
          <WarningModal
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            selectAllImages={selectAllImages}
            setSelectAllImages={setSelectAllImages}
            languageError={languageError}
            setLanguageError={setLanguageError}
            onAccept={handleAccept}
            onCancel={handleCancel}
          />
        )}
        {isDownloadingModels && !showWarning && (
          <LoadingModal
            title="Descargando modelos..."
            message="Preparando Tesseract para el idioma seleccionado. Esto puede tomar un momento..."
          />
        )}
        {isLoading && !showWarning && !isDownloadingModels && (
          <ProgressBar
            canvasProgress={progress.canvasProgress}
            percentage={progress.recortePercentage}
          />
        )}
        <button
          onClick={() => setHideLoading(true)}
          className="absolute top-2 right-2 p-1 rounded-md hover:bg-gray-700/50 transition-colors duration-200"
          title="Cerrar"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};

export default AutoClean;
