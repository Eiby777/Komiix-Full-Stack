import { useEffect, useRef } from 'react';
import fabric from '../../../../../../../../constants/fabricInstance';
import { useOcrHandlers } from './ocrHandlers';

const isValidBase64Image = (base64String) => {
  if (typeof base64String !== "string" || !base64String.startsWith("data:image/")) {
      return false;
  }
  try {
      const img = new Image();
      img.src = base64String;
      return true;
  } catch (error) {
      return false;
  }
};

/**
 * Escala una imagen manteniendo su relación de aspecto
 * @param {HTMLCanvasElement} canvas - Canvas con la imagen original
 * @param {number} scaleFactor - Factor de escalado (ej. 2 para duplicar tamaño)
 * @returns {string} - Imagen escalada en formato base64
 * @throws {Error} - Si la imagen base64 generada no es válida
 */
export const upscaleImage = (canvas, scaleFactor) => {
    const newCanvas = document.createElement("canvas");
    const ctx = newCanvas.getContext("2d");
    newCanvas.width = canvas.width * scaleFactor;
    newCanvas.height = canvas.height * scaleFactor;

    // Habilitar suavizado para interpolación bicúbica
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high'; // Opciones: 'low', 'medium', 'high'

    ctx.drawImage(canvas, 0, 0, newCanvas.width, newCanvas.height);

    const base64Image = newCanvas.toDataURL("image/png");
    if (!isValidBase64Image(base64Image)) {
        throw new Error("Imagen base64 generada no es válida después del upscaling");
    }
    return base64Image;
};

/**
 * @file drawingHandlers.js
 * @description Utility functions for handling drawing and selection operations
 * @param {Object} params
 * @param {React.RefObject} params.fabricCanvasRef - Reference to the Fabric.js canvas
 * @param {boolean} params.isOcrActive - OCR activation state
 * @param {string} params.language - Selected OCR language
 * @param {function} params.setPredictedText - Function to update detected text
 * @param {function} params.getCanvasInstance - Function to get canvas instance
 * @param {number} params.activeImageIndex - Current active image index
 * @param {Array} params.dimensionImages - Array of image dimensions
 * @param {Array} params.images - Array of images
 */

export function useDrawingHandlers({
  fabricCanvasRef,
  isOcrActive,
  getCanvasInstance,
  activeImageIndex,
  dimensionImages,
  images,
  language,
  setPredictedText
}) {
  const drawingRectRef = useRef(null);
  const startPointRef = useRef(null);

  const { detectText } = useOcrHandlers({
    fabricCanvasRef,
    isOcrActive,
    language,
    setPredictedText
  });

  useEffect(() => {
    const canvas = getCanvasInstance(activeImageIndex);
    if (!canvas) return;

    const handleMouseDown = (event) => {
      const pointer = canvas.getPointer(event.e);
      startPointRef.current = { x: pointer.x, y: pointer.y };

      const rect = new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        fill: 'transparent',
        stroke: 'rgba(255, 0, 0, 0.5)',
        strokeWidth: 2,
        selectable: false,
        evented: false,
      });

      drawingRectRef.current = rect;
      canvas.add(rect);
    };

    const handleMouseMove = (event) => {
      if (!startPointRef.current || !drawingRectRef.current) return;

      const pointer = canvas.getPointer(event.e);
      const rect = drawingRectRef.current;

      const width = pointer.x - startPointRef.current.x;
      const height = pointer.y - startPointRef.current.y;

      rect.set({
        width: Math.abs(width),
        height: Math.abs(height),
        left: width < 0 ? startPointRef.current.x + width : startPointRef.current.x,
        top: height < 0 ? startPointRef.current.y + height : startPointRef.current.y,
      });

      canvas.renderAll();
    };

    const calculateRelativePointer = (pointer, image) => {
      if (!pointer || !image) return null;

      const canvasCenter = {
        x: canvas.width / 2,
        y: canvas.height / 2,
      };

      const relativeImage = {
        left: canvasCenter.x - image.width / 2,
        top: canvasCenter.y - image.height / 2,
      };

      return {
        x: pointer.x - relativeImage.left,
        y: pointer.y - relativeImage.top,
      };
    };

    const cropAndPasteSelection = (relative_pointer, width, height, image) => {
      if (!image?.src || !fabricCanvasRef.current) return;
    
      const img = new Image();
      img.src = image.src;
    
      img.onload = () => {
        fabricCanvasRef.current.clear();
        fabricCanvasRef.current.backgroundColor = 'white';
    
        const canvasWidth = fabricCanvasRef.current.width;
        const canvasHeight = fabricCanvasRef.current.height;
    
        let finalWidth = width;
        let finalHeight = height;
    
        if (width < 50 || height < 50) {
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = width;
          tempCanvas.height = height;
          const ctx = tempCanvas.getContext('2d');
          ctx.drawImage(img, relative_pointer.x, relative_pointer.y, width, height, 0, 0, width, height);
    
          const upscaledImage = upscaleImage(tempCanvas, 3);
          finalWidth = width * 3;
          finalHeight = height * 3;
    
          const upscaledImg = new Image();
          upscaledImg.src = upscaledImage;
          upscaledImg.onload = () => {
            processImage(upscaledImg, finalWidth, finalHeight, canvasWidth, canvasHeight, {x: 0, y: 0}, finalWidth, finalHeight);
          };
        } else {
          processImage(img, finalWidth, finalHeight, canvasWidth, canvasHeight, relative_pointer, width, height);
        }
      };
    };
    
    const processImage = (processedImg, w, h, canvasWidth, canvasHeight, relative_pointer, originalWidth, originalHeight) => {
      const scaleX = w > canvasWidth ? canvasWidth / w : 1;
      const scaleY = h > canvasHeight ? canvasHeight / h : 1;
      let scale = Math.min(scaleX, scaleY);
    
      const minDimension = Math.min(canvasWidth, canvasHeight) * 0.8;
      if (w * scale < minDimension || h * scale < minDimension) {
        const scaleToFit = minDimension / Math.max(w, h);
        scale = Math.min(scale, scaleToFit);
      }
    
      const finalWidth = w * scale;
      const finalHeight = h * scale;
    
      const lineSpacing = finalHeight * 0.1;
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = finalWidth;
      tempCanvas.height = finalHeight + lineSpacing;
      const ctx = tempCanvas.getContext('2d');
    
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
      ctx.drawImage(
        processedImg,
        relative_pointer.x,
        relative_pointer.y,
        originalWidth,
        originalHeight,
        0, lineSpacing / 2,
        finalWidth, finalHeight
      );
    
      const fabricImg = new fabric.FabricImage(tempCanvas, {
        left: (canvasWidth - finalWidth) / 2,
        top: (canvasHeight - (finalHeight + lineSpacing)) / 2,
        selectable: true,
      });
    
      fabricCanvasRef.current.add(fabricImg);
      fabricCanvasRef.current.renderAll();
    
      if (isOcrActive) {
        detectText();
      }
    };

    const handleMouseUp = () => {
      if (!drawingRectRef.current) return;

      const rect = drawingRectRef.current;
      const { left, top, width, height } = rect;

      const relative_pointer = calculateRelativePointer(
        { x: left, y: top },
        dimensionImages[activeImageIndex]
      );

      cropAndPasteSelection(
        relative_pointer,
        width,
        height,
        images[activeImageIndex]
      );

      canvas.remove(rect);
      drawingRectRef.current = null;
      startPointRef.current = null;
      canvas.renderAll();
    };

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
      if (drawingRectRef.current) {
        canvas.remove(drawingRectRef.current);
      }
    };
  }, [activeImageIndex, getCanvasInstance, isOcrActive, images, dimensionImages]);
}