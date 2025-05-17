import { useEffect, useState, useRef } from "react";
import { useEditorStore } from "../../../../../../stores/editorStore";
import { TOOLS } from "../../../../../../constants/tools";
import LoadingRedraw from "./components/LoadingRedraw";
import SolidBrush from "./components/SolidBrush";
import { createBrushCursor } from "./components/brushCursor";
import { processCanvas } from "./components/canvasProcessor";
import { getCanvasMaskData } from "./components/maskHandler";
import { arrayBufferToBase64 } from "./components/utils";
import { getProjectImages } from "../../../../../../lib/localDB/projectDB";
import { getAllModels, getModel } from "../../../../../../lib/localDB/modelDB";
import runInpainting from "./inference/runInpainting";
import { getUser } from "../../../../../../hooks/useAuth";
import createMaskOverlay from "./handlers/createMaskOverlay";
import useLayerHistory from "../../../../canvas/UndoRedoMenu/handlers/fabricHistoryManager";
import { useParams } from "react-router-dom";

// Constants for canvas configuration

const MASK_LAYER = "mask";

const DEFAULT_CURSOR = "default";
const WHITE_COLOR = "#FFFFFF";

const RedrawTool = ({ currentImageIndex }) => {
  const {
    toggleTool,
    canvasInstances,
    selectedRedrawSize,
    getAllCanvasInstances,
    shouldRedraw,
    setShouldRedraw,
    shouldRedrawCurrent,
    setShouldRedrawCurrent,
    activeTools,
    getZoomLevel,
    minZoom,
    resetActiveTools
  } = useEditorStore();

  const { saveState } = useLayerHistory();

  const { projectId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState({ initialized: false });
  const [noMasksFound, setNoMasksFound] = useState(false);
  const hasProcessed = useRef(false);

  const isToolActive = activeTools.includes(TOOLS.REDRAW?.id || "redraw");

  // Initialize mask overlay for the canvas


  // Handle drawing, cursor setup, and opacity management
  useEffect(() => {
    const canvas = getAllCanvasInstances()[currentImageIndex];
    if (!canvas || !canvas.upperCanvasEl) return;

    // On mount: Set opacity to 1 for mask layer objects
    canvas.forEachObject((obj) => {
      if (obj.layer === MASK_LAYER) {
        obj.set({ opacity: 1 });
      }
    });
    canvas.requestRenderAll();

    if (!isToolActive) {
      canvas.isDrawingMode = false;
      canvas.freeDrawingBrush = null;
      canvas.upperCanvasEl.style.cursor = DEFAULT_CURSOR;
      return;
    }

    // Set up drawing mode
    canvas.isDrawingMode = true;
    const minimumZoom = Array.isArray(minZoom) && minZoom.length > 0 ? Math.min(...minZoom) : 1;
    const currentZoom = getZoomLevel(currentImageIndex) || 1;

    // Add mask overlay if not present
    let maskOverlay = canvas.getObjects().find((obj) => obj.isMaskOverlay);
    if (!maskOverlay) {
      maskOverlay = createMaskOverlay(canvas, minimumZoom);
      canvas.add(maskOverlay);
      canvas.getObjects().forEach((obj) => {
        if (obj.layer === MASK_LAYER) { canvas.bringObjectToFront(obj); }
      });
      canvas.requestRenderAll();
    }

    // Configure brush and cursor
    canvas.freeDrawingBrush = new SolidBrush(canvas, {
      width: selectedRedrawSize,
      color: WHITE_COLOR,
      zoomLevel: currentZoom,
      maskId: MASK_LAYER,
    }, saveState);

    const cursor = createBrushCursor(selectedRedrawSize);
    const cursorStyle = `url(${cursor.dataURL}) ${cursor.hotspotX} ${cursor.hotspotY}, auto`;
    canvas.freeDrawingCursor = cursorStyle;
    canvas.hoverCursor = cursorStyle;
    canvas.upperCanvasEl.style.cursor = cursorStyle;

    // Update brush on zoom change
    const handleZoomUpdate = () => {
      if (!isToolActive || !canvas) return;
      const zoom = getZoomLevel(currentImageIndex) || 1;
      if (canvas.freeDrawingBrush?.setZoomLevel) {
        canvas.freeDrawingBrush.setZoomLevel(zoom);
      }
      canvas.requestRenderAll();
    };

    canvas.on("mouse:wheel", handleZoomUpdate);
    canvas.on("zoom:changed", handleZoomUpdate);

    // Cleanup: On unmount, set opacity to 0 for mask layer objects and clean up canvas
    return () => {
      canvas.forEachObject((obj) => {
        if (obj.layer === MASK_LAYER) {
          obj.set({ opacity: 0 });
        }
      });
      canvas.requestRenderAll();

      canvas.isDrawingMode = false;
      canvas.freeDrawingBrush = null;
      canvas.upperCanvasEl.style.cursor = DEFAULT_CURSOR;

      const maskOverlay = canvas.getObjects().find((obj) => obj.isMaskOverlay);
      if (maskOverlay) {
        canvas.remove(maskOverlay);
      }

      canvas.off("mouse:wheel", handleZoomUpdate);
      canvas.off("zoom:changed", handleZoomUpdate);
    };
  }, [selectedRedrawSize, currentImageIndex, getAllCanvasInstances, isToolActive, getZoomLevel, minZoom]);

  // Process images for inpainting
  const processImagesForInpainting = async (canvasToProcess) => {
    try {
      const user = await getUser();
      if (!user) {
        throw new Error("User not found");
      }

      const images = await getProjectImages(projectId, user.id);
      if (!images || images.length === 0) {
        throw new Error("Images not found");
      }

      const inpaintingModel = await getModel("inpainting");
      const inpaintingArrayBuffer = inpaintingModel ? await inpaintingModel.modelData.data : null;
      if (!inpaintingArrayBuffer) {
        throw new Error("Inpainting model not found in localDB");
      }

      const getMaskIndex = (index) => (shouldRedrawCurrent ? currentImageIndex : index);
      const masks = canvasToProcess.map((canvas, index) =>
        getCanvasMaskData(getMaskIndex(index), canvasInstances)
      );

      if (masks.every((mask) => !mask?.mask64)) {
        setNoMasksFound(true);
        return;
      }

      const getImageIndex = (index) => (shouldRedrawCurrent ? currentImageIndex : index);
      const imagesArray = canvasToProcess.map((canvas, index) => {
        const maskData = masks[index];
        const imageIndex = getImageIndex(index);
        const image = images[imageIndex];
        return {
          image: arrayBufferToBase64(image.image),
          mask: maskData?.mask64 || null,
          positions: maskData?.positions || null,
          filename: `${imageIndex}.png`,
        };
      });

      const totalValidImages = imagesArray.filter((img) => img.mask !== null).length;
      setProgress({ initialized: false, totalImages: totalValidImages, completedImages: 0 });

      const progressCallback = ({ filename, completedImages }) => {
        setProgress((prev) => ({
          ...prev,
          initialized: true,
          totalImages: totalValidImages,
          completedImages: completedImages || 0,
          [filename]: { processed: true },
        }));
      };

      const results = await runInpainting(imagesArray, inpaintingArrayBuffer, progressCallback);

      results.forEach(({ filename, output }) => {
        const canvasIndex = parseInt(filename.split(".")[0]);
        processCanvas(canvasIndex, output, canvasInstances, saveState);
      });

      setIsLoading(false);
      setShouldRedraw(false);
      setShouldRedrawCurrent(false);
      hasProcessed.current = true;
      resetActiveTools();
    } catch (error) {
      console.error("Inpainting error:", error);
      if (!noMasksFound) {
        setIsLoading(false);
        setShouldRedraw(false);
        hasProcessed.current = true;
        resetActiveTools();
      }
    }
  };

  // Handle redraw process
  useEffect(() => {
    if (!shouldRedraw) return;

    const canvasToProcess = shouldRedrawCurrent ? [canvasInstances[currentImageIndex]] : canvasInstances;
    setIsLoading(true);
    setProgress({ initialized: true, current: 0, total: canvasToProcess.length });

    processImagesForInpainting(canvasToProcess);
  }, [shouldRedraw, canvasInstances, currentImageIndex, shouldRedrawCurrent]);

  // Close loading state and reset
  const handleClose = () => {
    setIsLoading(false);
    setNoMasksFound(false);
    setShouldRedraw(false);
    hasProcessed.current = true;
    resetActiveTools();
  };

  return isLoading ? (
    <LoadingRedraw progress={progress} noMasksFound={noMasksFound} onClose={handleClose} />
  ) : null;
};

export default RedrawTool;