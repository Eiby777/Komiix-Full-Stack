import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

export default function LoadModal({ showLoadModal, setShowLoadModal, handleLoad }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleLoad(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleLoad(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  if (!showLoadModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[600]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowLoadModal(false)} />
      <div className="relative bg-[#262626] border border-white/10 rounded-2xl shadow-2xl w-[400px] p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">CARGAR DATOS</h2>
          <button onClick={() => setShowLoadModal(false)} className="text-white hover:text-red-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-500'}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="w-8 h-8 text-white/75 mx-auto mb-2" />
          <p className="text-sm text-white/75 mb-2">
            Arrastra y suelta un archivo aquí o
          </p>
          <label className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition duration-200 cursor-pointer">
            Seleccionar archivo
            <input
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}