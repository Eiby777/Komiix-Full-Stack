/**
 * Text Coordinates API Client
 * 
 * Provides functions to calculate text coordinates for bubble text placement
 * by communicating with the backend text centralization service.
 */

import { supabase } from '../lib/supabaseClient';
import domain from './domain';

/**
 * Clean text by removing line breaks, multiple spaces, and special characters.
 * @param {string} text - Text to clean.
 * @returns {string} - Cleaned text.
 */
export const cleanText = (text) => {
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

/**
 * Calculate text coordinates using backend API
 * @param {HTMLCanvasElement} canvas - Canvas with the cropped image
 * @param {Object} relativePointer - Relative pointer coordinates {x, y}
 * @param {Object} textObject - Fabric.js text object with text, fontSize, fontFamily, etc.
 * @param {boolean|null} isText - Indicates rectangle type (true, false, or null)
 * @param {Object} rect - Rectangle coordinates {x, y, w, h}
 * @param {string} fontId - Font ID in the system
 * @returns {Promise<Object>} - {top, left, width, height, fontSize}
 */
export const calculateTextCoordinates = async (
    canvas,
    relativePointer,
    textObject,
    isText = null,
    rect = null,
    fontId = null
) => {
    try {
        // Extract and preprocess text
        let text = textObject?.text || '';

        // If text is empty, return default centered values
        if (!text || text.trim() === '') {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            return {
                top: centerY,
                left: centerX,
                width: 0,
                height: 0,
                fontSize: 12,
            };
        }

        text = cleanText(text);
        const fontFamily = textObject.fontFamily || 'sans-serif';

        // Get authentication token
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;

        if (!accessToken) {
            throw new Error('No active session');
        }

        // If no fontId provided, try to extract from fontFamily or use default
        if (!fontId) {
            // Try to extract font ID from fontFamily string
            // This assumes fontFamily might contain the ID or we use a default
            fontId = fontFamily.split(',')[0].trim().replace(/['"]/g, '');
        }

        // Convert canvas to base64
        const imageBase64 = canvas.toDataURL('image/png').split(',')[1];

        // Prepare request payload
        const payload = {
            image: imageBase64,
            seed_point: {
                x: Math.round(relativePointer.x),
                y: Math.round(relativePointer.y)
            },
            text: text,
            font_family: fontFamily,
            font_id: fontId,
            is_text: isText,
            rect: rect ? {
                x: Math.round(rect.x),
                y: Math.round(rect.y),
                w: Math.round(rect.w),
                h: Math.round(rect.h)
            } : null
        };

        console.log('Sending text coordinates request:', {
            seed_point: payload.seed_point,
            text_length: text.length,
            font_id: fontId,
            has_rect: !!rect
        });

        // Make API request
        const url = `${domain}/api/text-coordinates`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Text coordinates API error:', {
                status: response.status,
                statusText: response.statusText,
                errorData
            });
            throw new Error(
                errorData.detail ||
                `Error calculating text coordinates: ${response.statusText}`
            );
        }

        const result = await response.json();

        return {
            top: result.top,
            left: result.left,
            width: result.width,
            height: result.height,
            fontSize: result.font_size,
        };

    } catch (error) {
        console.error('Error in calculateTextCoordinates:', error);

        // Return fallback centered coordinates on error
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        return {
            top: centerY,
            left: centerX,
            width: 100,
            height: 20,
            fontSize: 12,
        };
    }
};

/**
 * Calculate text coordinates with fallback to local calculation
 * This is a wrapper that tries the backend API first, then falls back to local
 * @deprecated Use calculateTextCoordinates directly
 */
export default calculateTextCoordinates;
