import React from 'react';
import { copyToClipboard } from '../handlers/utils.js';

const PromptModal = ({ exportData, onClose, onBack }) => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-[#1a1a1a] border border-white/20 rounded-md shadow-lg p-6 w-[800px] max-h-[80vh] overflow-y-auto relative">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white/90 mb-2 text-center">
            Prompt para Traducción
          </h3>
          {exportData.wasDownloaded && (
            <p className="text-green-400 text-sm text-center">
              ✓ Archivo JSON descargado. Usa este prompt en tu LLM con el archivo descargado.
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-white/90 font-medium">Prompt:</label>
              <button
                onClick={() => copyToClipboard(exportData.prompt)}
                className="px-3 py-1 bg-[#4a90e2] text-white/90 rounded-md hover:bg-[#357abd] transition-colors duration-200 text-sm"
              >
                Copiar Prompt
              </button>
            </div>
            <textarea
              value={exportData.prompt}
              readOnly
              className="w-full h-32 p-3 bg-gray-800 border border-gray-600 rounded-md text-white/90 text-sm font-mono resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-white/90 font-medium">JSON:</label>
              <button
                onClick={() => copyToClipboard(exportData.json)}
                className="px-3 py-1 bg-[#4a90e2] text-white/90 rounded-md hover:bg-[#357abd] transition-colors duration-200 text-sm"
              >
                Copiar JSON
              </button>
            </div>
            <textarea
              value={exportData.json}
              readOnly
              className="w-full h-48 p-3 bg-gray-800 border border-gray-600 rounded-md text-white/90 text-sm font-mono resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-600/50 text-white/90 rounded-md hover:bg-gray-700/50 transition-colors duration-200"
          >
            Volver
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#4a90e2] text-white/90 rounded-md hover:bg-[#357abd] transition-colors duration-200"
          >
            Cerrar
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-md hover:bg-gray-700/50 transition-colors duration-200"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PromptModal;
