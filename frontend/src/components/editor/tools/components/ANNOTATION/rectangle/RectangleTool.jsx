import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useEditorStore } from "../../../../../../stores/editorStore";
import { TOOLS } from "../../../../../../constants/tools";
import { LAYERS } from "../../../../../../constants/layers";
import { v4 as uuidv4 } from "uuid";
import createRectangleObject from "./createRectangleObject";
import useLayerHistory from "../../../../floating-menus/UndoRedoMenu/handlers/fabricHistoryManager";
import ObjectStatus from "../../../../floating-menus/UndoRedoMenu/handlers/enumObjectRequests";

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
const RectangleTool = ({ currentImageIndex }) => {
  const {
    activeTools,
    activeLayer,
    selectedRectangleColor,
    setRectangleColor,
    getCanvasInstance,
  } = useEditorStore();

  const isActive = activeTools.includes(TOOLS.RECTANGLE.id);
  const isDrawing = useRef(false);
  const startPoint = useRef(null);
  const rect = useRef(null);
  const selectedColorRef = useRef(selectedRectangleColor);
  let dimensions = { top: 0, left: 0 };
  const [previousImageIndex, setPreviousImageIndex] = useState(null);

  const { saveState } = useLayerHistory();

  const debouncedSaveState = debounce(saveState, 200);

  useEffect(() => {
    selectedColorRef.current = selectedRectangleColor;
    const canvas = getCanvasInstance(currentImageIndex);
    let previousCanvas = getCanvasInstance(previousImageIndex);
    if (canvas) {
      if (previousCanvas !== null && previousCanvas !== undefined && currentImageIndex !== previousImageIndex) {
        previousCanvas.discardActiveObject();
        previousCanvas.renderAll();
      }
      canvas.requestRenderAll();
    }
    setPreviousImageIndex(currentImageIndex);
  }, [selectedRectangleColor, currentImageIndex, getCanvasInstance]);


  const updateActiveObjects = (canvas) => {
    const activeObjects = canvas
      .getActiveObjects()
      .filter((obj) => obj.type === "rect");
    if (activeObjects.length === 1) {
      const activeRect = activeObjects[0];
      setRectangleColor(activeRect.stroke);
      selectedColorRef.current = activeRect.stroke;
    }
    canvas.requestRenderAll();
  };

  useEffect(() => {
    const canvas = getCanvasInstance(currentImageIndex);
    if (!canvas || !isActive) return;

    canvas.selection = true;
    canvas.preserveObjectStacking = true;
    canvas.perPixelTargetFind = true;
    canvas.hoverCursor = "pointer";
    canvas.borderScaleFactor = 12;

    const handleMouseDown = (options) => {

      if (activeLayer !== LAYERS.ANNOTATION.id) return;

      // Primero usar findTarget que respeta el z-index
      const target = canvas.findTarget(options.e, true);
      if (target?.type === 'rect') {
        canvas.setActiveObject(target);
        canvas.requestRenderAll();
        return;
      }

      // Fallback: verificar manualmente si hay rectángulos en la posición
      const pointer = canvas.getPointer(options.e);
      const clickedRects = canvas.getObjects().filter(obj =>
        obj.type === 'rect' && obj.containsPoint(pointer)
      );

      // Seleccionar el rectángulo más pequeño (probablemente el más arriba)
      if (clickedRects.length > 0) {
        const smallestRect = clickedRects.reduce((prev, curr) =>
          (prev.width * prev.height < curr.width * curr.height) ? prev : curr
        );
        canvas.setActiveObject(smallestRect);
        canvas.requestRenderAll();
        return;
      }

      canvas.discardActiveObject();
      canvas.renderAll();

      isDrawing.current = true;
      startPoint.current = { x: pointer.x, y: pointer.y };

      rect.current = createRectangleObject(
        pointer.x,
        pointer.y,
        selectedColorRef.current,
      );

      rect.current.layer = LAYERS.ANNOTATION.id;
      canvas.add(rect.current);
    };

    const handleMouseMove = (options) => {
      if (!isDrawing.current || !rect.current) return;
      const pointer = canvas.getPointer(options.e);
      const width = pointer.x - startPoint.current.x;
      const height = pointer.y - startPoint.current.y;
      rect.current.set({
        width: Math.abs(width),
        height: Math.abs(height),
        left: width > 0 ? startPoint.current.x : pointer.x,
        top: height > 0 ? startPoint.current.y : pointer.y,
      });
      canvas.requestRenderAll();
      dimensions = { top: rect.current.top, left: rect.current.left };
    };

    const handleMouseUp = () => {
      if (!isDrawing.current || !rect.current) return;
      const MIN_SIZE = 5;
      if (rect.current.width < MIN_SIZE || rect.current.height < MIN_SIZE) {
        canvas.remove(rect.current);
      } else {
        const annotationId = uuidv4();
        rect.current.set("id", annotationId);
        canvas.discardActiveObject();
        canvas.setActiveObject(rect.current);
        debouncedSaveState(rect.current, ObjectStatus.ADD);
      }
      canvas.requestRenderAll();
      isDrawing.current = false;
      startPoint.current = null;
      rect.current = null;
    };

    const handleKeyDown = (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === "rect") {
          canvas.remove(activeObject);
          canvas.requestRenderAll();
          debouncedSaveState(activeObject, ObjectStatus.DELETE);
        }
      } else if (e.key >= "1" && e.key <= "9") {
        const strokeWidth = parseInt(e.key);
        const rects = canvas.getObjects().filter(obj => obj.type === "rect");
        rects.forEach(rect => {
          rect.set({ strokeWidth });
          rect.setCoords();
        });
        canvas.requestRenderAll();
      }
    };

    const handleObjectModified = (options) => {
      const target = options.target;
      if (target && target.type === "rect") {
        const updatedCoords = {
          left: target.left,
          top: target.top,
          width: target.width * target.scaleX,
          height: target.height * target.scaleY,
          scaleX: 1,
          scaleY: 1,
        };
        target.set(updatedCoords);
        debouncedSaveState(target, ObjectStatus.UPDATE);
        canvas.requestRenderAll();
      }
    };

    const onSelectionChange = () => updateActiveObjects(canvas);

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);
    canvas.on("selection:created", onSelectionChange);
    canvas.on("selection:updated", onSelectionChange);
    canvas.on("object:modified", handleObjectModified);

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:up", handleMouseUp);
      canvas.off("selection:created", onSelectionChange);
      canvas.off("selection:updated", onSelectionChange);
      canvas.off("object:modified", handleObjectModified);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive, activeLayer, currentImageIndex, getCanvasInstance]);

  return null;
};

RectangleTool.propTypes = {
  currentImageIndex: PropTypes.number.isRequired,
};

export default RectangleTool;
