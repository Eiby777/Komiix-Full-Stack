import React, { useEffect, useRef, useState } from 'react';
import { useEditorStore } from '../../../stores/editorStore';
import { TOOLS } from '../../../constants/tools';
import useHeightCalculation from './handlers/useHeightCalculation';
import useSeparatorDrag from './handlers/useSeparatorDrag';
import ToolSettings from './components/ToolSettings';

export default function SettingsPanel() {
  const { activeTools, isSettingsVisible, toolbarWidth } = useEditorStore();
  const settingsPanelRef = useRef(null);
  const panelRef = useRef(null);
  const [settingsPanelWidth, setSettingsPanelWidth] = useState(null);

  // Get heights and setters from useHeightCalculation
  const { heights, setHeights, lastHeightPercentage, setLastHeightPercentage } = useHeightCalculation(panelRef);

  // Pass all necessary values to useSeparatorDrag
  useSeparatorDrag(panelRef, activeTools, heights, setHeights, lastHeightPercentage, setLastHeightPercentage);

  // Calculate remaining width using ResizeObserver
  useEffect(() => {
    if (!isSettingsVisible) {
      setSettingsPanelWidth(null); // Reset width when panel is hidden
      return;
    }

    const parentContainer = document.getElementById('div_canvases');
    if (!parentContainer) return;

    const updateWidth = () => {
      const parentWidth = parentContainer.clientWidth;
      const newWidth = window.innerWidth - (parentWidth + toolbarWidth);
      const maxPanelWidth = 370; // Set a maximum width for the settings panel
      const calculatedWidth = Math.min(Math.max(newWidth, 0), maxPanelWidth);
      
      setSettingsPanelWidth(calculatedWidth);
    };

    updateWidth(); // Initial calculation

    // Set up ResizeObserver to handle dynamic resizing
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(parentContainer);
    window.addEventListener('resize', updateWidth);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, [isSettingsVisible, toolbarWidth]);

  const activeToolsWithSettings = activeTools
    .map(t => Object.values(TOOLS).find(tool => tool.id === t))
    .filter(tool => tool?.hasSettings);

  if (activeToolsWithSettings.length === 0) return null;

  const toolsToRender = [...activeToolsWithSettings];


  return (
    <div
      id="settings-panel"
      ref={settingsPanelRef}
      className={`flex ${isSettingsVisible ? 'block' : 'hidden'}`}
      style={{
        width: settingsPanelWidth !== null ? `${settingsPanelWidth}px` : 'auto',
        maxWidth: '100%',
        transition: isSettingsVisible ? 'opacity 300ms ease-in-out, transform 300ms ease-in-out' : 'none',
        opacity: isSettingsVisible ? 1 : 0.8,
        transform: isSettingsVisible ? 'translateX(0)' : 'translateX(10px)'
      }}
    >
      <div className="border-l border-[var(--muted)] bg-[var(--muted)] w-[100%]">
        <div
          ref={panelRef}
          className="p-4 h-full border-l border-t border-white/10 bg-[#1a1a1a] flex flex-col"
          style={{ 
            maxHeight: '100vh',
            overflow: 'hidden'
          }}
        >
          {toolsToRender.length === 1 ? (
            <ToolSettings tool={toolsToRender[0]} id="tool-0" className="flex-grow" />
          ) : (
            <>
              <ToolSettings
                tool={toolsToRender[0]}
                id="tool-0"
                style={{ 
                  height: heights[0] !== null ? `${heights[0]}px` : '50%',
                  minHeight: '100px',
                  maxHeight: 'calc(100vh - 200px)'
                }}
              />
              <div className="separator w-full h-1 cursor-ns-resize bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.3)] transition-colors duration-200 relative flex-shrink-0">
                <div className="absolute inset-0 flex items-center justify-center gap-1 pointer-events-none">
                  <span className="w-4 h-[2px] bg-white/50 rounded-full"></span>
                  <span className="w-4 h-[2px] bg-white/50 rounded-full"></span>
                  <span className="w-4 h-[2px] bg-white/50 rounded-full"></span>
                </div>
              </div>
              <ToolSettings 
                tool={toolsToRender[1]} 
                id="tool-1" 
                className="flex-grow"
                style={{ 
                  minHeight: '100px',
                  maxHeight: 'calc(100vh - 200px)'
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}