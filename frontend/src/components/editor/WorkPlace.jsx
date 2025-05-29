import { PanTool } from './tools/components';
import { useEditorStore } from '../../stores/editorStore';
import { TOOLS } from '../../constants/tools';
import { useEffect } from 'react';
import { LAYERS } from '../../constants/layers';
import ToggleConfigButton from './floating-menus/components/ToggleConfigButton';

export default function EditorLayout({
  header,
  toolbar,
  canvas,
  settingsPanel
}) {
  const {
    activeTools,
    activeLayer,
    toggleTool,
    headerHeight
  } = useEditorStore();

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key.toLowerCase() !== "n") return;
      if (LAYERS.ANNOTATION.id !== activeLayer) return;

      toggleTool(TOOLS.PLUS.id);
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [toggleTool]);

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {header}
      <div className="flex-1 flex relative" style={{ paddingTop: headerHeight }}>
        {toolbar}
        {canvas}
        {settingsPanel}
        <ToggleConfigButton />
      </div>
      {activeTools.includes(TOOLS.PAN.id) && <PanTool />}
    </div>
  );
}