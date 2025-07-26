import { useState } from "react";
import { X } from "lucide-react";
import { TOOLS } from "../../../../../../../constants/tools";

const LoadingOverlay = ({
  setShowWarning,
  toggleTool,
  scanImages,
  isLoadingModules = false,
  moduleError = null
}) => {
  const [scanOption, setScanOption] = useState("all");

  const handleAccept = () => {
    setShowWarning(false);
    scanImages(scanOption);
  };

  const handleCancel = () => {
    setShowWarning(false);
    toggleTool(TOOLS.SCAN.id);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[600]">
      <div className="absolute inset-0 bg-black/50 transition-opacity duration-300 ease-in-out opacity-100" />
      <div className="relative bg-[#1a1a1a] border border-white/20 rounded-md shadow-lg p-6 w-[400px] transition-all duration-300 ease-in-out opacity-100 scale-100">
        <h3 className="text-lg font-semibold text-white/90 mb-4">Herramienta de Escaneo</h3>
        
        {/* Estado de los módulos */}
        {moduleError ? (
          <div className="mb-4">
            <div className="flex items-center text-red-400 mb-2">
              <span className="mr-2">❌</span>
              <span className="text-sm">Error cargando módulos de detección</span>
            </div>
            <div className="text-xs text-white/60 bg-red-900/20 p-2 rounded border border-red-500/20">
              {moduleError}
            </div>
          </div>
        ) : isLoadingModules ? (
          <div className="mb-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#4a90e2]"></div>
              <span className="text-[#4a90e2] text-sm">Cargando módulos de IA...</span>
            </div>
            <div className="text-xs text-white/60 text-center">
              Esto puede tomar unos segundos la primera vez
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <div className="flex items-center text-green-400 mb-2">
              <span className="mr-2">✅</span>
              <span className="text-sm">Módulos listos</span>
            </div>
            <p className="text-white/75 text-sm mb-4">
              ¿Estás seguro de que deseas escanear las imágenes? Este proceso detectará objetos y texto automáticamente.
            </p>
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="scanOption" className="text-white/75 text-sm block mb-2">
            Seleccionar imágenes a escanear:
          </label>
          <select
            id="scanOption"
            value={scanOption}
            onChange={(e) => setScanOption(e.target.value)}
            disabled={isLoadingModules || moduleError}
            className="w-full bg-[#2a2a2a] text-white/90 border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="all">Todas las imágenes</option>
            <option value="current">Imagen actual</option>
          </select>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-600/50 text-white/90 rounded-md hover:bg-gray-700/50 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleAccept}
            disabled={isLoadingModules || moduleError}
            className="px-4 py-2 bg-[#4a90e2] text-white/90 rounded-md hover:bg-[#357abd] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#4a90e2]"
          >
            {isLoadingModules ? 'Cargando...' : 'Aceptar'}
          </button>
        </div>

        {moduleError && (
          <div className="mt-4 text-xs text-white/50 text-center">
            Puedes intentar recargar la página o contactar soporte
          </div>
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

export default LoadingOverlay;