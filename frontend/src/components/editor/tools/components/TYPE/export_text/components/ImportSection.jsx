import React, { useRef } from 'react';
import { createImportFileHandler } from '../handlers/importHandlers.js';

const ImportSection = ({
  importText,
  setImportText,
  isDragOver,
  onImportText,
  onSwitchToExport,
  updateTextsFromJson,
  onSuccess
}) => {
  const fileInputRef = useRef(null);

  const handleFileImport = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await createImportFileHandler(file, updateTextsFromJson, onSuccess)();
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-white/75 text-sm text-center">
        Importa los textos traducidos desde tu LLM o un archivo JSON
      </p>

      <div className="space-y-3">
        <label className="block text-white/90 font-medium text-sm">Pegar resultado del LLM:</label>
        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder="Pega aquí el JSON traducido que obtuviste de tu LLM..."
          className="w-full h-32 p-3 bg-gray-800 border border-gray-600 rounded-md text-white/90 text-sm font-mono resize-none focus:border-[#4a90e2] focus:outline-none"
        />
        <button
          onClick={onImportText}
          className="w-full px-4 py-2 bg-[#4a90e2] text-white/90 rounded-md hover:bg-[#357abd] transition-colors duration-200"
        >
          Importar desde Texto
        </button>
      </div>

      <div className="text-center text-white/50 text-sm">— o —</div>

      <div
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
          isDragOver
            ? 'border-[#4a90e2] bg-[#4a90e2]/10'
            : 'border-gray-500 hover:border-[#4a90e2]'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".json"
          onChange={handleFileImport}
        />
        <svg className="w-8 h-8 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
        <p className="text-white/75 mb-2 text-sm">Cargar archivo JSON</p>
        <p className="text-gray-500 text-xs mb-2">Arrastre y suelte aquí</p>
        <p className="text-gray-500 text-xs mb-2">o</p>
        <button className="px-4 py-2 bg-[#4a90e2] text-white/90 rounded-md hover:bg-[#357abd] transition-colors duration-200 text-sm">
          Seleccionar archivo
        </button>
        <p className="text-gray-500 text-xs mt-2">Formato soportado: JSON</p>
      </div>

      <button
        onClick={onSwitchToExport}
        className="block w-full text-[#4a90e2] hover:text-[#357abd] text-sm text-center"
      >
        ← Volver a exportar
      </button>
    </div>
  );
};

export default ImportSection;
