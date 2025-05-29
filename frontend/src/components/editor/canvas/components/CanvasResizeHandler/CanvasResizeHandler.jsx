import { useEffect, useCallback, useState } from "react";
import { useEditorStore } from "../../../../../stores/editorStore";
import { useCanvasZoom } from "../../handlers/useCanvasZoom";
import { TOOLS } from "../../../../../constants/tools";

export default function CanvasResizeHandler() {
  const { canvasInstances, imagesLoaded, getZoomLevel, isSettingsVisible, activeTools } = useEditorStore();
  const { resetZoom } = useCanvasZoom();
  const [previousWidth, setPreviousWidth] = useState(null);
  const [previousIsSettingsVisible, setPreviousIsSettingsVisible] = useState(null);

  const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const handleResize = useCallback(() => {
    if (activeTools.includes(TOOLS.PAN.id)) return;
    if (!imagesLoaded) return;
    const parentContainer = document.getElementById("div_canvases");
    if (!parentContainer) return;

    const newWidth = parentContainer.clientWidth;

    if (newWidth === previousWidth && previousIsSettingsVisible === isSettingsVisible) return;
    setPreviousWidth(newWidth);
    setPreviousIsSettingsVisible(isSettingsVisible);
    

    canvasInstances.forEach((fabricCanvas, index) => {
      if (!fabricCanvas) return;

      const newHeight = parentContainer.clientHeight;

      fabricCanvas.getElement().parentNode.style.cssText = `width:${newWidth}px;height:${newHeight}px`;
      fabricCanvas.setDimensions({ width: newWidth, height: newHeight });

      const backgroundObj = fabricCanvas
        .getObjects()
        .find((obj) => obj.backgroundImage);
      const coordParams = backgroundObj
        ? {
            oldImageLeft: backgroundObj.left,
            oldImageTop: backgroundObj.top,
            bgWidth: backgroundObj.width || 0,
            bgHeight: backgroundObj.height || 0,
            newImageLeft: newWidth / 2,
            newImageTop: newHeight / 2,
          }
        : {};

      if (backgroundObj) {
        backgroundObj.set({
          scaleX: 1,
          scaleY: 1,
          left: newWidth / 2,
          top: newHeight / 2,
          originX: "center",
          originY: "center",
        });
        backgroundObj.setCoords();
      }

      fabricCanvas.forEachObject((obj) => {
        if (obj !== backgroundObj) {
          const [newLeft, newTop] = getNewObjectCoords(obj, coordParams);
          obj.set({ left: newLeft, top: newTop }).setCoords();
        }
      });

      resetZoom(getZoomLevel(index), index);
      fabricCanvas.renderAll();
    });
  }, [canvasInstances, imagesLoaded, getZoomLevel, resetZoom, previousWidth, isSettingsVisible]);

  const getNewObjectCoords = useCallback(
    (
      obj,
      { oldImageLeft, oldImageTop, bgWidth, bgHeight, newImageLeft, newImageTop }
    ) => {
      const relativeLeft = (obj.left - oldImageLeft) / bgWidth;
      const relativeTop = (obj.top - oldImageTop) / bgHeight;
      return [
        newImageLeft + relativeLeft * bgWidth,
        newImageTop + relativeTop * bgHeight,
      ];
    },
    []
  );

  useEffect(() => {
    if (activeTools.includes(TOOLS.PAN.id)) return;

    const debouncedHandleResize = debounce(handleResize, 300);
    debouncedHandleResize(); // Ejecutar al cambiar isSettingsVisible o al montar
  }, [isSettingsVisible, handleResize]);

  useEffect(() => {
    const debouncedHandleResize = debounce(handleResize, 300);

    window.addEventListener("resize", debouncedHandleResize);
    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, [handleResize]);

  return null;
}