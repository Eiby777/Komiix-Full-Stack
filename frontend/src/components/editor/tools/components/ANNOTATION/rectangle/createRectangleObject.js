import fabric from "../../../../../../constants/fabricInstance";
import { LAYERS } from "../../../../../../constants/layers";
const createRectangleObject = (left, top, color, width = 0, height = 0) => {
  return new fabric.Rect({
    left,
    top,
    width: width || 0,
    height: height || 0,
    stroke: color,
    strokeWidth: 3,
    fill: "rgba(0,0,0,0)",
    selectable: true,
    layer: LAYERS.ANNOTATION.id,
    hasBorders: true,
    hasControls: true,
    lockRotation: true,
    transparentCorners: false,
    cornerColor: color,
    cornerSize: 8,
    cornerStyle: "circle",
    objectCaching: false,
    padding: 2,
    originX: "left", // Asegurar origen correcto
    originY: "top",
  });
};

export default createRectangleObject;
