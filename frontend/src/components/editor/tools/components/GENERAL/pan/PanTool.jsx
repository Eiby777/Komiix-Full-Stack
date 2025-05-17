import { useEffect, useRef } from 'react';
import { useEditorStore } from '../../../../../../stores/editorStore';
import { TOOLS } from '../../../../../../constants/tools';

const PanTool = () => {
  const { activeTools, activeImageIndex, getCanvasInstance, canvasInstances, setZoomLevel } = useEditorStore();
  const isActive = activeTools.includes(TOOLS.PAN.id);

  const draggingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  // Función para obtener el canvas activo
  const getActiveCanvas = () => {
    const canvas = getCanvasInstance(activeImageIndex);
    if (!canvas) {
      console.warn('No se encontró un canvas activo para el índice:', activeImageIndex);
    }
    return canvas;
  };

  // Función para aplicar el cursor a todos los canvases
  const setCursorForAllCanvases = (cursor) => {
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach((canvas) => {
      canvas.style.cursor = cursor;
    });

    // Aplicar el cursor a todas las instancias de Fabric.js
    if (canvasInstances && canvasInstances) {
      canvasInstances.forEach((canvas) => {
        if (canvas) {
          canvas.defaultCursor = cursor;
          canvas.hoverCursor = cursor;
          canvas.upperCanvasEl.style.cursor = cursor; // Asegurar que el canvas superior también lo tenga
          canvas.renderAll(); // Forzar renderizado para aplicar el cambio
        }
      });
    }
  };

  useEffect(() => {
    // Si la herramienta no está activa, restablecer el cursor a 'default'
    if (!isActive) {
      setCursorForAllCanvases('default');
    } else {
      // Establecer el cursor inicial a 'grab' en todos los canvases
      setCursorForAllCanvases('grab');
    }

    // Evento mousedown: inicia el arrastre y cambia el cursor a 'grabbing'
    const handleMouseDown = (e) => {
      if (e.altKey) return; // Ignorar si se presiona Alt
      const activeCanvas = getActiveCanvas();
      if (!activeCanvas) return;

      draggingRef.current = true;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      setCursorForAllCanvases('grabbing');
    };

    // Evento mousemove: mueve el canvas y mantiene el cursor
    const handleMouseMove = (e) => {
      if (!draggingRef.current) return;
      const activeCanvas = getActiveCanvas();
      if (!activeCanvas) return;

      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      lastPosRef.current = { x: e.clientX, y: e.clientY };

      const vpt = activeCanvas.viewportTransform;
      vpt[4] += dx;
      vpt[5] += dy;
      activeCanvas.requestRenderAll();

      // Asegurar que el cursor permanezca como 'grabbing' durante el arrastre
      setCursorForAllCanvases('grabbing');

      // Actualizar el zoomLevel en el store y agregarle una decima de unidad
      const newZoom = activeCanvas.getZoom() + 0.0000000001;
      setZoomLevel(activeImageIndex, newZoom);
      
    };

    // Evento mouseup: finaliza el arrastre y vuelve a 'grab'
    const handleMouseUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setCursorForAllCanvases('grab');
    };

    // Añadir eventos al window
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Cleanup
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      setCursorForAllCanvases('default');
    };
  }, [isActive, activeImageIndex, canvasInstances]); // Añadimos canvasInstances como dependencia

  return null;
};

export default PanTool;
