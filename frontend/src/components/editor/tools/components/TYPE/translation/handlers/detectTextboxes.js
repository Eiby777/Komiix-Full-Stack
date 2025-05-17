import { useCallback } from 'react';

export const detectTextboxes = (generateUniqueId) =>
  useCallback(
    (canvas) => {
      if (!canvas) return [];
      const textboxes = canvas.getObjects().filter((obj) => obj.type === 'textbox');
      const seenIds = new Set();
      return textboxes.map((obj, i) => {
        if (!obj.id || seenIds.has(obj.id)) {
          console.warn(`Duplicate or missing ID for textbox at index ${i}, original ID: ${obj.id}`);
          obj.id = generateUniqueId();
        }
        seenIds.add(obj.id);
        obj.set({ splitByGrapheme: false });
        return {
          id: obj.id,
          text: obj.text || '',
          originalText: obj.originalText || '',
          translatedText: obj.translatedText || '',
          used: obj.used !== undefined ? obj.used : true,
          typeText: obj.typeText || null,
        };
      });
    },
    [generateUniqueId]
  );