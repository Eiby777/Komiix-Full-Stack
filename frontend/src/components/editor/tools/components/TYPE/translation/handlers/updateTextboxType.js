import { useCallback } from 'react';

export const updateTextboxType = (index, setTextData, canvasRef) =>
  useCallback(
    (id, typeText) => {
      setTextData((prev) => {
        const newData = prev.map((innerArray) => [...innerArray]);
        const itemIndex = newData[index]?.findIndex((item) => item.id === id) ?? -1;
        if (itemIndex !== -1) {
          newData[index][itemIndex] = {
            ...newData[index][itemIndex],
            typeText: typeText,
          };

          const canvas = canvasRef.current;
          if (canvas) {
            const textboxes = canvas.getObjects().filter((obj) => obj.type === 'textbox');
            const textbox = textboxes.find((obj) => obj.id === id);
            if (textbox) {
              textbox.set({ typeText: typeText });
              canvas.requestRenderAll();
            }
          }
        }
        return newData;
      });
    },
    [index, setTextData, canvasRef]
  );