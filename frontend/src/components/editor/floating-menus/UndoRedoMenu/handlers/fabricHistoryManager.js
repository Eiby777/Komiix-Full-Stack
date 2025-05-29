import { LAYERS } from "../../../../../constants/layers";
import { useEditorStore } from "../../../../../stores/editorStore";
import { createImageObject } from "../../../tools/components/CLEANUP/brush/TemplateBrush";
import { configTextObject } from "../../../tools/components/TYPE/text/handlers/textObjectHandlers";
import { TOOLS } from "../../../../../constants/tools";
import ObjectStatus from "./enumObjectRequests";
import createRectangleObject from "../../../tools/components/ANNOTATION/rectangle/createRectangleObject";
import lzString from 'lz-string';


const useLayerHistory = () => {
  const {
    activeImageIndex,
    setLayerState,
    setLayerRedoState,
    getCanvasInstance,
    activeLayer,
    isToolActive,
    setMaskLayerState,
    setMaskLayerRedoState,
    getMaskStateHistory,
    getMaskStateRedoHistory,
    getLayerStateHistory,
    getLayerStateRedoHistory,
    setPreviousObject,
    getPreviousObject,
  } = useEditorStore();

  const canvas = getCanvasInstance(activeImageIndex);

  const rectanglePropertiesToCheck = [
    "id",
    "layer",
    "left",
    "top",
    "width",
    "height",
    "cornerColor",
  ];
  const cleanupPropertiesToCheck = [
    "id",
    "layer",
    "left",
    "top",
    "width",
    "height"
  ];
  const textPropertiesToCheck = [
    "id",
    "layer",
    "left",
    "top",
    "width",
    "height",
    "fill",
    "fontFamily",
    "fontSize",
    "fontWeight",
    "lineHeight",
    "stroke",
    "strokeWidth",
    "textAlign",
    "underline",
    "linethrough",
    "fontStyle",
    "uppercase",
    "lowercase",
    "text",
    "originalText",
    "translatedText",
    "typeText",
    "angle"
  ];

  const checkObjectProperties = (targetObject, status) => {
    if (!targetObject?.id || !targetObject?.layer) return false;
    const previousObject = getPreviousObject();
    if (!previousObject) return true;

    const propertiesToCheck = (() => {
      switch (targetObject.layer) {
        case LAYERS.ANNOTATION.id:
          return rectanglePropertiesToCheck;
        case LAYERS.CLEANUP.id:
        case "mask":
          return cleanupPropertiesToCheck;
        case LAYERS.TEXT.id:
          return textPropertiesToCheck;
        default:
          return [];
      }
    })();

    return propertiesToCheck.some(
      property => targetObject[property] !== previousObject[property]) 
      || status !== previousObject.status;
  };

  const updatePreviousObject = (targetObject, status) => {
    let propertyValue = {};
    if (targetObject.layer === LAYERS.ANNOTATION.id) {
      rectanglePropertiesToCheck.forEach((property) => { propertyValue[property] = targetObject[property]; });
    }
    else if ((targetObject.layer === LAYERS.CLEANUP.id || targetObject.layer === "mask") && targetObject.type === "image") {
      cleanupPropertiesToCheck.forEach((property) => { propertyValue[property] = targetObject[property]; });
      propertyValue.type = "image";
      const compressedSrc = lzString.compress(targetObject.src);
      propertyValue.src = compressedSrc;
    }
    else if (targetObject.layer === LAYERS.TEXT.id) {
      textPropertiesToCheck.forEach((property) => { propertyValue[property] = targetObject[property]; });
    }

    if (targetObject.type === "image" && status !== ObjectStatus.ADD) propertyValue.status = ObjectStatus.DELETE
    else if (targetObject.type === "textbox" && status === null) propertyValue.status = ObjectStatus.DELETE
    else propertyValue.status = status;

    setPreviousObject(propertyValue);
    return propertyValue;
  };

  const saveState = (targetObject = null, status = null) => {
    if (!canvas || activeImageIndex < 0) return;
    if (!checkObjectProperties(targetObject, status)) return;
    const currentState = updatePreviousObject(targetObject, status);

    if (activeLayer === LAYERS.CLEANUP.id && isToolActive(TOOLS.REDRAW.id)) {
      const currentHistory = getMaskStateHistory();
      const newHistory = [...currentHistory, currentState];
      setMaskLayerState(activeLayer, activeImageIndex, newHistory);
      setMaskLayerRedoState(activeLayer, activeImageIndex, []);

    } else {
      const currentHistory = getLayerStateHistory();
      const lastHistoryEntry = currentHistory[currentHistory.length - 1];
      if (JSON.stringify(lastHistoryEntry) === JSON.stringify(currentState)) return
      const newHistory = [...currentHistory, currentState];
      setLayerState(activeLayer, activeImageIndex, newHistory);
      setLayerRedoState(activeLayer, activeImageIndex, []);
    }
  };

  const loadState = (updateObject) => {
    if (!canvas) return;
    const objectsToRemove = canvas.getObjects().filter((obj) => obj.id === updateObject.id);
    canvas.remove(...objectsToRemove);

    if (activeLayer === LAYERS.ANNOTATION.id) {
      const rect = createRectangleObject(updateObject.left, updateObject.top, updateObject.cornerColor, updateObject.width, updateObject.height);
      rect.layer = LAYERS.ANNOTATION.id;
      rect.id = updateObject.id;
      canvas.add(rect);
      rect.setCoords();
      canvas.bringObjectToFront(rect);
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    } else if (activeLayer === LAYERS.CLEANUP.id) {
      if (updateObject.type === "image") {
        createImageObject(updateObject, updateObject.layer, true)
          .then((image) => {
            canvas.add(image);
          })
          .catch((error) => {
            console.error("Error creating image:", error);
          });
      }
      canvas.requestRenderAll();
    }
    else if (activeLayer === LAYERS.TEXT.id) {
      const text = configTextObject(updateObject, canvas, updateObject.fill, updateObject.id, updateObject);
      text.layer = LAYERS.TEXT.id;
      text.text = updateObject.text;
      text.originalText = updateObject.originalText;
      text.translatedText = updateObject.translatedText;
      text.typeText = updateObject.typeText || 'Ninguno';
      text.angle = updateObject.angle;
      canvas.add(text);
      text.setCoords();
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  };

  const undo = () => {
    if (!canvas) return;

    const layerHistory = getLayerStateHistory();
    const maskHistory = getMaskStateHistory();
    if (maskHistory.length > 0 && isToolActive(TOOLS.REDRAW.id)) {
      if (activeLayer === LAYERS.CLEANUP.id && isToolActive(TOOLS.REDRAW.id)) {
        const previousState = maskHistory.slice(0, -1);
        const lastHistory = maskHistory[maskHistory.length - 1];

        setMaskLayerState(activeLayer, activeImageIndex, previousState);
        setMaskLayerRedoState(activeLayer, activeImageIndex, [
          lastHistory,
          ...getMaskStateRedoHistory(),
        ]);

        if (lastHistory.status === ObjectStatus.ADD) {
          const objectToRemove = canvas.getObjects().filter((obj) => obj.id === lastHistory.id);
          canvas.remove(...objectToRemove);
          canvas.renderAll();
        }
        else if (lastHistory.status === ObjectStatus.DELETE) {
          loadState(lastHistory);
        }
        else {
          loadState(previousState[previousState.length - 1]);
        }
      }
    }
    else if (layerHistory.length > 1 && !isToolActive(TOOLS.REDRAW.id)) {
      const previousState = layerHistory.slice(0, -1);
      const lastHistory = layerHistory[layerHistory.length - 1];

      setLayerState(activeLayer, activeImageIndex, previousState);
      setLayerRedoState(activeLayer, activeImageIndex, [
        lastHistory,
        ...getLayerStateRedoHistory(),
      ]);

      if (lastHistory.status === ObjectStatus.ADD) {
        const objectToRemove = canvas.getObjects().filter((obj) => obj.id === lastHistory.id);
        canvas.remove(...objectToRemove);
        canvas.renderAll();
      }
      else if (lastHistory.status === ObjectStatus.DELETE) {
        loadState(lastHistory);
      }
      else {
        loadState(previousState[previousState.length - 1]);
      }
    }


  };

  const redo = () => {
    if (!canvas) return;

    const redoCanvasHistory = getLayerStateRedoHistory();
    const redoMaskHistory = getMaskStateRedoHistory();

    if (activeLayer === LAYERS.CLEANUP.id && isToolActive(TOOLS.REDRAW.id) && redoMaskHistory.length > 0) {
      const nextState = redoMaskHistory[0];
      const newRedoHistory = redoMaskHistory.slice(1);

      const newHistory = [...getMaskStateHistory(), nextState];
      setMaskLayerState(activeLayer, activeImageIndex, newHistory);
      setMaskLayerRedoState(activeLayer, activeImageIndex, newRedoHistory);

      if (nextState.status === ObjectStatus.ADD) {
        loadState(nextState);
      } else if (nextState.status === ObjectStatus.DELETE) {
        loadState(nextState);
      } else {
        loadState(nextState);
      }
    }
    else if (redoCanvasHistory.length > 0 && !isToolActive(TOOLS.REDRAW.id)) {
      const nextState = redoCanvasHistory[0];
      const newRedoHistory = redoCanvasHistory.slice(1);

      const newHistory = [...getLayerStateHistory(), nextState];
      setLayerState(activeLayer, activeImageIndex, newHistory);
      setLayerRedoState(activeLayer, activeImageIndex, newRedoHistory);

      if (nextState.status === ObjectStatus.ADD) {
        loadState(nextState);
      } else if (nextState.status === ObjectStatus.DELETE) {
        loadState(nextState);
      } else {
        loadState(nextState);
      }
    }
  };

  return {
    saveState,
    undo,
    redo,
  };
};

export default useLayerHistory;
