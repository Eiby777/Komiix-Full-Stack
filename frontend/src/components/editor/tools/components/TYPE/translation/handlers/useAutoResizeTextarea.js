import { useEffect, useRef, useCallback } from 'react';

export const useAutoResizeTextarea = (value) => {
  const textareaRef = useRef(null);

  const updateHeight = useCallback(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto'; // Resetear altura para medir correctamente
      const newHeight = textarea.scrollHeight;
      textarea.style.height = `${newHeight}px`;
    }
  }, []);

  useEffect(() => {
    updateHeight();
  }, [value, updateHeight]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleInput = () => {
      updateHeight();
    };

    textarea.addEventListener('input', handleInput);
    return () => {
      textarea.removeEventListener('input', handleInput);
    };
  }, [updateHeight]);

  return textareaRef;
};