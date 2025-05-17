import { useEffect, useRef } from "react";
import { useEditorStore } from "../../../../../stores/editorStore";
import fabric from "../../../../../constants/fabricInstance";

const CANVAS_CONFIG = {
  backgroundColor: "#1a1a1a",
  initDelay: 200,
};

export const useFabricCanvas = (images) => {
  const canvasRefs = useRef([]);
  const {
    activeLayer,
    activeImageIndex,
    setCanvasInstance,
    setDimensionImages,
    setImagesLoaded,
    initializeZoomLevel,
    setCanvasObjectStatus,
    projectId
  } = useEditorStore();
  let imagesDimensions = [];
  const imagesLoadedRef = useRef(0);

  useEffect(() => {
    imagesLoadedRef.current = 0;
    initializeAllCanvases();
  }, [images]);

  // Actualizar z-index según la imagen activa o capa
  useEffect(() => {
    const updateCanvasZIndex = () =>
      canvasRefs.current.forEach((pair, index) => {
        if (pair?.original?.wrapperEl) {
          const zIndex =
            activeLayer === "original"
              ? images.length + (index === activeImageIndex ? images.length : 0)
              : 1 + (index === activeImageIndex ? images.length : 0);
          pair.original.wrapperEl.style.position = "absolute";
          pair.original.wrapperEl.style.inset = "0";
          pair.original.wrapperEl.style.zIndex = zIndex;
        }
      });
    const timeoutId = setTimeout(updateCanvasZIndex, CANVAS_CONFIG.initDelay);
    return () => clearTimeout(timeoutId);
  }, [activeImageIndex, images?.length, activeLayer]);

  const initializeCanvas = (canvasEl, image, index, type) => {
    if (canvasEl.__fabric_initialized) return;
    canvasEl.__fabric_initialized = true;

    // Obtener el tamaño real del canvas en píxeles
    const canvasWidth = canvasEl.clientWidth;
    const canvasHeight = canvasEl.clientHeight;

    // Inicializar el canvas con el tamaño correcto
    const fabricCanvas = new fabric.Canvas(canvasEl, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: CANVAS_CONFIG.backgroundColor,
      selection: false,
      preserveObjectStacking: true,
      enableRetinaScaling: false,
    });

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const imgWidth = img.width;
      const imgHeight = img.height;
      imagesDimensions[index] = { width: imgWidth, height: imgHeight };

      if (imagesDimensions.length === images.length) {
        setDimensionImages(imagesDimensions);
      }

      // Calcular la posición para centrar la imagen
      const left = canvasWidth / 2;
      const top = canvasHeight / 2;

      // Crear la imagen con Fabric.js
      const fabricImage = new fabric.FabricImage(img, {
        left: left,
        top: top,
        originX: "center", // Anclar el centro horizontalmente
        originY: "center", // Anclar el centro verticalmente
        scaleX: 1, // Escala original
        scaleY: 1, // Escala original
        selectable: false,
        evented: false,
        backgroundImage: true,
      });

      // Agregar la imagen al canvas
      fabricCanvas.add(fabricImage);

      // Asegurarse de que el canvas se renderice correctamente
      fabricCanvas.renderAll();

      imagesLoadedRef.current += 1;

      window.dispatchEvent(
        new CustomEvent("fabricImageLoaded", {
          detail: { index, type, fabricCanvas },
        })
      );

      if (imagesLoadedRef.current === images.length) {
        const zooms = Array.from({ length: images.length }, () => 1);
        initializeZoomLevel(zooms);

        setImagesLoaded(true);
      }
    };

    img.onerror = (err) => {
      console.error(`Error cargando la imagen ${type}:`, err);
    };

    img.src = image.src;

    setCanvasInstance(index, fabricCanvas);
    setCanvasObjectStatus(index, false);
  };

  const initializeAllCanvases = () => {
    setTimeout(() => {
      images.forEach((image, index) => {
        ["original"].forEach((type) => {
          const canvasEl = document.getElementById(`canvas-${type}-${index}`);
          if (canvasEl && !canvasEl.__fabric_initialized) {
            initializeCanvas(canvasEl, image, index, type);
          }
        });
      });
    }, CANVAS_CONFIG.initDelay);
  };

  return { canvasRefs };
};
