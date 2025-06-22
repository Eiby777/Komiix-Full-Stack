import fabric from "../../../../../../../constants/fabricInstance";
import { LAYERS } from "../../../../../../../constants/layers";
import { v4 as uuidv4 } from "uuid";

/**
 * Creates a new fabric.Textbox instance with configured properties
 * @param {number} left - Horizontal position of text box
 * @param {number} top - Vertical position of text box 
 * @param {string} color - Text color (hex format)
 * @param {number|null} [width=null] - Optional width of text box
 * @param {number|null} [height=null] - Optional height of text box
 * @param {string} [id] - Optional unique identifier for the text box
 * @returns {fabric.Textbox} Configured text box object
 */
const createTextBoxObject = ({ left, top, width = null, height = null }, color, id, obj = null) => {
  return new fabric.Textbox("Escribe aquí", {
    left: left,
    top: top,
    width: width || 100, // Ancho mínimo por defecto
    height: height || null, // Opcional, se ajustará automáticamente por Fabric
    fill: color || "#000000",
    fontFamily: obj?.fontFamily || "Arial",
    fontSize: obj?.fontSize || 24,
    fontWeight: obj?.fontWeight || "bold",
    lineHeight: obj?.lineHeight || 1.16,
    stroke: obj?.stroke || null,
    strokeWidth: obj?.strokeWidth || 0,
    textAlign: obj?.textAlign || "left",
    underline: obj?.underline || false,
    linethrough: obj?.linethrough || false,
    italic: obj?.italic || false,
    uppercase: obj?.uppercase || false,
    lowercase: obj?.lowercase || false,
    editable: true,
    layer: LAYERS.TEXT.id,
    padding: 10,
    id: id || uuidv4(),
    borderColor: "#666666",
    cornerColor: color || "#000000",
    cornerSize: 10,
    cornerStyle: "circle",
    transparentCorners: false,
    borderScaleFactor: 2,
    hasControls: true,
    hasBorders: true,
    selectionBackgroundColor: "rgba(100,100,100,0.2)",
    lockScalingFlip: true,
    scaleX: 1,
    scaleY: 1,
    lockUniScaling: false,
    lockScalingX: false,
    lockScalingY: false,
    perPixelTargetFind: false,
    splitByGrapheme: false,
  });
};


/**
 * Creates and configures a text object on canvas with event handlers
 * @param {Object} coords - Position and dimensions
 * @param {number} coords.left - Horizontal position
 * @param {number} coords.top - Vertical position
 * @param {number} [coords.width] - Optional width
 * @param {number} [coords.height] - Optional height
 * @param {fabric.Canvas} canvas - Fabric.js canvas instance
 * @param {string} color - Text color (hex format)
 * @param {Object} [obj] - Optional object containing additional properties
 * @returns {fabric.Textbox} Configured text object
 */
export const configTextObject = (coords, canvas, color, id, obj = null) => {


  const textObject = createTextBoxObject(
    {
      left: coords.left,
      top: coords.top,
      width: coords.width,
      height: coords.height
    },
    color,
    id,
    obj
  );

  // Manejar el redimensionamiento estilo Photoshop
  textObject.on("scaling", () => {
    const newWidth = textObject.width * textObject.scaleX;
    const newHeight = textObject.height * textObject.scaleY;

    textObject.set({
      width: newWidth,
      height: newHeight,
      scaleX: 1, // Restablecer escala para no afectar fontSize
      scaleY: 1,
    });

    canvas.requestRenderAll();
  });

  // Auto-resize textbox based on content
  textObject.on("text:changed", () => {
    // Calculate optimal width based on text content
    const textLines = textObject.text.split('\n');
    const font = `${textObject.fontWeight || 'normal'} ${textObject.fontSize}px ${textObject.fontFamily}`;
    const maxWidth = Math.max(
      ...textLines.map(line =>
        fabric.util.getLineWidth(line, font)
      )
    );

    const newWidth = Math.max(
      100,
      maxWidth + 20
    );

    textObject.set({ width: newWidth });
    textObject.setCoords();
    canvas.requestRenderAll();
  });

  canvas.setActiveObject(textObject);
  textObject.enterEditing();
  textObject.setSelectionStart(textObject.text.length);
  textObject.setSelectionEnd(textObject.text.length);
  textObject.set({
    cursorWidth: 3,
    cursorColor: '#000000',
    cursorDelay: 0,
    cursorDuration: 1000,
    cursorBlinking: true
  });

  canvas.requestRenderAll();
  return textObject;
};
