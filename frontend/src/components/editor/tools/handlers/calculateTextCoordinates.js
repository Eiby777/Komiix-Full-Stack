/**
 * ⚠️ DEPRECATED - DO NOT USE ⚠️
 * 
 * This file has been replaced by the backend text centralization API.
 * 
 * New implementation:
 * - Backend: /backend/lib/text_centralization.py
 * - API Endpoint: POST /api/text-coordinates
 * - Frontend Client: /frontend/src/hooks/textCoordinatesApi.js
 * 
 * This file should be deleted after verifying the new implementation works correctly.
 * 
 * Migration completed: 2025-12-07
 * 
 * For cleanText function, use:
 * import { cleanText } from '../hooks/textCoordinatesApi';
 * 
 * For calculateTextCoordinates function, use:
 * import calculateTextCoordinates from '../hooks/textCoordinatesApi';
 * 
 * The new implementation provides:
 * - Better accuracy with OpenCV flood fill
 * - Spanish hyphenation support
 * - Centralized backend processing
 * - Improved error handling
 */

// Original implementation preserved below for reference during migration period
// TODO: Delete this entire file after successful verification

/**
 * Limpia el texto eliminando saltos de línea, múltiples espacios, y caracteres especiales.
 * @param {string} text - Texto a limpiar.
 * @returns {string} - Texto limpio.
 */
const cleanText = (text) => {
    // Safety check for undefined or null text
    if (!text || typeof text !== 'string') {
        return '';
    }

    return text
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/\/|\\|\-/g, function (match) {
            if (match === '-') {
                return ' ';
            }
            return '';
        })
        .replace(/\s(?=[\s-])|(?<=[\s-])\s/g, '')
        .trim();
};

// ... rest of original implementation omitted for brevity ...
// See git history for full original implementation

export default () => {
    throw new Error(
        'calculateTextCoordinates.js is deprecated. ' +
        'Use textCoordinatesApi.js instead. ' +
        'Import from: import calculateTextCoordinates from "../hooks/textCoordinatesApi"'
    );
};

export { cleanText };