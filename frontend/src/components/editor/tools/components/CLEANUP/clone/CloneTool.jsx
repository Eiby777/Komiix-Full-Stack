import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useEditorStore } from "../../../../../../stores/editorStore";
import { TOOLS } from "../../../../../../constants/tools";
import fabric from "../../../../../../constants/fabricInstance";
import CloneBrush from "./CloneBrush";
import { LAYERS } from "../../../../../../constants/layers";
import { v4 as uuidv4 } from "uuid";
import ObjectStatus from "../../../../floating-menus/components/UndoRedoMenu/handlers/enumObjectRequests";
import useLayerHistory from "../../../../floating-menus/components/UndoRedoMenu/handlers/fabricHistoryManager";

const createCloneCursor = (size, cloneCursor) => {
  const maxCanvasSize = 128;
  const desiredCanvasSize = size;

  let canvasSize = Math.min(desiredCanvasSize, maxCanvasSize);
  const scaleFactor = canvasSize / desiredCanvasSize;

  const cursorCanvas = document.createElement("canvas");
  cursorCanvas.width = canvasSize;
  cursorCanvas.height = canvasSize;
  const ctx = cursorCanvas.getContext("2d");

  ctx.scale(scaleFactor, scaleFactor);

  const centerX = desiredCanvasSize / 2;
  const centerY = desiredCanvasSize / 2;
  const radius = size / 2;

  ctx.clearRect(0, 0, canvasSize, canvasSize);

  if (cloneCursor) {
    const img = new Image();
    img.src = cloneCursor;
    return new Promise((resolve) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, desiredCanvasSize, desiredCanvasSize);
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 3 / scaleFactor;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1 / scaleFactor;
        ctx.stroke();

        const hotspot = canvasSize / 2;
        resolve({
          dataURL: cursorCanvas.toDataURL(),
          hotspotX: hotspot,
          hotspotY: hotspot,
        });
      };
    });
  } else {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 3 / scaleFactor;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1 / scaleFactor;
    ctx.stroke();

    const xSize = radius * 0.8;
    
    ctx.beginPath();
    ctx.moveTo(centerX - xSize, centerY - xSize);
    ctx.lineTo(centerX + xSize, centerY + xSize);
    ctx.moveTo(centerX + xSize, centerY - xSize);
    ctx.lineTo(centerX - xSize, centerY + xSize);
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 3 / scaleFactor;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX - xSize, centerY - xSize);
    ctx.lineTo(centerX + xSize, centerY + xSize);
    ctx.moveTo(centerX + xSize, centerY - xSize);
    ctx.lineTo(centerX - xSize, centerY + xSize);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1 / scaleFactor;
    ctx.stroke();

    const hotspot = canvasSize / 2;
    return Promise.resolve({
      dataURL: cursorCanvas.toDataURL(),
      hotspotX: hotspot,
      hotspotY: hotspot,
    });
  }
};

const isFullyTransparent = (dataURL) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = dataURL;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 3; i < data.length; i += 4) {
        if (data[i] !== 0) {
          resolve(false);
          return;
        }
      }
      resolve(true);
    };
    img.onerror = () => resolve(true);
  });
};

const CloneTool = ({ currentImageIndex }) => {
  const {
    activeTools,
    getCanvasInstance,
    selectedCloneSize,
    selectedCloneHardness,
    getZoomLevel
  } = useEditorStore();

  const { saveState } = useLayerHistory();

  const isActive = activeTools.includes(TOOLS.CLONE.id);
  const canvas = getCanvasInstance(currentImageIndex);
  const [cloneCursor, setCloneCursor] = useState(null);

  let canvasImage = null;

  const updateCanvasImage = () => {
    return new Promise((resolve, reject) => {
      if (!canvas) return reject("Canvas no disponible");

      const backgroundImageObject = canvas
        .getObjects()
        .find((obj) => obj?.backgroundImage);
      if (!backgroundImageObject || !backgroundImageObject._element) {
        return reject("No background image");
      }

      const backgroundImageCanvas = document.createElement("canvas");
      const ctx = backgroundImageCanvas.getContext("2d");
      backgroundImageCanvas.width = backgroundImageObject.width;
      backgroundImageCanvas.height = backgroundImageObject.height;

      const img = new Image();
      img.crossOrigin = "anonymous";
      const src = backgroundImageObject._element.src;
      if (!src) return reject("No valid src");

      img.onload = () => {
        ctx.drawImage(img, 0, 0, backgroundImageObject.width, backgroundImageObject.height);
        canvasImage = backgroundImageCanvas;
        resolve(backgroundImageCanvas);
      };
      img.onerror = (error) => reject(error);
      img.src = src;
    });
  };

  const resetCloneState = async () => {
    setCloneCursor(null);
    if (canvas?.freeDrawingBrush) {
      canvas.freeDrawingBrush.setCloneSource(null);
    }
    const defaultCursor = await createCloneCursor(selectedCloneSize, null);
    if (canvas) {
      const cursorStyle = `url(${defaultCursor.dataURL}) ${defaultCursor.hotspotX} ${defaultCursor.hotspotY}, auto`;
      canvas.freeDrawingCursor = cursorStyle;
      canvas.hoverCursor = cursorStyle;
      canvas.upperCanvasEl.style.cursor = cursorStyle;
    }
  };

  const updateCursor = async () => {
    const cursor = await createCloneCursor(selectedCloneSize, cloneCursor);
    if (canvas && isActive) {
      const cursorStyle = `url(${cursor.dataURL}) ${cursor.hotspotX} ${cursor.hotspotY}, auto`;
      canvas.freeDrawingCursor = cursorStyle;
      canvas.hoverCursor = cursorStyle;
      canvas.upperCanvasEl.style.cursor = cursorStyle;
    }
  };

  useEffect(() => {
    if (!canvas) return;

    let isMounted = true;

    const initialize = async () => {
      try {
        await updateCanvasImage();
        if (!isMounted || !isActive) return;

        canvas.isDrawingMode = true;
        const currentZoom = getZoomLevel(currentImageIndex) || 1;

        if (!(canvas.freeDrawingBrush instanceof CloneBrush)) {
          canvas.freeDrawingBrush = new CloneBrush(canvas, {
            width: selectedCloneSize,
            hardness: selectedCloneHardness / 100,
            zoomLevel: currentZoom,
          });
        }

        // Initial cursor setup
        await updateCursor();

        const handleCtrlClick = async (options) => {
          if (options.e.ctrlKey) {
            const pointer = canvas.getPointer(options.e);
            await cloneSection(pointer);
            await updateCursor(); // Update cursor immediately after cloning
          } else if (cloneCursor) {
            await drawClone(options.e);
          }
        };

        canvas.on("mouse:down", handleCtrlClick);

        const updateBrushOnZoom = async () => {
          if (!isActive || !canvas) return;
          
          await resetCloneState();
          
          const newZoom = getZoomLevel(currentImageIndex) || 1;
          if (canvas.freeDrawingBrush && canvas.freeDrawingBrush.setZoomLevel) {
            canvas.freeDrawingBrush.setZoomLevel(newZoom);
          }
        };

        canvas.on("mouse:wheel", updateBrushOnZoom);
        canvas.on("zoom:changed", updateBrushOnZoom);
      } catch (error) {
        console.error("Error initializing CloneTool:", error);
      }
    };

    if (isActive) {
      initialize();
    } else {
      canvas.isDrawingMode = false;
      canvas.freeDrawingBrush = null;
      canvas.upperCanvasEl.style.cursor = "default";
      resetCloneState();
    }

    // Update cursor when cloneCursor changes
    if (cloneCursor !== null) {
      updateCursor();
    }

  return () => {
    isMounted = false;
    canvas.off("mouse:down");
    canvas.off("mouse:wheel");
    canvas.off("zoom:changed");
    canvas.isDrawingMode = false;
    canvas.freeDrawingBrush = null;
    canvas.upperCanvasEl.style.cursor = "default";
  };
  }, [isActive, canvas, selectedCloneSize, selectedCloneHardness, cloneCursor, currentImageIndex]);

  const calculateRelativePointer = () => {
    if (!canvas || !canvasImage) {
      return null;
    }

    const canvasCenter = {
      x: canvas.width / 2,
      y: canvas.height / 2,
    };
    const relativeImage = {
      left: canvasCenter.x - canvasImage.width / 2,
      top: canvasCenter.y - canvasImage.height / 2,
    };
    return relativeImage;
  };

  const cloneSection = async (pointer) => {
    if (!canvasImage) {
      return;
    }

    const relativeImage = calculateRelativePointer();
    if (!relativeImage) return;

    const zoomLevel = getZoomLevel(currentImageIndex) || 1;
    const size = selectedCloneSize / zoomLevel;

    const transformedPointer = {
      x: pointer.x - relativeImage.left,
      y: pointer.y - relativeImage.top,
    };

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvasImage.width;
    tempCanvas.height = canvasImage.height;
    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.drawImage(canvasImage, 0, 0);

    const sx = transformedPointer.x - size / 2;
    const sy = transformedPointer.y - size / 2;

    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    const offCtx = offscreenCanvas.getContext("2d");

    offCtx.drawImage(tempCanvas, sx, sy, size, size, 0, 0, size, size);

    offCtx.globalCompositeOperation = "destination-in";
    offCtx.beginPath();
    offCtx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    offCtx.closePath();

    const hardness = selectedCloneHardness;
    if (hardness === 100) {
      offCtx.fill();
    } else {
      const innerRadius = (hardness / 100) * (size / 2);
      const gradient = offCtx.createRadialGradient(
        size / 2,
        size / 2,
        innerRadius,
        size / 2,
        size / 2,
        size / 2
      );
      gradient.addColorStop(0, "rgba(0,0,0,1)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      offCtx.fillStyle = gradient;
      offCtx.fill();
    }
    offCtx.globalCompositeOperation = "source-over";

    const dataURL = offscreenCanvas.toDataURL();
    if (canvas?.freeDrawingBrush) {
      canvas.freeDrawingBrush.setCloneSource(dataURL);
    }
    setCloneCursor(dataURL);
  };

  const drawClone = async (event) => {
    if (!cloneCursor) {
      return;
    }

    const isTransparent = await isFullyTransparent(cloneCursor);
    if (isTransparent) {
      return;
    }

    const pointer = canvas.getPointer(event);
    const zoomLevel = getZoomLevel(currentImageIndex) || 1;
    const adjustedSize = selectedCloneSize / zoomLevel;

    try {
      const img = await fabric.FabricImage.fromURL(cloneCursor);
      img.set({
        left: pointer.x - adjustedSize / 2,
        top: pointer.y - adjustedSize / 2,
        width: adjustedSize,
        height: adjustedSize,
        selectable: false,
        layer: LAYERS.CLEANUP.id,
        id: uuidv4(),
        src: cloneCursor,
      });
      canvas.add(img);
      saveState(img, ObjectStatus.ADD);
      canvas.renderAll();
    } catch (error) {
      console.error("Error in drawClone:", error);
    }
  };

  return null;
};

CloneTool.propTypes = {
  currentImageIndex: PropTypes.number.isRequired,
};

export default CloneTool;
