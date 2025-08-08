import { useCallback } from 'react';

export const detectTextboxes = (generateUniqueId) =>
  useCallback(
    (canvas) => {
      if (!canvas) return [];
      const textboxes = canvas.getObjects().filter((obj) => obj.type === 'textbox');
      return textboxes.map((obj) => {
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