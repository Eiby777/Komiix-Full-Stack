import React, { useEffect, useState, useMemo } from 'react';
import ReactDOM from 'react-dom';

const LoadingRedraw = ({ progress = {}, noMasksFound = false, onClose }) => {
  const [container, setContainer] = useState(null);
  const [statusMessage, setStatusMessage] = useState(
    progress.initialized ? "Realizando inferencia..." : 
    progress.preprocessing ? "Preparando imágenes..." : "Inicializando modelo..."
  );


  useEffect(() => {
    const el = document.createElement('div');
    el.className = 'loading-overlay-container';
    document.body.appendChild(el);
    setContainer(el);
    return () => {
      if (document.body.contains(el)) document.body.removeChild(el);
    };
  }, []);

  useEffect(() => {
    if (progress.preprocessing) {
      setStatusMessage("Preparando imágenes...");
    } else if (progress.initialized) {
      setStatusMessage("Realizando inferencia...");
    } else {
      setStatusMessage("Inicializando modelo...");
    }
  }, [progress.preprocessing, progress.initialized]);

  const calculateProgress = () => {
    if (noMasksFound) {
      return {
        message: "No se encontraron máscaras para redibujar",
        percentage: 0,
        completedFiles: 0,
        totalFiles: 0,
      };
    }

    const totalFiles = progress.totalImages || 0;
    const completedFiles = progress.completedImages || 0;
    let percentage = 0;
    let message = "Iniciando...";

    if (progress.preprocessing) {
      message = "Preparando imágenes...";
      percentage = Math.round((progress.completedPreprocessing / progress.totalPreprocessing) * 100) || 0;
    } else if (!progress.initialized) {
      message = "Inicializando modelo...";
    } else {
      message = "Realizando inferencia...";
      percentage = totalFiles > 0 ? Math.round((completedFiles / totalFiles) * 100) : 0;
    }

    return {
      message,
      percentage,
      completedFiles,
      totalFiles
    };
  
  };

  const { message, percentage, completedFiles, totalFiles } = useMemo(() => calculateProgress(), [progress, noMasksFound]);

  if (!container) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[9999]">
      <div className="flex flex-col items-center space-y-4 bg-[#2a2a2a] p-6 rounded-md shadow-lg border border-gray-700/50 w-80">
        {!noMasksFound ? (
          <>
            <div className="w-12 h-12 border-4 border-gray-700/50 border-t-white rounded-full animate-spin" />
            <p className="text-white text-lg text-center">{message}</p>
            <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${percentage}%`, minWidth: '0%' }}
              />
            </div>
            <p className="text-white text-sm text-center">
              {totalFiles > 0
                ? `Progreso: ${percentage}% (${completedFiles}/${totalFiles} imágenes)`
                : 'Iniciando modelo...'}
            </p>
          </>
        ) : (
          <>
            <p className="text-white text-lg text-center">{message}</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
            >
              Cerrar
            </button>
          </>
        )}
      </div>
    </div>,
    container
  );
};

export default LoadingRedraw;
