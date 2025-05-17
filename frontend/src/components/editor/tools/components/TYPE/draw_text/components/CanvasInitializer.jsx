import React, { useEffect, useRef } from 'react';
import { useCanvasHandlers } from './handlers/canvasHandlers';

/**
 * @file CanvasInitializer.jsx
 * @description Component responsible for initializing and managing the Fabric.js canvas
 * @param {Object} props
 * @param {React.RefObject} props.canvasRef - Reference to the canvas DOM element
 * @param {React.RefObject} props.fabricCanvasRef - Reference to the Fabric.js canvas instance
 * @returns {JSX.Element} Canvas element with Fabric.js initialization
 */

export default function CanvasInitializer({ canvasRef, fabricCanvasRef }) {
  const isMounted = useRef(false);

  const { initializeCanvas } = useCanvasHandlers(fabricCanvasRef);

  useEffect(() => {
    if (isMounted.current || !canvasRef.current) return;
    initializeCanvas(canvasRef.current);
    isMounted.current = true;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full border border-gray-500 rounded-md shadow-inner"
    />
  );
}