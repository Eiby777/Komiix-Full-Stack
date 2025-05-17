import { useCallback } from 'react';

export const setupCanvasListeners = (detectTextboxes, setTextData) =>
  useCallback(
    (canvas) => {
      if (!canvas) return () => {};

      const handleObjectAdded = (e) => {
        if (e.target.type === 'textbox') {
          const currentTextboxes = detectTextboxes(canvas);
          setTextData([currentTextboxes]);
        }
      };

      const handleObjectRemoved = (e) => {
        if (e.target.type === 'textbox') {
          const currentTextboxes = detectTextboxes(canvas);
          setTextData([currentTextboxes]);
        }
      };

      const handleObjectModified = (e) => {
        if (e.target.type === 'textbox') {
          const currentTextboxes = detectTextboxes(canvas);
          setTextData([currentTextboxes]);
        }
      };

      canvas.on('object:added', handleObjectAdded);
      canvas.on('object:removed', handleObjectRemoved);
      canvas.on('object:modified', handleObjectModified);

      return () => {
        canvas.off('object:added', handleObjectAdded);
        canvas.off('object:removed', handleObjectRemoved);
        canvas.off('object:modified', handleObjectModified);
      };
    },
    [detectTextboxes, setTextData]
  );