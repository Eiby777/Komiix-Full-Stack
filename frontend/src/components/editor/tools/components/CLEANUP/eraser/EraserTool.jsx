import { useEffect } from "react";
import PropTypes from "prop-types";
import { useEditorStore } from "../../../../../../stores/editorStore";
import { TOOLS } from "../../../../../../constants/tools";
import CustomEraserBrush from "./CustomEraserBrush";
import useLayerHistory from "../../../../floating-menus/components/UndoRedoMenu/handlers/fabricHistoryManager";

const createEraserCursor = (size) => {
  const maxCanvasSize = 128;
  const desiredCanvasSize = size * 2;

  let canvasSize = Math.min(desiredCanvasSize, maxCanvasSize);
  const scaleFactor = canvasSize / desiredCanvasSize;

  const cursorCanvas = document.createElement("canvas");
  cursorCanvas.width = canvasSize;
  cursorCanvas.height = canvasSize;
  const ctx = cursorCanvas.getContext("2d");

  ctx.scale(scaleFactor, scaleFactor);

  const centerX = desiredCanvasSize / 2;
  const centerY = desiredCanvasSize / 2;
  const radius = (size / 2) * (1 / scaleFactor);

  // Fondo transparente
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  // Borde principal fijo (gris oscuro)
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "#333333"; // Color fijo para el borde
  ctx.lineWidth = 1 / scaleFactor;
  ctx.stroke();

  // Efecto adicional: "X" en el centro para indicar borrador
  const xSize = radius * 0.8; // Tamaño de la "X" (80% del radio)
  ctx.beginPath();
  ctx.moveTo(centerX - xSize, centerY - xSize);
  ctx.lineTo(centerX + xSize, centerY + xSize);
  ctx.moveTo(centerX + xSize, centerY - xSize);
  ctx.lineTo(centerX - xSize, centerY + xSize);
  ctx.strokeStyle = "#FFFFFF"; // Blanco para contraste
  ctx.lineWidth = 1 / scaleFactor;
  ctx.stroke();

  const hotspot = canvasSize / 2;

  return {
    dataURL: cursorCanvas.toDataURL(),
    hotspotX: hotspot,
    hotspotY: hotspot,
  };
};

const EraserTool = ({ currentImageIndex }) => {
  const { activeTools, getCanvasInstance, selectedEraserSize, activeLayer } =
    useEditorStore();
  const isActive = activeTools.includes(TOOLS.ERASER.id);
  const { saveState } = useLayerHistory();

  useEffect(() => {
    const canvas = getCanvasInstance(currentImageIndex);
    if (!canvas) {
      console.warn("Canvas not found for index:", currentImageIndex);
      return;
    }

    if (isActive) {
      try {
        canvas.isDrawingMode = true;

        const eraserBrush = new CustomEraserBrush(canvas, activeLayer, saveState);
        eraserBrush.width = selectedEraserSize;
        canvas.freeDrawingBrush = eraserBrush;

        const newCursor = createEraserCursor(selectedEraserSize);
        const cursorStyle = `url(${newCursor.dataURL}) ${newCursor.hotspotX} ${newCursor.hotspotY}, auto`;
        canvas.freeDrawingCursor = cursorStyle;
        canvas.hoverCursor = cursorStyle;
        canvas.upperCanvasEl.style.cursor = cursorStyle;

        const handleMouseDown = (event) => {
          
          if (!event.e.altKey) {
            const target = event.target;
            if (
              target?.selectable &&
              "layer" in target &&
              target.layer === activeLayer
            ) {
              saveState(target);
              canvas.remove(target);
              canvas.renderAll();
            }
          }
        };

        canvas.on("mouse:down", handleMouseDown);

        return () => {
          canvas.isDrawingMode = false;
          canvas.freeDrawingBrush = null;
          canvas.upperCanvasEl.style.cursor = "default";
          canvas.off("mouse:down", handleMouseDown);
          canvas.renderAll();
        };
      } catch (error) {
        console.error("Error initializing eraser tool:", error);
      }
    } else {
      canvas.isDrawingMode = false;
      canvas.upperCanvasEl.style.cursor = "default";
      canvas.renderAll();
    }
  }, [
    currentImageIndex,
    isActive,
    selectedEraserSize,
    activeLayer,
    getCanvasInstance,
  ]);

  return null;
};

EraserTool.propTypes = {
  currentImageIndex: PropTypes.number.isRequired,
};

export default EraserTool;
