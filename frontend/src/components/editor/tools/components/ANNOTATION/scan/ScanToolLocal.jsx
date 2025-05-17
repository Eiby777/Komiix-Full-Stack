import { useEffect, useState, useRef } from "react";
import { useEditorStore } from "../../../../../../stores/editorStore";
import { LAYERS } from "../../../../../../constants/layers";
import { TOOLS } from "../../../../../../constants/tools";
import LoadingScan from "./components/LoadingScan";
import { getProjectImages } from "../../../../../../lib/localDB/projectDB";
import { getUser } from "../../../../../../hooks/useAuth";
import LoadingOverlay from "./components/LoadingOverlay";
import { combineDetections, processCanvas } from "./handlers/handlePostProcess";
import { arrayBufferToBase64 } from "./handlers/handlePreprocess";
import {fetchDetections} from "./handlers/handleDetections";

const ScanTool = () => {
  const {
    toggleTool,
    setActiveLayer,
    canvasInstances,
    getColorFromType,
    getCanvasInstance,
    setCanvasObjectStatus,
    activeTools,
    projectId,
    activeImageIndex
  } = useEditorStore();
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [progress, setProgress] = useState([]);
  const prevActiveToolsRef = useRef([]);

  const getProjectId = () => projectId || window.location.pathname.split("/").pop();

  const scanImages = async (scanOption) => {
    try {
      setLoading(true);
      setProgress([]);

      const projectId = getProjectId();
      const user = await getUser();
      const images = await getProjectImages(projectId, user.id);

      let payload = [];
      if (scanOption === "current") {
        const currentImage = images.find(img => img.index === activeImageIndex);
        if (currentImage) {
          payload.push({
            image_buffer: arrayBufferToBase64(currentImage.image),
            filename: `${currentImage.index}.webp`,
          });
        }
      } else {
        payload = images.reduce((acc, { image, index }) => {
          acc.push({
            image_buffer: arrayBufferToBase64(image),
            filename: `${index}.webp`,
          });
          return acc;
        }, []);
      }

      if (payload.length === 0) {
        throw new Error("No images available to scan.");
      }

      const { globes: dataGlobe, text: dataText } = await fetchDetections(
        payload,
        (update) => {
          setProgress((prev) => {
            const existingIndex = prev.findIndex(p => p.filename === update.filename && p.workerId === update.workerId);
            if (existingIndex >= 0) {
              const newProgress = [...prev];
              newProgress[existingIndex] = update;
              return newProgress;
            }
            return [...prev, update];
          });
        }
      );
      let combinedResponse = combineDetections(dataGlobe, dataText);

      if (scanOption === "current" && Object.keys(combinedResponse).length > 0) {
        const remappedResponse = {};
        Object.entries(combinedResponse).forEach(([key, value]) => {
          remappedResponse[activeImageIndex] = value;
        });
        combinedResponse = remappedResponse;
      }

      Object.entries(combinedResponse).forEach(([key, { detections }]) =>
        processCanvas(
          parseInt(key),
          detections,
          canvasInstances,
          getColorFromType,
          setCanvasObjectStatus
        )
      );

      toggleTool(TOOLS.RECTANGLE.id);
      setActiveLayer(LAYERS.ANNOTATION.id);
    } catch (error) {
      console.error(
        "Oh no! The scanning process failed. Please check your images or try again later.",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const wasScanInactive = !prevActiveToolsRef.current.includes(TOOLS.SCAN.id);
    const isScanActive = activeTools.includes(TOOLS.SCAN.id);

    if (wasScanInactive && isScanActive) {
      setShowWarning(true);
    }

    prevActiveToolsRef.current = [...activeTools];

    return () => {
      Object.keys(canvasInstances).forEach((index) => {
        const canvas = getCanvasInstance(parseInt(index));
        if (canvas) {
          const canvasObjects = canvas.getObjects();
          setCanvasObjectStatus(parseInt(index), canvasObjects.length > 1);
        }
      });
    };
  }, [activeTools, toggleTool, setActiveLayer, canvasInstances, getCanvasInstance, setCanvasObjectStatus]);

  return (
    <>
      {showWarning && (
        <LoadingOverlay
          setShowWarning={setShowWarning}
          toggleTool={toggleTool}
          scanImages={scanImages}
        />
      )}
      {loading && <LoadingScan progress={progress} />}
    </>
  );
};

export default ScanTool;