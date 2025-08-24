import React from 'react';

const ExportSection = ({
  exportFormat,
  setExportFormat,
  onExport,
  onSwitchToImport
}) => {
  return (
    <div className="space-y-4">
      <p className="text-white/75 text-sm text-center">
        ¿Desea exportar todos los textos de los canvases para usarlos en una traducción externa?
      </p>

      <div className="space-y-3">
        <label className="block text-white/90 font-medium text-sm">Formato de exportación:</label>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="exportFormat"
              value="copy"
              checked={exportFormat === 'copy'}
              onChange={(e) => setExportFormat(e.target.value)}
              className="text-[#4a90e2] focus:ring-[#4a90e2]"
            />
            <span className="text-white/75 text-sm">Texto para copiar (con prompt separado)</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="exportFormat"
              value="download"
              checked={exportFormat === 'download'}
              onChange={(e) => setExportFormat(e.target.value)}
              className="text-[#4a90e2] focus:ring-[#4a90e2]"
            />
            <span className="text-white/75 text-sm">Archivo JSON descargable</span>
          </label>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => {/* Close modal */}}
          className="px-4 py-2 bg-gray-600/50 text-white/90 rounded-md hover:bg-gray-700/50 transition-colors duration-200"
        >
          Cancelar
        </button>
        <button
          onClick={onExport}
          className="px-4 py-2 bg-[#4a90e2] text-white/90 rounded-md hover:bg-[#357abd] transition-colors duration-200"
        >
          {exportFormat === 'copy' ? 'Mostrar para Copiar' : 'Descargar JSON'}
        </button>
      </div>

      <button
        onClick={onSwitchToImport}
        className="block w-full text-[#4a90e2] hover:text-[#357abd] text-sm text-center"
      >
        ¿Desea importar textos?
      </button>
    </div>
  );
};

export default ExportSection;
