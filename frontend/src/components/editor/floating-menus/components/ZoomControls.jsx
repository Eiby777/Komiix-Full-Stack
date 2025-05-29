import React, { useEffect, useState, useRef } from "react";
import minusIcon from './icons/minus.png';
import plusIcon from './icons/plus.png';
import resetIcon from './icons/reset.png';
import crossIcon from './icons/cross.png';
import { useEditorStore } from "../../../../stores/editorStore";

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

  // Refs for measuring components
  const containerRef = useRef(null);
  const zoomOutButtonRef = useRef(null);
  const sliderRef = useRef(null);
  const percentageRef = useRef(null);
  const zoomInButtonRef = useRef(null);
  const resetButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const hiddenButtonRef = useRef(null);

  // Calculate scaling factor
  const referenceHeight = 46; // Main container height at 952px viewport
  const scaleFactor = Math.max(0.75, Math.min(1, window.innerHeight / 952 * (referenceHeight / referenceHeight)));
  const scaledPadding = Math.max(4, 8 * scaleFactor); // Min 4px padding (original ~8px)
  const scaledButtonSize = Math.max(20, 28 * scaleFactor); // Min 20px (original 28px)
  const scaledSliderWidth = Math.max(90, 128 * scaleFactor); // Min 90px (original 128px)
  const scaledTextHeight = Math.max(14, 20 * scaleFactor); // Min 14px (original 20px)
  const scaledIconSize = Math.min(16, scaledButtonSize * 0.9); // Max 16px, scales with 90% of button size

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
        ref={hiddenButtonRef}
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          top: configIconsPositions.zoomIcon.top,
          right: isSettingsVisible ? configIconsPositions.zoomIcon.right : '10%',
          zIndex: 50,
          padding: `${scaledPadding}px`,
          backgroundColor: '#2a2a2a',
          borderRadius: '6px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(55, 65, 81, 0.5)',
          color: 'white',
          transition: 'background-color 600ms'
        }}
        title="Show zoom controls"
      >
        <img src={plusIcon} alt="Zoom in" style={{ width: `${scaledIconSize}px`, height: `${scaledIconSize}px`, color: 'white' }} />
      </button>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: configIconsPositions.zoomIcon.top,
        right: isSettingsVisible ? configIconsPositions.zoomIcon.right : '10%',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: `${scaledPadding}px`,
        backgroundColor: '#2a2a2a',
        padding: `${scaledPadding}px`,
        borderRadius: '6px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(55, 65, 81, 0.5)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: `${scaledPadding}px` }}>
        <button
          ref={zoomOutButtonRef}
          onClick={zoomOut}
          disabled={zoomLevel <= currentMinZoom}
          style={{
            padding: `${scaledPadding}px`,
            width: `${scaledButtonSize}px`,
            height: `${scaledButtonSize}px`,
            borderRadius: '4px',
            transition: 'background-color 200ms',
            backgroundColor: zoomLevel <= currentMinZoom ? 'rgba(55, 65, 81, 0.5)' : '#4a90e2',
            cursor: zoomLevel <= currentMinZoom ? 'not-allowed' : 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onMouseOver={(e) => { if (zoomLevel > currentMinZoom) e.currentTarget.style.backgroundColor = '#357abd'; }}
          onMouseOut={(e) => { if (zoomLevel > currentMinZoom) e.currentTarget.style.backgroundColor = '#4a90e2'; }}
          onMouseDown={(e) => { if (zoomLevel > currentMinZoom) e.currentTarget.style.backgroundColor = '#2d6aa6'; }}
          title="Zoom out"
        >
          <img src={minusIcon} alt="Zoom out" style={{ width: `${scaledIconSize}px`, height: `${scaledIconSize}px`, color: 'white' }} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: `${scaledPadding / 2}px` }}>
          <input
            ref={sliderRef}
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
            style={{
              width: `${scaledSliderWidth}px`,
              height: '8px',
              backgroundColor: '#4b5563',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          />
          <span
            ref={percentageRef}
            style={{
              color: 'white',
              fontSize: '0.875rem',
              minWidth: '48px',
              height: `${scaledTextHeight}px`,
              lineHeight: `${scaledTextHeight}px`
            }}
          >
            {zoomPercentage}%
          </span>
        </div>
        <button
          ref={zoomInButtonRef}
          onClick={zoomIn}
          disabled={zoomLevel >= maxZoom}
          style={{
            padding: `${scaledPadding}px`,
            width: `${scaledButtonSize}px`,
            height: `${scaledButtonSize}px`,
            borderRadius: '4px',
            transition: 'background-color 200ms',
            backgroundColor: zoomLevel >= maxZoom ? 'rgba(55, 65, 81, 0.5)' : '#4a90e2',
            cursor: zoomLevel >= maxZoom ? 'not-allowed' : 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onMouseOver={(e) => { if (zoomLevel < maxZoom) e.currentTarget.style.backgroundColor = '#357abd'; }}
          onMouseOut={(e) => { if (zoomLevel < maxZoom) e.currentTarget.style.backgroundColor = '#4a90e2'; }}
          onMouseDown={(e) => { if (zoomLevel < maxZoom) e.currentTarget.style.backgroundColor = '#2d6aa6'; }}
          title="Zoom in"
        >
          <img src={plusIcon} alt="Zoom in" style={{ width: `${scaledIconSize}px`, height: `${scaledIconSize}px`, color: 'white' }} />
        </button>
        <button
          ref={resetButtonRef}
          onClick={handleResetZoom}
          disabled={zoomLevel === resetValue}
          style={{
            padding: `${scaledPadding}px`,
            width: `${scaledButtonSize}px`,
            height: `${scaledButtonSize}px`,
            borderRadius: '4px',
            transition: 'background-color 200ms',
            backgroundColor: zoomLevel === resetValue ? 'rgba(55, 65, 81, 0.5)' : '#4a90e2',
            cursor: zoomLevel === resetValue ? 'not-allowed' : 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onMouseOver={(e) => { if (zoomLevel !== resetValue) e.currentTarget.style.backgroundColor = '#357abd'; }}
          onMouseOut={(e) => { if (zoomLevel !== resetValue) e.currentTarget.style.backgroundColor = '#4a90e2'; }}
          onMouseDown={(e) => { if (zoomLevel !== resetValue) e.currentTarget.style.backgroundColor = '#2d6aa6'; }}
          title="Reset zoom"
        >
          <img src={resetIcon} alt="Reset zoom" style={{ width: `${scaledIconSize}px`, height: `auto`, color: 'white' }} />
        </button>
      </div>
      <div style={{ borderLeft: '1px solid rgba(55, 65, 81, 0.5)', marginLeft: `${scaledPadding}px`, paddingLeft: `${scaledPadding}px` }}>
        <button
          ref={closeButtonRef}
          onClick={() => setIsVisible(false)}
          style={{
            padding: `${scaledPadding}px`,
            width: `${scaledButtonSize}px`,
            height: `${scaledButtonSize}px`,
            borderRadius: '4px',
            transition: 'background-color 200ms',
            backgroundColor: 'transparent',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.5)')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          title="Close zoom controls"
        >
          <img src={crossIcon} alt="Close" style={{ width: `${scaledIconSize-7}px`, height: `${scaledIconSize-7}px`, color: 'white' }} />
        </button>
      </div>
    </div>
  );
}