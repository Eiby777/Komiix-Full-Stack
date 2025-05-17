import { useEffect } from 'react';
import { useEditorStore } from '../../../../stores/editorStore';
import { TOOLS } from '../../../../constants/tools';

export default function useSeparatorDrag(panelRef, activeTools, heights, setHeights, lastHeightPercentage, setLastHeightPercentage) {
  const { setToolsHeights } = useEditorStore();

  useEffect(() => {
    // Allow dragging if both text and text-box are active, regardless of original-view
    const hasText = activeTools.includes(TOOLS.TEXT.id);
    const hasTextBox = activeTools.includes(TOOLS.TEXT_BOX.id);
    if (!(hasText && hasTextBox) || !panelRef.current) return;

    let startY;
    let startHeight0;
    let isDragging = false;
    let panelHeight;
    const padding = 16;
    const separatorHeight = 4;

    const onMouseMove = (e) => {
      if (!isDragging) return;

      const diff = e.clientY - startY;
      const availableHeight = panelHeight - separatorHeight - 2 * padding;
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
        if (tool0 && tool1 && panelHeight) {
          const newHeight0 = tool0.offsetHeight;
          const availableHeight = panelHeight - separatorHeight - 2 * padding;
          const percentage = (newHeight0 / availableHeight) * 100;
          const newHeights = [newHeight0, tool1.offsetHeight];
          setHeights(newHeights); // Use the setter directly
          // Always save heights under ['text', 'text-box'] key for consistency
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
      panelHeight = panelRef.current.offsetHeight;

      const tool0 = document.getElementById('tool-0');
      if (tool0) {
        startHeight0 = tool0.offsetHeight;
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
