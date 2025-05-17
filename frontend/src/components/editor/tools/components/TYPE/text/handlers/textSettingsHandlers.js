
import { useEditorStore } from "../../../../../../../stores/editorStore";
import ObjectStatus from "../../../../../canvas/UndoRedoMenu/handlers/enumObjectRequests";
const { getState } = useEditorStore;


const colorToTypeMap = {
  "gray": "Ninguno",
  "#4a90e2": "Normal",
  "#ff6b6b": "Scream",
  "#9775fa": "Touched",
  "#69db7c": "Think",
  "#ffa94d": "Sentence",
};

const debounce = (func, wait) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
};

const debouncedUpdateTextConfig = debounce((textObject, typeText) => {
  getState().updateTextConfig(textObject, typeText);
}, 1000);

export const updateConfigTypeTexts = (textObject, property, value, typeText) => {
  const { setConfigTypeTexts } = getState();
  if (!textObject || !typeText || typeText === "Ninguno") return;

  setConfigTypeTexts((draft) => {
    if (!draft[typeText]) {
      draft[typeText] = {};
    }
    draft[typeText][property] = value;
  });

  debouncedUpdateTextConfig(textObject, typeText);
};

export const handleFontChange = (font, textObject, fabricCanvas, setFontFamily, saveState) => {
  if (textObject) {
    textObject.set('fontFamily', font);
    textObject.setCoords();
    fabricCanvas.requestRenderAll();
    if (setFontFamily) setFontFamily(font);
    const typeText = textObject.typeText || "Ninguno";
    updateConfigTypeTexts(textObject, 'fontFamily', font, typeText);
    saveState(textObject, ObjectStatus.UPDATE);
  }
};

export const handleSizeChange = (size, textObject, fabricCanvas, setFontSize, saveState) => {
  if (textObject) {
    const parsedSize = parseFloat(size);
    textObject.set('fontSize', parsedSize);
    textObject.setCoords();
    fabricCanvas.requestRenderAll();
    if (setFontSize) setFontSize(size);
    const typeText = textObject.typeText || "Ninguno";
    updateConfigTypeTexts(textObject, 'fontSize', parsedSize,typeText);
    saveState(textObject, ObjectStatus.UPDATE);
  }
};

export const handleLineHeightChange = (lineHeight, textObject, fabricCanvas, setLineHeight, saveState) => {
  if (textObject) {
    const parsedLineHeight = parseFloat(lineHeight);
    textObject.set('lineHeight', parsedLineHeight);
    textObject.setCoords();
    fabricCanvas.requestRenderAll();
    if (setLineHeight) setLineHeight(lineHeight);
    const typeText = textObject.typeText || "Ninguno";
    updateConfigTypeTexts(textObject, 'lineHeight', parsedLineHeight,typeText);
    saveState(textObject, ObjectStatus.UPDATE);
  }
};

export const handleSizeInput = (e, handler, setValue, textObject, fabricCanvas, ) => {
  const value = e.target.value;
  if (/^\d*\.?\d*$/.test(value)) {
    setValue(value);
    handler(value, textObject, fabricCanvas, setValue);
  }
};

export const handleArrowKeys = (e, currentValue, setValue, handler, textObject, fabricCanvas, isFontSize) => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault();
    if (isFontSize) {
      handleFontSizeButtonChange(
        e.key === 'ArrowUp',
        currentValue,
        setValue,
        handler,
        textObject,
        fabricCanvas,
      );
    } else {
      handleLineHeightButtonChange(
        e.key === 'ArrowUp',
        currentValue,
        setValue,
        handler,
        textObject,
        fabricCanvas,
      );
    }
  }
};

export const handleFontSizeButtonChange = (isUp, currentValue, setValue, handler, textObject, fabricCanvas) => {
  const numValue = parseFloat(currentValue) || 16; // Default font size
  let newValue = isUp
    ? (numValue + 1).toString()
    : Math.max(8, numValue - 1).toString();
  
  if (currentValue.includes('.')) {
    const decimalPlaces = currentValue.split('.')[1]?.length || 1;
    newValue = parseFloat(newValue).toFixed(decimalPlaces);
  }
  
  setValue(newValue);
  handler(newValue, textObject, fabricCanvas, setValue);
};
export const handleLineHeightButtonChange = (isUp, currentValue, setValue, handler, textObject, fabricCanvas) => {
  const numValue = parseFloat(currentValue) || 1.0; // Default line height
  const newValue = (isUp
    ? numValue + 0.1
    : Math.max(0.5, numValue - 0.1)).toFixed(1); // Mínimo de 0.5
  
  setValue(newValue);
  handler(newValue, textObject, fabricCanvas, setValue);
};

export const handleStrokeWidthButtonChange = (isUp, currentValue, setValue, handler, textObject, fabricCanvas) => {
  const numValue = parseFloat(currentValue) || 0; // Default stroke width
  const newValue = isUp
    ? (numValue + 1).toString()
    : Math.max(0, numValue - 1).toString();
  
  setValue(newValue);
  handler(newValue, textObject, fabricCanvas, setValue);
};

export const handleFillColorChange = (value, textObject, fabricCanvas, setFillColor, saveState) => {
  if (textObject) {
    setFillColor(value);
    textObject.set('fill', value);
    textObject.setCoords();
    fabricCanvas.requestRenderAll();

    const typeText = Object.keys(colorToTypeMap).find(key => key.toLowerCase() === value.toLowerCase())
      ? colorToTypeMap[Object.keys(colorToTypeMap).find(key => key.toLowerCase() === value.toLowerCase())]
      : textObject.typeText || "Ninguno";

    textObject.set('typeText', typeText);

    fabricCanvas.discardActiveObject();
    fabricCanvas.setActiveObject(textObject);
    fabricCanvas.renderAll();

    updateConfigTypeTexts(textObject, 'fill', value, typeText);
    saveState(textObject, ObjectStatus.UPDATE);
  }
};

export const handleStrokeColorChange = (value, textObject, fabricCanvas, setStrokeColor, hasStroke, saveState) => {
  setStrokeColor(value);
  if (textObject && hasStroke) {
    textObject.set('stroke', value);
    fabricCanvas.requestRenderAll();
    const typeText = textObject.typeText || "Ninguno";
    updateConfigTypeTexts(textObject, 'stroke', value, typeText);
    saveState(textObject, ObjectStatus.UPDATE);
  }
};

export const handleStrokeToggle = (enabled, textObject, fabricCanvas, setHasStroke, strokeColor, saveState) => {
  setHasStroke(enabled);
  if (textObject) {
    textObject.set('stroke', enabled ? strokeColor : null);
    fabricCanvas.renderAll();
    const typeText = textObject.typeText || "Ninguno";
    updateConfigTypeTexts(textObject, 'stroke', enabled ? strokeColor : null, typeText);
    saveState(textObject, ObjectStatus.UPDATE);
  }
};

export const handleStrokeWidthChange = (value, textObject, fabricCanvas, setStrokeWidth, saveState) => {
  if (textObject) {
    const parsedValue = parseFloat(value);
    textObject.set('strokeWidth', parsedValue);
    fabricCanvas.renderAll();
    if (setStrokeWidth) setStrokeWidth(value);
    const typeText = textObject.typeText || "Ninguno";
    updateConfigTypeTexts(textObject, 'strokeWidth', parsedValue, typeText);
    saveState(textObject, ObjectStatus.UPDATE);
  }
};

export const handleRotate = (direction, textObject, fabricCanvas, saveState) => {
  if (textObject) {
    const currentAngle = textObject.angle || 0;
    const remainder = currentAngle % 15;
    const newAngle = direction === 'clockwise'
      ? (currentAngle + (remainder === 0 ? 15 : 15 - remainder)) % 360
      : (currentAngle - (remainder === 0 ? 15 : remainder) + 360) % 360;
    textObject.set('angle', newAngle);
    textObject.setCoords();
    fabricCanvas.renderAll();
    updateConfigTypeTexts(textObject, 'angle', newAngle);
    saveState(textObject, ObjectStatus.UPDATE);
  }
};

export const handleFontStyleChange = (style, isActive, textObject, fabricCanvas, saveState) => {
  if (!textObject) return;

  const styles = {
    bold: { fontWeight: isActive ? 'bold' : 'normal' },
    italic: { fontStyle: isActive ? 'italic' : 'normal' },
    underline: { underline: isActive },
    strikethrough: { linethrough: isActive },
  };

  textObject.set(styles[style]);
  textObject.setCoords();
  fabricCanvas.requestRenderAll();
  const typeText = textObject.typeText || "Ninguno";
  updateConfigTypeTexts(textObject, style, isActive, typeText);
  saveState(textObject, ObjectStatus.UPDATE);
};

export const handleAlignmentChange = (alignment, textObject, fabricCanvas, saveState) => {
  if (textObject) {
    textObject.set('textAlign', alignment);
    textObject.setCoords();
    fabricCanvas.requestRenderAll();
    const typeText = textObject.typeText || "Ninguno";
    updateConfigTypeTexts(textObject, 'textAlign', alignment, typeText);
    saveState(textObject, ObjectStatus.UPDATE);
  }
};

export const handleUppercase = (textObject, fabricCanvas, setUppercase, setLowercase, uppercase, saveState) => {
  if (textObject) {
    setUppercase(!uppercase);
    setLowercase(false);
    textObject.set({
      text: textObject.text.toUpperCase(),
      translatedText: textObject.translatedText ? textObject.translatedText.toUpperCase() : null,
      uppercase: !uppercase,
      lowercase: false
    });
    textObject.setCoords();
    fabricCanvas.requestRenderAll();
    const typeText = textObject.typeText || "Ninguno";
    updateConfigTypeTexts(textObject, 'uppercase', textObject.text, typeText);
    saveState(textObject, ObjectStatus.UPDATE);
  }
};

export const handleLowercase = (textObject, fabricCanvas, setLowercase, setUppercase, lowercase, saveState) => {
  if (textObject) {
    setLowercase(!lowercase);
    setUppercase(false);
    textObject.set({
      text: textObject.text.toLowerCase(),
      translatedText: textObject.translatedText ? textObject.translatedText.toLowerCase() : null,
      uppercase: false,
      lowercase: !lowercase
    });
    textObject.setCoords();
    fabricCanvas.requestRenderAll();
    const typeText = textObject.typeText || "Ninguno";
    updateConfigTypeTexts(textObject, 'lowercase', textObject.text, typeText);
    saveState(textObject, ObjectStatus.UPDATE);
  }
};
