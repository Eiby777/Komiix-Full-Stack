import fabric from "../../../../../../../constants/fabricInstance";
import { v4 as uuidv4 } from "uuid";
import ObjectStatus from "../../../../../floating-menus/components/UndoRedoMenu/handlers/enumObjectRequests";


export const processCanvas = async (canvasIndex, resultDataUrl, canvasInstances, saveState) => {
  const canvas = canvasInstances[canvasIndex];
  if (!canvas || !resultDataUrl) return;
  

  const bgObj = canvas.getObjects().find((obj) => obj.backgroundImage);
  if (!bgObj) return;

  const { width, height } = bgObj;
  const imgWidth = width * bgObj.scaleX;
  const imgHeight = height * bgObj.scaleY;

  const canvasCenterX = canvas.width / 2;
  const canvasCenterY = canvas.height / 2;
  const imgLeft = canvasCenterX - imgWidth / 2;
  const imgTop = canvasCenterY - imgHeight / 2;

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = imgWidth;
  tempCanvas.height = imgHeight;
  const tempCtx = tempCanvas.getContext("2d");

  const img = await fabric.FabricImage.fromURL(resultDataUrl);
  tempCtx.drawImage(img.getElement(), 0, 0, imgWidth, imgHeight);

  const maskObjects = canvas
    .getObjects()
    .filter((obj) => obj.layer === "mask");

  for (const maskObj of maskObjects) {
    const maskLeft = maskObj.left - imgLeft;
    const maskTop = maskObj.top - imgTop;
    const maskWidth = maskObj.width * maskObj.scaleX;
    const maskHeight = maskObj.height * maskObj.scaleY;

    const croppedCanvas = document.createElement("canvas");
    croppedCanvas.width = maskWidth;
    croppedCanvas.height = maskHeight;
    const croppedCtx = croppedCanvas.getContext("2d");

    croppedCtx.drawImage(
      tempCanvas,
      maskLeft,
      maskTop,
      maskWidth,
      maskHeight,
      0,
      0,
      maskWidth,
      maskHeight
    );

    const croppedDataUrl = croppedCanvas.toDataURL();
    const fabricImg = await fabric.FabricImage.fromURL(croppedDataUrl);

    const absoluteLeft = imgLeft + maskLeft;
    const absoluteTop = imgTop + maskTop;

    fabricImg.set({
      left: absoluteLeft,
      top: absoluteTop,
      scaleX: 1,
      scaleY: 1,
      width: maskWidth,
      height: maskHeight,
      layer: "cleanup",
      selectable: false,
      evented: true,
      originX: "left",
      originY: "top",
      src: croppedDataUrl,
      id: uuidv4(),
    });

    canvas.add(fabricImg);
    saveState(fabricImg, ObjectStatus.ADD);
  }

  canvas.requestRenderAll();
};