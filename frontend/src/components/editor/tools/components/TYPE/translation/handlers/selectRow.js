import { useCallback } from 'react';

export const selectRow = (selectedId, setSelectedId, setOriginalText, setTranslatedText, setDetectedLang, setAlternatives, setTextData, index, canvasRef) =>
  useCallback(
    (id) => {
      if (selectedId === id) {
        setSelectedId(null);
        setOriginalText('');
        setTranslatedText('');
        setDetectedLang('en');
        setAlternatives([]);
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.discardActiveObject();
          canvas.requestRenderAll();
        }
      } else {
        setTextData((prev) => {
          const item = prev[index]?.find((item) => item.id === id);
          if (item) {
            setSelectedId(id);
            setOriginalText(item.originalText || '');
            setTranslatedText(item.translatedText || '');
            setAlternatives([]);
            const canvas = canvasRef.current;
            if (canvas) {
              const textboxes = canvas.getObjects().filter((obj) => obj.type === 'textbox');
              const textbox = textboxes.find((obj) => obj.id === id);
              if (textbox) {
                canvas.setActiveObject(textbox);
                canvas.requestRenderAll();
              }
            }
          }
          return prev;
        });
      }
    },
    [selectedId, setSelectedId, setOriginalText, setTranslatedText, setDetectedLang, setAlternatives, setTextData, index, canvasRef]
  );