import { useEditorStore } from '../../../stores/editorStore';
import { TOOL_GROUPS } from '../../../constants/tools';
import { LAYERS } from '../../../constants/layers';
import { useEffect, useRef } from 'react';

export default function ToolsSideBar() {
  const { activeTools, toggleTool, activeLayer, toolbarWidth, setToolbarWidth } = useEditorStore();
  const toolbarRef = useRef(null); 


  useEffect(() => {
    const updateToolbarWidth = () => {
      const windowWidth = window.innerWidth;
      const calculatedWidth = Math.min(60, Math.max(30, (windowWidth / 1452) * 50));
      setToolbarWidth(calculatedWidth);
    };

    updateToolbarWidth(); // Initial calculation
    window.addEventListener('resize', updateToolbarWidth);
    return () => window.removeEventListener('resize', updateToolbarWidth);
  }, []);

  const iconSize = Math.round((toolbarWidth / 50) * 24);
  const containerPadding = Math.round((toolbarWidth / 50) * 8);
  const buttonPadding = Math.round((toolbarWidth / 50) * 4);

  const getToolsForLayer = (layerId) => {
    const layer = LAYERS[layerId.toUpperCase()];
    if (!layer) return [];

    const layerTools = {
      original: TOOL_GROUPS.ORIGINAL,
      annotation: TOOL_GROUPS.ANNOTATION,
      cleanup: TOOL_GROUPS.CLEANUP,
      text: TOOL_GROUPS.TEXT,
      output: TOOL_GROUPS.FINAL,
    }[layerId] || [];

    return layerTools;
  };

  const toolsToShow = getToolsForLayer(activeLayer);

  const renderToolButton = (tool) => {
    const isActive = activeTools.includes(tool.id);
    const isCompatibleActive = tool.compatibleWith?.some((t) => activeTools.includes(t));

    return (
      <div key={tool.id} className="relative group">
        <button
          onClick={() => toggleTool(tool.id)}
          className={`rounded-lg transition-all w-full ${isActive
              ? 'bg-[#4a90e2] text-white'
              : isCompatibleActive
                ? 'bg-[#2d5c8a] text-white'
                : 'bg-[#1a1a1a] hover:bg-[#333333]'
            }`}
          style={{ width: `${toolbarWidth - containerPadding * 2}px`, padding: `${buttonPadding}px` }}
        >
          <div className="flex justify-center">
            <tool.icon style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
          </div>
        </button>
        <div
          className="absolute top-1/2 -translate-y-1/2 bg-[#1a1a1a] text-white text-sm px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[1000]"
          style={{ left: `${toolbarWidth}px` }}
        >
          {tool.label} {tool.shortcut && `(${tool.shortcut})`} {isActive && '(Active)'}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const calculateWidth = () => {
      if (window.innerWidth === 1452) {
        return 50;
      }
      const baseWidth = 50;
      const minWidth = 30;
      const maxWidth = 60;
      const widthPercentage = (window.innerWidth / 1452) * 100;
      const calculatedWidth = baseWidth * (widthPercentage / 100);
      return Math.max(minWidth, Math.min(maxWidth, calculatedWidth));
    };

    const updateWidth = () => {
      setToolbarWidth(calculateWidth());
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <div id="toolbar" ref={toolbarRef} className="border-r border-[var(--muted)] bg-[#1a1a1a]" style={{ width: `${toolbarWidth}px` }}>
      <div
        className="flex flex-col space-y-2 border-r border-t border-white/10"
        style={{ width: `${toolbarWidth}px`, padding: `${containerPadding}px` }}
      >
        {toolsToShow.map(renderToolButton)}
      </div>
    </div>
  );
}