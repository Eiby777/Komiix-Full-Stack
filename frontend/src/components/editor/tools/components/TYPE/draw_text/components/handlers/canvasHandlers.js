import { useRef } from 'react';
import fabric from '../../../../../../../../constants/fabricInstance';

/**
 * @file canvasHandlers.js
 * @description Utility functions for managing Fabric.js canvas operations
 * @param {React.RefObject} [fabricCanvasRef] - Reference to the Fabric.js canvas instance
 * @returns {Object} Canvas handler functions
 * @property {function} initializeCanvas - Initializes the Fabric.js canvas
 * @property {function} resetCanvas - Resets the canvas to initial state
 */

export function useCanvasHandlers(fabricCanvasRef = useRef(null)) {
  const initializeCanvas = (canvasElement) => {
    const canvas = new fabric.Canvas(canvasElement, {
      backgroundColor: 'white',
      width: canvasElement.parentElement.clientWidth,
      height: 200,
      isDrawingMode: true,
    });
    fabricCanvasRef.current = canvas;

    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.renderAll();

    return () => canvas.dispose();
  };

  const resetCanvas = () => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      canvas.clear();
      canvas.backgroundColor = 'white';
      canvas.renderAll();
    }
  };

  return { initializeCanvas, resetCanvas };
}