import createRectangleObject from "../../rectangle/createRectangleObject";
import { v4 as uuidv4 } from "uuid";
import { LAYERS } from "../../../../../../../constants/layers";

const globesIndex = {
    0: "normal",
    1: "scream",
    2: "touched",
    3: "think",
    4: "sentence",
};

const combineDetections = (dataGlobe, dataText) => {
    const combined = {};

    if (!dataGlobe && !dataText) {
        console.warn("No detection data provided.");
        return combined;
    }

    const processDetections = (data, typeFn) => {
        if (!data || typeof data !== "object") return;
        Object.entries(data).forEach(([key, value]) => {
            const detections = value?.detections || [];
            combined[key] = combined[key] || { detections: [] };
            combined[key].detections.push(
                ...detections.map((det) => ({
                    ...det,
                    type: typeFn(det),
                }))
            );
        });
    };

    processDetections(dataGlobe, (det) => globesIndex[det.class] || "normal");
    processDetections(dataText, () => "text");

    return combined;
};

const processCanvas = (
    canvasIndex, 
    detections,
    canvasInstances,
    getColorFromType,
    setCanvasObjectStatus
) => {
    const canvas = canvasInstances[canvasIndex];
    if (!canvas) {
        console.warn(`Canvas instance for index ${canvasIndex} not found.`);
        return;
    }

    const bgObj = canvas.getObjects().find((obj) => obj.backgroundImage);
    if (!bgObj) {
        console.warn(`Background image not found for canvas index ${canvasIndex}.`);
        return;
    }

    const { width, height, left, top } = bgObj;
    const imgWidth = width * bgObj.scaleX;
    const imgHeight = height * bgObj.scaleY;

    detections.forEach((det) => {
        const [x, y, w, h] = det.bbox;
        const pixelWidth = w * imgWidth;
        const pixelHeight = h * imgHeight;
        const pixelLeft = x * imgWidth - pixelWidth / 2;
        const pixelTop = y * imgHeight - pixelHeight / 2;
        const adjustedLeft = left - imgWidth / 2 + pixelLeft;
        const adjustedTop = top - imgHeight / 2 + pixelTop;

        const color = getColorFromType(det.type);
        const rect = createRectangleObject(
            adjustedLeft,
            adjustedTop,
            color,
            pixelWidth,
            pixelHeight
        );

        const annotationId = uuidv4();
        rect.set({
            layer: LAYERS.ANNOTATION.id,
            id: annotationId,
        });

        canvas.add(rect);
        rect.setCoords();
    });

    canvas.requestRenderAll();
    setCanvasObjectStatus(canvasIndex, true);
};

export { combineDetections, processCanvas };