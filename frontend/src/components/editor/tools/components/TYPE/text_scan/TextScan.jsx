/**
 * Componente para escanear y procesar texto en imágenes del editor
 * @module TextScan
 */
import { useEffect, useState, useMemo } from "react";
import { useEditorStore } from "../../../../../../stores/editorStore";
import { X } from "lucide-react";
import LanguageSelector from "./components/LanguageSelector";
import { handleUpdateObjectsStatus } from "./handlers/handlers";
import ProgressBar from "./components/ProgressBar";
import Buttons from "./components/Buttons/Button"

const TextScan = () => {
  const { canvasInstances, setCanvasObjectStatus, resetActiveTools, dimensionImages, images, colorToTypeTextMap, isDownloadingModels, setIsDownloadingModels, activeImageIndex } = useEditorStore();
  const [showWarning, setShowWarning] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hideLoading, setHideLoading] = useState(false);
  const [progress, setProgress] = useState({
    canvasProgress: { current: 0, total: 0 },
    recorteProgress: { current: 0, total: 0 },
  });
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [languageError, setLanguageError] = useState(false);
  const [selectedTargetLanguage, setSelectedTargetLanguage] = useState("");
  const [targetLanguageError, setTargetLanguageError] = useState(false);
  const [scanOption, setScanOption] = useState("all");

  useEffect(() => {
    if (
      isLoading &&
      progress.recorteProgress.current === progress.recorteProgress.total &&
      progress.recorteProgress.total > 0
    ) {
      const timer = setTimeout(() => {
        setHideLoading(true);
        setIsLoading(false);
        resetActiveTools();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, progress.recorteProgress.current, progress.recorteProgress.total]);

  const progressPercentage = useMemo(() => {
    return progress.recorteProgress.total > 0
      ? (progress.recorteProgress.current / progress.recorteProgress.total) * 100
      : 0;
  }, [progress.recorteProgress.current, progress.recorteProgress.total]);

  useEffect(() => {
    return () => {
      handleUpdateObjectsStatus(canvasInstances, setCanvasObjectStatus);
    };
  }, [canvasInstances, setCanvasObjectStatus]);

  const handleCancel = () => {
    setShowWarning(false);
    setHideLoading(true);
    resetActiveTools();
  };

  if (hideLoading) return null;

  return (
    <div
      className={`z-[600] fixed inset-0 flex items-center justify-center ${showWarning || isDownloadingModels || isLoading ? "" : "hidden"}`}
    >
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ease-in-out ${showWarning || isDownloadingModels || isLoading ? "opacity-100" : "opacity-0"}`}
      />
      <div
        className={`relative bg-[#1a1a1a] border border-white/20 rounded-md shadow-lg p-6 w-[400px] transition-all duration-300 ease-in-out ${showWarning || isDownloadingModels || isLoading ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        {showWarning && !isLoading && !isDownloadingModels && (
          <>
            <h3 className="text-lg font-semibold text-white/90 mb-4">Confirmar escaneo de texto</h3>
            <p className="text-white/75 text-sm mb-6">
              ¿Estás seguro de que deseas escanear el texto en las imágenes? Este proceso detectará y traducirá el texto automáticamente.
            </p>
            <div className="mb-6">
              <label htmlFor="scan-option-select" className="text-white/75 text-sm block mb-2">
                Selecciona las imágenes a escanear:
              </label>
              <select
                id="scan-option-select"
                value={scanOption}
                onChange={(e) => setScanOption(e.target.value)}
                className="w-full p-2 bg-transparent text-white rounded-md border border-gray-700 focus:outline-none focus:border-[#4a90e2]"
              >
                <option value="all">Todas las imágenes</option>
                <option value="current">Imagen actual</option>
              </select>
            </div>
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              languageError={languageError}
              setLanguageError={setLanguageError}
              selectedTargetLanguage={selectedTargetLanguage}
              setSelectedTargetLanguage={setSelectedTargetLanguage}
              targetLanguageError={targetLanguageError}
              setTargetLanguageError={setTargetLanguageError}
            />
            <Buttons
              selectedLanguage={selectedLanguage}
              selectedTargetLanguage={selectedTargetLanguage}
              setLanguageError={setLanguageError}
              setTargetLanguageError={setTargetLanguageError}
              setShowWarning={setShowWarning}
              setIsLoading={setIsLoading}
              setIsDownloadingModels={setIsDownloadingModels}
              canvasInstances={canvasInstances}
              images={images}
              dimensionImages={dimensionImages}
              setProgress={setProgress}
              colorToTypeTextMap={colorToTypeTextMap}
              handleCancel={handleCancel}
              scanOption={scanOption}
              activeImageIndex={activeImageIndex}
            />
          </>
        )}
        {isLoading && !showWarning && (
          <ProgressBar progress={progress} progressPercentage={progressPercentage} />
        )}
        <button
          onClick={handleCancel}
          className="absolute top-2 right-2 p-1 rounded-md hover:bg-gray-700/50 transition-colors duration-200"
          title="Cerrar"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};

export default TextScan;