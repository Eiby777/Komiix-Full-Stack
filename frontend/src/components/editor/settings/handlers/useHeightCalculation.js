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
      // Verificar si el usuario está arrastrando (si las alturas ya están establecidas)
      const currentHeight0 = tool0.clientHeight;
      const currentHeight1 = tool1.clientHeight;
      
      // Si las alturas ya están establecidas y son razonables, no sobrescribir
      if (currentHeight0 > 0 && currentHeight1 > 0) {
        return;
      }

      tool0.style.height = 'auto';
      tool1.style.height = 'auto';
      const naturalHeight0 = tool0.scrollHeight;
      const naturalHeight1 = tool1.scrollHeight;

      const panelHeight = panelRef.current.offsetHeight;
      const padding = 16;
      const separatorHeight = 4;
      const availableHeight = panelHeight - separatorHeight - 2 * padding;

      // Asegurar que no exceda la altura de la ventana
      const maxAvailableHeight = Math.min(availableHeight, window.innerHeight - 200);
      
      let initialHeight0;
      if (lastHeightPercentage !== null) {
        initialHeight0 = (lastHeightPercentage / 100) * maxAvailableHeight;
      } else if (naturalHeight0 + naturalHeight1 > maxAvailableHeight) {
        initialHeight0 = (naturalHeight0 / (naturalHeight0 + naturalHeight1)) * maxAvailableHeight;
      } else {
        initialHeight0 = naturalHeight0;
      }

      const minHeight0 = 100;
      const minHeight1 = 116;
      initialHeight0 = Math.max(minHeight0, Math.min(maxAvailableHeight - minHeight1, initialHeight0));
      const initialHeight1 = maxAvailableHeight - initialHeight0;

      const savedHeights = getToolsHeights(activeTools);
      if (savedHeights) {
        // Verificar que las alturas guardadas no excedan el espacio disponible
        const totalSavedHeight = savedHeights[0] + savedHeights[1];
        if (totalSavedHeight <= maxAvailableHeight) {
          tool0.style.height = `${savedHeights[0]}px`;
          tool1.style.height = `${savedHeights[1]}px`;
          setHeights(savedHeights);
        } else {
          // Si exceden, recalcular proporcionalmente
          const ratio = maxAvailableHeight / totalSavedHeight;
          const newHeight0 = Math.max(minHeight0, savedHeights[0] * ratio);
          const newHeight1 = maxAvailableHeight - newHeight0;
          tool0.style.height = `${newHeight0}px`;
          tool1.style.height = `${newHeight1}px`;
          setHeights([newHeight0, newHeight1]);
        }
      } else {
        tool0.style.height = `${initialHeight0}px`;
        tool1.style.height = `${initialHeight1}px`;
        setHeights([initialHeight0, initialHeight1]);
      }
    }
  }, [activeTools.length, lastHeightPercentage]);

  return { heights, setHeights, lastHeightPercentage, setLastHeightPercentage };
}