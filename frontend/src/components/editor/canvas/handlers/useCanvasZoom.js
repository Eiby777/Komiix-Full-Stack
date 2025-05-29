import { useEffect } from "react";
import { useEditorStore } from "../../../../stores/editorStore";
import fabric from "../../../../constants/fabricInstance";


export const useCanvasZoom = () => {
  const {
    zoomLevel,
    maxZoom,
    zoomStep,
    setZoomLevel,
    activeImageIndex,
    getCanvasInstance,
    getMinZoom,
  } = useEditorStore();

  const containerRef = document.getElementById("div_editor");

  // Función para obtener el canvas activo
  const getActiveCanvas = () => {
    const canvas = getCanvasInstance(activeImageIndex);

    if (!canvas) {
      console.warn(
        "No se encontró un canvas activo para el índice:",
        activeImageIndex
      );
    }
    return canvas;
  };

  // Función para obtener el minZoom actual
  const getCurrentMinZoom = () => getMinZoom(activeImageIndex);

  // Función para hacer zoom manteniendo el punto bajo el puntero
  const zoomWithPointer = (event, newZoom) => {
    const activeCanvas = getActiveCanvas();
    if (!activeCanvas) return;

    const pointer = activeCanvas.getPointer(event);
    activeCanvas.zoomToPoint(new fabric.Point(pointer.x, pointer.y), newZoom);

    // Make sure we're updating the correct index
    setZoomLevel(activeImageIndex, newZoom);

    // Force a renderAll to ensure the canvas updates
    activeCanvas.renderAll();
  };

  // Función para hacer zoom en el centro del canvas
  const zoomCenter = (newZoom, index = activeImageIndex) => {
    const activeCanvas = getCanvasInstance(index);
    if (!activeCanvas) return;

    const center = activeCanvas.getCenter();
    activeCanvas.zoomToPoint(
      new fabric.Point(center.left, center.top),
      newZoom
    );
    setZoomLevel(index, newZoom); // Sincroniza el estado en el store
    activeCanvas.renderAll(); // Asegura que el canvas se renderice después del zoom
  };

  // Función de zoomOut (por teclado o botones)
  const zoomOut = () => {
    const currentMinZoom = getCurrentMinZoom();
    const newZoom = Math.max(
      zoomLevel[activeImageIndex] * (1 - zoomStep),
      currentMinZoom
    );
    zoomCenter(newZoom);
  };

  // Función de zoomIn (por teclado o botones)
  const zoomIn = () => {
    const newZoom = Math.min(
      zoomLevel[activeImageIndex] * (1 + zoomStep),
      maxZoom
    );
    zoomCenter(newZoom); // Aplica el zoom al canvas
  };

  // Función para resetear el zoom
  const handleResetZoom = (
    resetZoom = zoomLevel[activeImageIndex],
    index = activeImageIndex
  ) => {
    const activeCanvas = getCanvasInstance(index);
    if (!activeCanvas) return;
    const zoomResult = resetZoom || 1;
    activeCanvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    activeCanvas.viewportTransform[4] = 0; // Reinicia el desplazamiento horizontal
    activeCanvas.viewportTransform[5] = 0; // Reinicia el desplazamiento vertical

    zoomCenter(zoomResult, index); // Sincroniza el estado en el store
  };

  // Manejador del evento "wheel" para hacer zoom con la rueda del mouse
  useEffect(() => {
    const handleWheel = (event) => {
      if (!event.ctrlKey) return; // Only zoom when Ctrl is pressed
      event.preventDefault();

      const activeCanvas = getActiveCanvas();
      if (!activeCanvas) return;

      const delta = event.deltaY;
      const zoomFactor = 1 - delta * 0.001; // Fine-tuned sensitivity
      const currentZoom = zoomLevel[activeImageIndex];
      const currentMinZoom = getCurrentMinZoom();

      const newZoom = Math.min(
        Math.max(currentZoom * zoomFactor, currentMinZoom),
        maxZoom
      );

      // Apply zoom immediately without debouncing
      zoomWithPointer(event, newZoom);
    };

    const container = containerRef;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        container.removeEventListener("wheel", handleWheel);
      };
    }
  }, [
    containerRef,
    zoomLevel,
    maxZoom,
    setZoomLevel,
    activeImageIndex,
    getCanvasInstance,
    // Añadimos esta dependencia
    getCurrentMinZoom,
  ]);

  // Atajos de teclado para zoom
  useEffect(() => {
    const handleKeyboard = (event) => {
      if (event.ctrlKey) {
        if (event.key === "=" || event.key === "+") {
          event.preventDefault();
          zoomIn();
        } else if (event.key === "-") {
          event.preventDefault();
          zoomOut();
        } else if (event.key === "0") {
          event.preventDefault();
          handleResetZoom();
        }
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [zoomIn, zoomOut, handleResetZoom]);

  // Función para actualizar el zoom manualmente (desde el slider)
  const updateZoomManually = (newZoom) => {
    const currentMinZoom = getCurrentMinZoom();
    const adjustedZoom = Math.max(newZoom, currentMinZoom);
    zoomCenter(adjustedZoom);
  };

  return {
    zoomLevel,
    zoomIn,
    zoomOut,
    resetZoom: handleResetZoom,
    minZoom: getCurrentMinZoom(), // Ahora devolvemos el minZoom actual basado en el índice
    maxZoom,
    zoomStep,
    setZoomLevel,
    updateZoomManually,
  };
};
