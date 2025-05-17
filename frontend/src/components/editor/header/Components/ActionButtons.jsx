import React, { useState } from 'react';
import { LayoutDashboard, FileArchive, Save, ChevronDown, Upload } from 'lucide-react';

export default function ActionButtons({ navigate, handleExport, handleSaveLocal, setShowLoadModal }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveWithLoading = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay for loading animation
    handleSaveLocal();
    setIsSaving(false);
  };

  return (
    <div className="flex items-center space-x-4 ml-auto">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 rounded-md transition-colors duration-200"
      >
        <LayoutDashboard className="w-5 h-5 text-white" />
        <span className="text-white font-medium">Dashboard</span>
      </button>

      <button
        onClick={handleExport}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-md border border-gray-500 transition-colors duration-200"
      >
        <FileArchive className="w-5 h-5 text-white" />
        <span className="text-white font-medium">Exportar</span>
      </button>

      <div className="flex items-center">
        <button
          onClick={handleSaveWithLoading}
          disabled={isSaving}
          className={`flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-l-md border border-gray-500 transition-colors duration-200 h-[40px] ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Save className={`w-5 h-5 text-white ${isSaving ? 'animate-spin' : ''}`} />
          <span className="text-white font-medium">{isSaving ? 'Guardando...' : 'Guardar'}</span>
        </button>

        <div className="relative h-[40px]">
          <div className="absolute left-0 top-1/2 h-5 w-px bg-gray-500 -translate-y-1/2"></div>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="h-full px-2 bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-r-md border border-l-0 border-gray-500 transition-colors duration-200 flex items-center justify-center"
            aria-label="Mostrar opciones"
          >
            <ChevronDown className="w-4 h-4 text-white" />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 mt-1 w-40 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-[1000]"
              onMouseLeave={() => setShowMenu(false)}
            >
              <button
                onClick={() => {
                  setShowLoadModal(true);
                  setShowMenu(false);
                }}
                className="flex items-center space-x-2 w-full px-4 py-2 text-white hover:bg-gray-700 rounded-md transition-colors duration-200"
              >
                <Upload className="w-5 h-5 text-gray-300" />
                <span className="text-gray-300">Cargar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}