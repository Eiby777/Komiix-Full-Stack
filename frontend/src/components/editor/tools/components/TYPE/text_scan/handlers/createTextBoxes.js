import { configTextObject } from "../../text/handlers/textObjectHandlers";
import { cleanText as handleCleanText } from "../../../../handlers/calculateTextCoordinates";
import { v4 as uuidv4 } from "uuid";
import ObjectStatus from "../../../../../floating-menus/components/UndoRedoMenu/handlers/enumObjectRequests";

const createTextBoxes = (result, canvasInstances, colorToTypeTextMap, saveState) => {
  const idArrays = Array(result.length).fill().map(() => []);

  const processCanvas = (canvasIndex, detections) => {
    const canvas = canvasInstances[canvasIndex];
    if (!canvas) return;

    const bgObj = canvas.getObjects().find((obj) => obj.backgroundImage);
    if (!bgObj) return;

    const ids = new Set();
    const canvasIds = [];

    if (!detections || detections.length === 0) {
      idArrays[canvasIndex] = canvasIds;
      return;
    }

    canvas.requestRenderAll();

    detections.forEach((det) => {
      const id = uuidv4();
      if (ids.has(id)) {
        console.warn(`Duplicate ID detected: ${id}`);
        return;
      }
      ids.add(id);
      canvasIds.push(id);

      const detectedText = det.reorderedText === "same" ? det.originalText : det.reorderedText;
      const detectedTranslatedText = det.translatedText;
      const cleanText = handleCleanText(detectedText);
      const cleanTranslatedText = handleCleanText(detectedTranslatedText);
      const typeText = colorToTypeTextMap[det.color];

      const textObject = configTextObject(
        {
          left: det.left,
          top: det.top,
          width: det.width,
          height: null,
        },
        canvas,
        "#000000",
        id
      );
      textObject.set({ 
        text: cleanTranslatedText || cleanText, 
        originalText: cleanText,
        translatedText: cleanTranslatedText,
        textAlign: "center",
        fontSize: det.fontSize,
        typeText: typeText || 'Ninguno',
       });

      canvas.add(textObject);
      canvas.bringObjectToFront(textObject);
      textObject.setCoords();
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      saveState(textObject, ObjectStatus.ADD);
      canvas.renderAll();
    });

    idArrays[canvasIndex] = canvasIds;
  };

  result.forEach((canvasResults, index) => {
    processCanvas(index, canvasResults);
  });

  return idArrays;
};

export default createTextBoxes;