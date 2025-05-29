import { useEffect } from "react";
import PropTypes from "prop-types";
import { useEditorStore } from "../../../../../../stores/editorStore";
import { TOOLS } from "../../../../../../constants/tools";
import CustomHardnessBrush from "./SoftBrush";
import useLayerHistory from "../../../../floating-menus/UndoRedoMenu/handlers/fabricHistoryManager";

const BrushTool = ({ currentImageIndex }) => {
  const {
    activeTools,
    getCanvasInstance,
    selectedBrushColor,
    selectedBrushSize,
    selectedBrushHardness,
    activeLayer,
    getZoomLevel,
  } = useEditorStore();

  const { saveState } = useLayerHistory();

  const isActive = activeTools.includes(TOOLS.BRUSH.id);

  const createBrushCursor = (size) => {
    const maxBrushSize = 64;
    const maxCanvasSize = 128;
    const desiredCanvasSize = size * 2;

    let canvasSize, scaleFactor;

    if (size <= maxBrushSize) {
      canvasSize = desiredCanvasSize;
      scaleFactor = 1;
    } else {
      canvasSize = maxCanvasSize;
      scaleFactor = canvasSize / desiredCanvasSize;
    }

    const cursorCanvas = document.createElement("canvas");
    cursorCanvas.width = canvasSize;
    cursorCanvas.height = canvasSize;
    const ctx = cursorCanvas.getContext("2d");

    ctx.scale(scaleFactor, scaleFactor);

    const centerX = desiredCanvasSize / 2;
    const centerY = desiredCanvasSize / 2;
    const radius = (size / 2) * (1 / scaleFactor);

    ctx.clearRect(0, 0, canvasSize, canvasSize);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 1 / scaleFactor;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.8, 0, 2 * Math.PI);
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 1 / scaleFactor;
    ctx.setLineDash([2 / scaleFactor, 2 / scaleFactor]);
    ctx.stroke();
    ctx.setLineDash([]);

    const hotspot = canvasSize / 2;

    return {
      dataURL: cursorCanvas.toDataURL(),
      hotspotX: hotspot,
      hotspotY: hotspot,
    };
  };

  useEffect(() => {
    const canvas = getCanvasInstance(currentImageIndex);
    if (!canvas || !canvas.upperCanvasEl) return;

    if (isActive) {
      canvas.isDrawingMode = true;

      const currentZoom = getZoomLevel(currentImageIndex) || 1;

      canvas.freeDrawingBrush = new CustomHardnessBrush(canvas, {
        width: selectedBrushSize,
        color: selectedBrushColor,
        hardness: selectedBrushHardness / 100,
        zoomLevel: currentZoom,
      }, saveState);

      const newCursor = createBrushCursor(selectedBrushSize);
      const cursorStyle = `url(${newCursor.dataURL}) ${newCursor.hotspotX} ${newCursor.hotspotY}, auto`;
      canvas.freeDrawingCursor = cursorStyle;
      canvas.hoverCursor = cursorStyle;
      canvas.upperCanvasEl.style.cursor = cursorStyle;

    } else {
      canvas.isDrawingMode = false;
      canvas.freeDrawingBrush = null; // Reset the brush
      canvas.upperCanvasEl.style.cursor = "default";
    }

    const updateBrushOnZoom = () => {
      if (!isActive || !canvas) return;

      const currentZoom = getZoomLevel(currentImageIndex) || 1;

      if (canvas.freeDrawingBrush && canvas.freeDrawingBrush.setZoomLevel) {
        canvas.freeDrawingBrush.setZoomLevel(currentZoom);
      }
    };

    canvas.on("mouse:wheel", updateBrushOnZoom);
    canvas.on("zoom:changed", updateBrushOnZoom);

    return () => {
      if (canvas && canvas.upperCanvasEl) {

        canvas.isDrawingMode = false;
        canvas.freeDrawingBrush = null; // Ensure brush is cleared on unmount
        canvas.upperCanvasEl.style.cursor = "default";
        canvas.off("mouse:wheel", updateBrushOnZoom);
        canvas.off("zoom:changed", updateBrushOnZoom);
      }
    };
  }, [
    currentImageIndex,
    isActive,
    selectedBrushColor,
    selectedBrushSize,
    selectedBrushHardness,
    getCanvasInstance,
    activeLayer,
    getZoomLevel,
  ]);

  return null;
};

BrushTool.propTypes = {
  currentImageIndex: PropTypes.number.isRequired,
};

export default BrushTool;
