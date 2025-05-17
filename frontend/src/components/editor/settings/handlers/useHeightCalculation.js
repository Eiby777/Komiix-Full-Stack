import { useState, useEffect } from 'react';
import { useEditorStore } from '../../../../stores/editorStore';

export default function useHeightCalculation(panelRef) {
  const { activeTools, getToolsHeights } = useEditorStore();
  const [heights, setHeights] = useState([null, null]);
  const [lastHeightPercentage, setLastHeightPercentage] = useState(50);

  useEffect(() => {
    if (activeTools.length !== 2 || !panelRef.current) return;

    const tool0 = document.getElementById('tool-0');
    const tool1 = document.getElementById('tool-1');
    if (tool0 && tool1) {
      tool0.style.height = 'auto';
      tool1.style.height = 'auto';
      const naturalHeight0 = tool0.scrollHeight;
      const naturalHeight1 = tool1.scrollHeight;

      const panelHeight = panelRef.current.offsetHeight;
      const padding = 16;
      const separatorHeight = 4;
      const availableHeight = panelHeight - separatorHeight - 2 * padding;

      let initialHeight0;
      if (lastHeightPercentage !== null) {
        initialHeight0 = (lastHeightPercentage / 100) * availableHeight;
      } else if (naturalHeight0 + naturalHeight1 > availableHeight) {
        initialHeight0 = (naturalHeight0 / (naturalHeight0 + naturalHeight1)) * availableHeight;
      } else {
        initialHeight0 = naturalHeight0;
      }

      const minHeight0 = 100;
      const minHeight1 = 116;
      initialHeight0 = Math.max(minHeight0, Math.min(availableHeight - minHeight1, initialHeight0));
      const initialHeight1 = availableHeight - initialHeight0;

      const savedHeights = getToolsHeights(activeTools);
      if (savedHeights) {
        tool0.style.height = `${savedHeights[0]}px`;
        tool1.style.height = `${savedHeights[1]}px`;
        setHeights(savedHeights);
      } else {
        tool0.style.height = `${initialHeight0}px`;
        tool1.style.height = `${initialHeight1}px`;
        setHeights([initialHeight0, initialHeight1]);
      }
    }
  }, [activeTools.length, lastHeightPercentage]);

  return { heights, setHeights, lastHeightPercentage, setLastHeightPercentage };
}