import { useEffect, useRef, useCallback } from 'react';
import { useEditorStore } from '../../../../../../stores/editorStore';
import { throttle } from './handlers/useThrottle';
import './PlusTool.css';

export default function PlusTool() {
  const { activeImageIndex} = useEditorStore();
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const horizontalRef = useRef(null);
  const verticalRef = useRef(null);

  const throttledMouseMove = useCallback(
    throttle((e) => {
      if (!editorRef.current || !horizontalRef.current || !verticalRef.current || !containerRef.current) return;

      const editorRect = editorRef.current.getBoundingClientRect();

      // Use absolute page coordinates
      const mouseX = e.pageX;
      const mouseY = e.pageY;

      // Calculate position relative to editor container
      const relativeX = mouseX - editorRect.left + editorRef.current.scrollLeft;
      const relativeY = mouseY - editorRect.top + editorRef.current.scrollTop;

      // Clamp positions to stay within editor bounds
      const boundedX = Math.max(0, Math.min(relativeX, editorRect.width - 1));
      const boundedY = Math.max(0, Math.min(relativeY, editorRect.height - 1));

      // Update container position and size
      containerRef.current.style.left = `${editorRect.left}px`;
      containerRef.current.style.top = `${editorRect.top}px`;
      containerRef.current.style.width = `${editorRect.width}px`;
      containerRef.current.style.height = `${editorRect.height}px`;

      // Update line positions
      horizontalRef.current.style.transform = `translateY(${boundedY}px)`;
      verticalRef.current.style.transform = `translateX(${boundedX}px)`;
    }, 16),
    []
  );

  useEffect(() => {
    const editorDiv = document.getElementById('div_editor');
    if (!editorDiv) return;

    editorRef.current = editorDiv;

    // Create container for crosshair if it doesn't exist
    let crosshairContainer = document.getElementById('crosshair-container');
    if (!crosshairContainer) {
      crosshairContainer = document.createElement('div');
      crosshairContainer.id = 'crosshair-container';
      crosshairContainer.className = 'crosshair-container';
      document.body.appendChild(crosshairContainer);
      containerRef.current = crosshairContainer;

      // Create horizontal line
      const horizontal = document.createElement('div');
      horizontal.className = 'crosshair-line horizontal';
      horizontalRef.current = horizontal;
      crosshairContainer.appendChild(horizontal);

      // Create vertical line
      const vertical = document.createElement('div');
      vertical.className = 'crosshair-line vertical';
      verticalRef.current = vertical;
      crosshairContainer.appendChild(vertical);
    }

    document.addEventListener('mousemove', throttledMouseMove);

    return () => {
      document.removeEventListener('mousemove', throttledMouseMove);
      if (crosshairContainer) {
        crosshairContainer.remove();
      }
    };
  }, [activeImageIndex, throttledMouseMove]);

  

  return null;
}