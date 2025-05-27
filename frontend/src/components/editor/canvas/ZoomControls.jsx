import React, { useEffect, useState } from "react";
import { Minus, Plus, RotateCcw, X } from "lucide-react";
import { useEditorStore } from '../../../stores/editorStore'

export default function ZoomControls({
  zoomIn,
  zoomOut,
  resetZoom,
  minZoom,
  maxZoom,
  updateZoomManually,
}) {
  const {
    getZoomLevel,
    imagesLoaded,
    activeImageIndex,
    dimensionImages,
    setMinZoom,
    configIconsPositions,
    isSettingsVisible,
    setConfigIconsPositions
  } = useEditorStore();
  const [zoomLevel, setZoomLevel] = useState(1);
  const zoomPercentage = Math.round(zoomLevel * 100);
  const [isVisible, setIsVisible] = useState(true);
  let currentZoom = getZoomLevel(activeImageIndex);
  const [resetValue, setResetValue] = useState(1);
  const [currentMinZoom, setCurrentMinZoom] = useState(minZoom);

  useEffect(() => {
    if (imagesLoaded) {
      setZoomLevel(currentZoom);
    }
  }, [imagesLoaded, activeImageIndex, currentZoom]);

  useEffect(() => {
    if (imagesLoaded) {
      const targetHeight = Math.round(window.innerHeight * 0.8138);
      dimensionImages.forEach((image, index) => {
        const imageHeight = image.height;
        let zoomReset = 1;

        if (imageHeight > targetHeight) {
          zoomReset = targetHeight / imageHeight;
        }

        setMinZoom(index, zoomReset);
        resetZoom(zoomReset, index);
      });
    }
  }, [imagesLoaded, setMinZoom, dimensionImages]);

  useEffect(() => {
    if (imagesLoaded && activeImageIndex !== null) {
      const imageHeight = dimensionImages[activeImageIndex].height;
      const targetHeight = Math.round(window.innerHeight * 0.8138);
      let zoomReset = 1;

      if (imageHeight > targetHeight) {
        zoomReset = targetHeight / imageHeight;
      }

      setResetValue(zoomReset);
      setCurrentMinZoom(zoomReset);
    }
  }, [imagesLoaded, activeImageIndex, dimensionImages]);

  const handleResetZoom = () => {
    const targetHeight = Math.round(window.innerHeight * 0.8138);
    let zoomReset = 1;
    const imageHeight = dimensionImages[activeImageIndex].height;

    if (imageHeight > targetHeight) {
      zoomReset = targetHeight / imageHeight;
    }

    resetZoom(zoomReset, activeImageIndex);
    setZoomLevel(zoomReset);
    setResetValue(zoomReset);
  };

  useEffect(() => {
    setConfigIconsPositions('zoomIcon', 
      { ...configIconsPositions.zoomIcon, active: !isVisible });
  }, [isVisible]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          top: configIconsPositions.zoomIcon.top,
          right: isSettingsVisible ? configIconsPositions.zoomIcon.right : '10%',
          zIndex: 50,
          padding: '0.5rem',
          backgroundColor: '#2a2a2a',
          borderRadius: '0.375rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(55, 65, 81, 0.5)',
          color: 'white',
          transition: 'background-color 600ms'
        }}
        title="Show zoom controls"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="11" y1="8" x2="11" y2="14"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: configIconsPositions.zoomIcon.top,
      right: isSettingsVisible ? configIconsPositions.zoomIcon.right : '10%',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      backgroundColor: '#2a2a2a',
      padding: '0.5rem',
      borderRadius: '0.375rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: '1px solid rgba(55, 65, 81, 0.5)'
    }}>
      <div className="flex items-center space-x-4">
        <button
          onClick={zoomOut}
          disabled={zoomLevel <= currentMinZoom}
          className={`p-1.5 rounded-md transition-colors duration-200 ${
            zoomLevel <= currentMinZoom
              ? "bg-gray-700/50 cursor-not-allowed"
              : "bg-[#4a90e2] hover:bg-[#357abd] active:bg-[#2d6aa6]"
          }`}
          title="Zoom out"
        >
          <Minus className="w-4 h-4 text-white" />
        </button>
        <div className="flex items-center space-x-3">
          <input
            type="range"
            min={currentMinZoom}
            max={maxZoom}
            step="0.1"
            value={zoomLevel}
            onChange={(e) => {
              const newZoom = parseFloat(e.target.value);
              setZoomLevel(newZoom);
              updateZoomManually(newZoom);
            }}
            className="w-32 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:transition-all hover:[&::-webkit-slider-thumb]:w-4 hover:[&::-webkit-slider-thumb]:h-4"
          />
          <span className="text-white text-sm min-w-[3rem]">
            {zoomPercentage}%
          </span>
        </div>

        <button
          onClick={zoomIn}
          disabled={zoomLevel >= maxZoom}
          className={`p-1.5 rounded-md transition-colors duration-200 ${
            zoomLevel >= maxZoom
              ? "bg-gray-700/50 cursor-not-allowed"
              : "bg-[#4a90e2] hover:bg-[#357abd] active:bg-[#2d6aa6]"
          }`}
          title="Zoom in"
        >
          <Plus className="w-4 h-4 text-white" />
        </button>

        <button
          onClick={handleResetZoom}
          disabled={zoomLevel === resetValue}
          className={`p-1.5 rounded-md transition-colors duration-200 ${
            zoomLevel === resetValue
              ? "bg-gray-700/50 cursor-not-allowed"
              : "bg-[#4a90e2] hover:bg-[#357abd] active:bg-[#2d6aa6]"
          }`}
          title="Reset zoom"
        >
          <RotateCcw className="w-4 h-4 text-white" />
        </button>
      </div>
      <div className="border-l border-gray-700/50 ml-2 pl-2">
        <button
          onClick={() => setIsVisible(false)}
          className="p-1.5 rounded-md hover:bg-gray-700/50 transition-colors duration-200"
          title="Close zoom controls"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}