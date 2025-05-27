import React, { useRef } from 'react';
import { useEditorStore } from '../../../stores/editorStore';
import { TOOLS } from '../../../constants/tools';
import useHeightCalculation from './handlers/useHeightCalculation';
import useSeparatorDrag from './handlers/useSeparatorDrag';
import ToolSettings from './components/ToolSettings';

export default function SettingsPanel() {
  const { activeTools } = useEditorStore();
  const panelRef = useRef(null);

  // Get heights and setters from useHeightCalculation
  const { heights, setHeights, lastHeightPercentage, setLastHeightPercentage } = useHeightCalculation(panelRef);
  
  // Pass all necessary values to useSeparatorDrag
  useSeparatorDrag(panelRef, activeTools, heights, setHeights, lastHeightPercentage, setLastHeightPercentage);

  const activeToolsWithSettings = activeTools
    .map(t => Object.values(TOOLS).find(tool => tool.id === t))
    .filter(tool => tool?.hasSettings);

  if (activeToolsWithSettings.length === 0) return null;

  const toolsToRender = [...activeToolsWithSettings];

  return (
    <div
      ref={panelRef}
      className="p-4 h-full border-l border-t border-white/10 bg-[#1a1a1a] flex flex-col"
    >
      {toolsToRender.length === 1 ? (
        <ToolSettings tool={toolsToRender[0]} id="tool-0" className="flex-grow" />
      ) : (
        <>
          <ToolSettings
            tool={toolsToRender[0]}
            id="tool-0"
            style={{ height: heights[0] !== null ? `${heights[0]}px` : '50%' }}
          />
          <div className="separator w-full h-1 cursor-ns-resize bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.3)] transition-colors duration-200 relative">
            <div className="absolute inset-0 flex items-center justify-center gap-1 pointer-events-none">
              <span className="w-4 h-[2px] bg-white/50 rounded-full"></span>
              <span className="w-4 h-[2px] bg-white/50 rounded-full"></span>
              <span className="w-4 h-[2px] bg-white/50 rounded-full"></span>
            </div>
          </div>
          <ToolSettings tool={toolsToRender[1]} id="tool-1" className="flex-grow" />
        </>
      )}
    </div>
  );
}
