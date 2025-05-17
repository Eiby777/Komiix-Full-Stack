import { useCallback } from 'react';

export const toggleUsed = (index, setTextData, canvasRef) =>
  useCallback(
    (id) => {
      setTextData((prev) => {
        const newData = prev.map((innerArray) => [...innerArray]);
        const itemIndex = newData[index]?.findIndex((item) => item.id === id) ?? -1;
        if (itemIndex !== -1) {
          const newUsed = !newData[index][itemIndex].used;
          newData[index][itemIndex] = {
            ...newData[index][itemIndex],
            used: newUsed,
          };

          const canvas = canvasRef.current;
          if (canvas) {
            const textboxes = canvas.getObjects().filter((obj) => obj.type === 'textbox');
            const textbox = textboxes.find((obj) => obj.id === id);
            if (textbox) {
              textbox.set({ opacity: newUsed ? 1 : 0, used: newUsed });
              canvas.requestRenderAll();
            }
          }
        }
        return newData;
      });
    },
    [index, setTextData, canvasRef]
  );