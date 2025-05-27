import React, { useState } from 'react';
import { LayoutDashboard, FileArchive, Save, ChevronDown, Upload } from 'lucide-react';

export default function ActionButtons({ navigate, handleExport, handleSaveLocal, setShowLoadModal, headerHeight }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Calculate scaling factor based on headerHeight relative to 75px, with a minimum scale of 0.7
  const referenceHeight = 75;
  const scale = Math.max(parseInt(headerHeight) / referenceHeight, 0.7);

  // Base sizes when headerHeight is 75px
  const baseButtonHeight = 2.5; // rem (40px at default font size)
  const baseButtonPaddingX = 1; // rem (16px)
  const baseButtonPaddingY = 0.5; // rem (8px)
  const baseIconSize = 1.25; // rem (20px for most icons)
  const baseChevronSize = 1; // rem (16px for ChevronDown)
  const baseFontSize = 0.875; // rem (14px)
  const baseMenuWidth = 10; // rem (160px)
  const baseDividerHeight = 1.25; // rem (20px)
  const baseDividerWidth = 0.0625; // rem (1px)
  const baseMenuMarginTop = 0.25; // rem (4px)

  // Scaled sizes
  const buttonHeight = `${baseButtonHeight * scale}rem`;
  const buttonPaddingX = `${baseButtonPaddingX * scale}rem`;
  const buttonPaddingY = `${baseButtonPaddingY * scale}rem`;
  const iconSize = `${baseIconSize * scale}rem`;
  const chevronSize = `${baseChevronSize * scale}rem`;
  const fontSize = `${baseFontSize * scale}rem`;
  const menuWidth = `${baseMenuWidth * scale}rem`;
  const dividerHeight = `${baseDividerHeight * scale}rem`;
  const dividerWidth = `${baseDividerWidth * scale}rem`;
  const menuMarginTop = `${baseMenuMarginTop * scale}rem`;

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
        className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 rounded-md transition-colors duration-200"
        style={{
          height: buttonHeight,
          paddingLeft: buttonPaddingX,
          paddingRight: buttonPaddingX,
          paddingTop: buttonPaddingY,
          paddingBottom: buttonPaddingY,
        }}
      >
        <LayoutDashboard style={{ width: iconSize, height: iconSize }} className="text-white" />
        <span className="text-white font-medium" style={{ fontSize }}>
          Dashboard
        </span>
      </button>

      <button
        onClick={handleExport}
        className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-md border border-gray-500 transition-colors duration-200"
        style={{
          height: buttonHeight,
          paddingLeft: buttonPaddingX,
          paddingRight: buttonPaddingX,
          paddingTop: buttonPaddingY,
          paddingBottom: buttonPaddingY,
        }}
      >
        <FileArchive style={{ width: iconSize, height: iconSize }} className="text-white" />
        <span className="text-white font-medium" style={{ fontSize }}>
          Exportar
        </span>
      </button>

      <div className="flex items-center">
        <button
          onClick={handleSaveWithLoading}
          disabled={isSaving}
          className={`flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-l-md border border-gray-500 transition-colors duration-200 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{
            height: buttonHeight,
            paddingLeft: buttonPaddingX,
            paddingRight: buttonPaddingX,
            paddingTop: buttonPaddingY,
            paddingBottom: buttonPaddingY,
          }}
        >
          <Save style={{ width: iconSize, height: iconSize }} className={`text-white ${isSaving ? 'animate-spin' : ''}`} />
          <span className="text-white font-medium" style={{ fontSize }}>
            {isSaving ? 'Guardando...' : 'Guardar'}
          </span>
        </button>

        <div className="relative" style={{ height: buttonHeight }}>
          <div
            className="absolute left-0 top-1/2 bg-gray-500 -translate-y-1/2"
            style={{ height: dividerHeight, width: dividerWidth }}
          ></div>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="h-full bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-r-md border border-l-0 border-gray-500 transition-colors duration-200 flex items-center justify-center"
            style={{
              paddingLeft: buttonPaddingY,
              paddingRight: buttonPaddingY,
            }}
            aria-label="Mostrar opciones"
          >
            <ChevronDown style={{ width: chevronSize, height: chevronSize }} className="text-white" />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-[1000]"
              style={{ marginTop: menuMarginTop, width: menuWidth }}
              onMouseLeave={() => setShowMenu(false)}
            >
              <button
                onClick={() => {
                  setShowLoadModal(true);
                  setShowMenu(false);
                }}
                className="flex items-center space-x-2 w-full px-4 py-2 text-white hover:bg-gray-700 rounded-md transition-colors duration-200"
                style={{
                  paddingLeft: buttonPaddingX,
                  paddingRight: buttonPaddingX,
                  paddingTop: buttonPaddingY,
                  paddingBottom: buttonPaddingY,
                }}
              >
                <Upload style={{ width: iconSize, height: iconSize }} className="text-gray-300" />
                <span className="text-gray-300" style={{ fontSize }}>
                  Cargar
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}