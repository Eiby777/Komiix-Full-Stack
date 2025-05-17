import { useEditorStore } from '../../../stores/editorStore';
import { TOOL_GROUPS } from '../../../constants/tools';
import { LAYERS } from '../../../constants/layers';

export default function ToolsSideBar() {
  const { activeTools, toggleTool, activeLayer } = useEditorStore();

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
          className={`p-2 rounded-lg transition-all w-full ${
            isActive
              ? 'bg-[#4a90e2] text-white'
              : isCompatibleActive
              ? 'bg-[#2d5c8a] text-white'
              : 'bg-[#1a1a1a] hover:bg-[#333333]'
          }`}
        >
          <div className="flex justify-center">
            <tool.icon className="w-6 h-6 text-white" />
          </div>
        </button>
        <div
  className="absolute left-[50px] top-1/2 -translate-y-1/2 bg-[#1a1a1a] text-white text-sm px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10"
>
  {tool.label} {tool.shortcut && `(${tool.shortcut})`} {isActive && '(Active)'}
</div>
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-2 p-2 border-r border-t border-white/10">
      {toolsToShow.map(renderToolButton)}
    </div>
  );
}