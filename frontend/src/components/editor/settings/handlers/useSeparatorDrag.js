import { useEffect } from 'react';
import { useEditorStore } from '../../../../stores/editorStore';
import { TOOLS } from '../../../../constants/tools';

export default function useSeparatorDrag(panelRef, activeTools, heights, setHeights, lastHeightPercentage, setLastHeightPercentage) {
  const { setToolsHeights } = useEditorStore();

  useEffect(() => {
    // Allow dragging if there are exactly 2 active tools
    if (activeTools.length !== 2 || !panelRef.current) return;

    let startY;
    let startHeight0;
    let isDragging = false;
    let panelRect;
    const padding = 16;
    const separatorHeight = 4;

    const onMouseMove = (e) => {
      if (!isDragging) return;

      const diff = e.clientY - startY;
      const availableHeight = panelRect.height - separatorHeight - 2 * padding;
      const minHeight0 = 100;
      const minHeight1 = 116;

      let newHeight0 = startHeight0 + diff;
      newHeight0 = Math.max(minHeight0, Math.min(availableHeight - minHeight1, newHeight0));
      const newHeight1 = availableHeight - newHeight0;

      const tool0 = document.getElementById('tool-0');
      const tool1 = document.getElementById('tool-1');
      if (tool0 && tool1) {
        tool0.style.height = `${newHeight0}px`;
        tool1.style.height = `${newHeight1}px`;
      }
    };

    const onMouseUp = () => {
      if (isDragging) {
        const tool0 = document.getElementById('tool-0');
        const tool1 = document.getElementById('tool-1');
        if (tool0 && tool1 && panelRect) {
          // Usar las alturas que ya están establecidas durante el arrastre
          const currentHeight0 = tool0.clientHeight;
          const currentHeight1 = tool1.clientHeight;
          
          const availableHeight = panelRect.height - separatorHeight - 2 * padding;
          const minHeight0 = 100;
          const minHeight1 = 116;
          
          // Asegurar que las alturas estén dentro de los límites
          const clampedHeight0 = Math.max(minHeight0, Math.min(availableHeight - minHeight1, currentHeight0));
          const clampedHeight1 = availableHeight - clampedHeight0;
          
          // Aplicar las alturas finales
          tool0.style.height = `${clampedHeight0}px`;
          tool1.style.height = `${clampedHeight1}px`;
          
          // Actualizar el estado
          const percentage = (clampedHeight0 / availableHeight) * 100;
          const newHeights = [clampedHeight0, clampedHeight1];
          setHeights(newHeights);
          setToolsHeights(['text', 'text-box'], newHeights);
          setLastHeightPercentage(Math.max(10, Math.min(90, percentage)));
        }
      }
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    const onMouseDown = (e) => {
      e.preventDefault();
      isDragging = true;
      startY = e.clientY;
      panelRect = panelRef.current.getBoundingClientRect();

      const tool0 = document.getElementById('tool-0');
      if (tool0) {
        startHeight0 = tool0.clientHeight;
        tool0.style.transition = 'none';
      }
      const tool1 = document.getElementById('tool-1');
      if (tool1) {
        tool1.style.transition = 'none';
      }
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const separator = document.querySelector('.separator');
    if (separator) {
      separator.addEventListener('mousedown', onMouseDown);
    }

    return () => {
      if (separator) {
        separator.removeEventListener('mousedown', onMouseDown);
      }
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [activeTools.length, heights, setHeights, lastHeightPercentage, setLastHeightPercentage]);
}
