import { useEffect, useRef } from 'react';
import processWithTesseract from '../../../../../handlers/useTesseract';

/**
 * Convierte un canvas a imagen binaria (blanco y negro) aplicando un umbral fijo
 * @param {HTMLCanvasElement} canvas - Canvas a binarizar
 * @returns {HTMLCanvasElement} - Canvas binarizado
 */
export const binarizeCanvas = (canvas) => {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Umbral fijo (ajústalo según tus imágenes, entre 0 y 255)
    const threshold = 128;

    for (let i = 0; i < data.length; i += 4) {
        // Convertir a escala de grises usando la fórmula de luminancia
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        // Aplicar umbral: blanco (255) o negro (0)
        const value = gray > threshold ? 255 : 0;
        data[i] = value;     // Rojo
        data[i + 1] = value; // Verde
        data[i + 2] = value; // Azul
        // El canal alfa (data[i + 3]) se mantiene intacto
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
};

/**
 * @file ocrHandlers.js
 * @description Utility functions for handling OCR operations
 * @param {Object} params
 * @param {React.RefObject} params.fabricCanvasRef - Reference to the Fabric.js canvas
 * @param {boolean} params.isOcrActive - OCR activation state
 * @param {string} params.language - Selected OCR language
 * @param {function} params.setPredictedText - Function to update detected text
 * @returns {Object} OCR handler functions
 * @property {function} detectText - Performs OCR text detection
 */

export function useOcrHandlers({ fabricCanvasRef, isOcrActive, language, setPredictedText }) {
    const debounceTimeoutRef = useRef(null);

    const detectText = async () => {
        if (!isOcrActive || !fabricCanvasRef.current) return;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = fabricCanvasRef.current.width;
        tempCanvas.height = fabricCanvasRef.current.height;
        const ctx = tempCanvas.getContext('2d');
        ctx.drawImage(fabricCanvasRef.current.getElement(), 0, 0);

        binarizeCanvas(tempCanvas);

        const dataUrl = tempCanvas.toDataURL('image/png');
        const croppedImages = [[{ image: dataUrl, id: 1, coords: {}, color: '' }]];

        try {
            const results = await processWithTesseract(croppedImages, language, () => { }, () => { });
            const text = results[0][0]?.text || '';
            const textWithoutLineBreaks = text.replace(/\n/g, ' ');
            setPredictedText(textWithoutLineBreaks);
        } catch (error) {
            console.error('Error al detectar texto:', error);
            setPredictedText('Error al procesar');
        }
    };

    const handleCanvasChange = () => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = setTimeout(() => {
            detectText();
        }, 1000);
    };

    useEffect(() => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        if (isOcrActive) {
            canvas.on('mouse:up', handleCanvasChange);
        } else {
            canvas.off('mouse:up', handleCanvasChange);
        }

        return () => canvas.off('mouse:up', handleCanvasChange);
    }, [isOcrActive]);

    useEffect(() => {
        if (isOcrActive && fabricCanvasRef.current?.getObjects().length > 0) {
            detectText();
        }
    }, [language, isOcrActive]);

    return { detectText };
}