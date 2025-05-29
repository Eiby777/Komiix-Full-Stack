import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useEditorStore } from "../../../../../../stores/editorStore";
import { TOOLS } from "../../../../../../constants/tools";
import { LAYERS } from "../../../../../../constants/layers";
import { configTextObject } from "./handlers/textObjectHandlers";
import useLayerHistory from "../../../../floating-menus/UndoRedoMenu/handlers/fabricHistoryManager";
import ObjectStatus from "../../../../floating-menus/UndoRedoMenu/handlers/enumObjectRequests";

const TextTool = ({ currentImageIndex }) => {
  const {
    activeTools,
    activeLayer,
    selectedTextColor,
    setTextColor,
    getCanvasInstance,
    setCanvasObjectStatus
  } = useEditorStore();

  const isActive = activeTools.includes(TOOLS.TEXT.id);
  const isDragging = useRef(false);
  const textObject = useRef(null);
  const startPoint = useRef(null);
  const selectedColorRef = useRef(selectedTextColor);
  const { saveState } = useLayerHistory();    

  useEffect(() => {
    selectedColorRef.current = selectedTextColor;
    const canvas = getCanvasInstance(currentImageIndex);
    if (canvas) {
      const activeObjects = canvas
        .getActiveObjects()
        .filter((obj) => obj.type === "textbox");
      if (activeObjects.length === 1) {
        updateTextStyle(activeObjects[0], selectedTextColor);
      }
      canvas.requestRenderAll();
    }
  }, [selectedTextColor, currentImageIndex, getCanvasInstance]);

  const updateTextStyle = (textObj, color) => {
    textObj.set({
      fill: color,
      cornerColor: color,
    });
  };

  const updateActiveObjects = (canvas) => {
    const activeObjects = canvas
      .getActiveObjects()
      .filter((obj) => obj.type === "textbox");
    if (activeObjects.length === 1) {
      const activeText = activeObjects[0];
      setTextColor(activeText.fill);
      selectedColorRef.current = activeText.fill;
    }
    canvas.requestRenderAll();
  };

  useEffect(() => {
    const canvas = getCanvasInstance(currentImageIndex);
    if (!canvas || !isActive) return;

    canvas.selection = true;
    canvas.preserveObjectStacking = true;
    canvas.perPixelTargetFind = false; // Cambiado a false para selección por área
    canvas.hoverCursor = "text";
    
    const handleMouseDown = (options) => {
      if (activeLayer !== LAYERS.TEXT.id) return;

      const target = canvas.findTarget(options.e);
      const isCtrlPressed = options.e.ctrlKey;

      if (target && isCtrlPressed && target.type === "textbox") {
        canvas.setActiveObject(target);
        target.set({
          lockMovementX: false,
          lockMovementY: false,
          hasControls: true,
        });
        return;
      }

      if (!target) {
        isDragging.current = true;
        startPoint.current = canvas.getPointer(options.e);
      }
    };

    const handleMouseMove = (options) => {
      if (!isDragging.current || !startPoint.current) return;
    };

    const handleMouseUp = (options) => {
      if (!isDragging.current || !startPoint.current) return;

      const endPoint = canvas.getPointer(options.e);
      const width = Math.abs(endPoint.x - startPoint.current.x);
      const height = Math.abs(endPoint.y - startPoint.current.y);
      const left = Math.min(startPoint.current.x, endPoint.x);
      const top = Math.min(startPoint.current.y, endPoint.y);

      if (width > 10 && height > 10) {
        const coords = { left, top, width, height };
        textObject.current = configTextObject(coords, canvas, selectedColorRef.current);
        canvas.add(textObject.current);
        saveState(textObject.current, ObjectStatus.ADD);
        canvas.requestRenderAll();
        setCanvasObjectStatus(currentImageIndex, true);
      }

      isDragging.current = false;
      startPoint.current = null;
    };

    const handleKeyDown = (e) => {
      if (e.key === "Delete") {
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === "textbox") {
          canvas.remove(activeObject);
          canvas.requestRenderAll();
          saveState(activeObject, ObjectStatus.DELETE);
        }
      }
    };

    const handleObjectModified = (options) => {
      const target = options.target;
      if (target && target.type === "textbox") {
        target.set({
          cursorWidth: 3,
          cursorDelay: 0,
          cursorDuration: 1000
        });
        canvas.requestRenderAll();
        saveState(target, ObjectStatus.UPDATE);
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

TextTool.propTypes = {
  currentImageIndex: PropTypes.number.isRequired,
};

TextTool.displayName = "TextTool";

export default TextTool;
