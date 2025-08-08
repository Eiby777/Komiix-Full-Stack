import { PanTool } from './tools/components';
import { useEditorStore } from '../../stores/editorStore';
import { TOOLS } from '../../constants/tools';
import { useEffect } from 'react';
import { LAYERS } from '../../constants/layers';
import FloatingMenus from './floating-menus/FloatingMenus';
import Header from './header/Header';
import Toolbar from './toolbar/Toolbar';
import EditorCanvas from './canvas/EditorCanvas';
import SettingsPanel from './settings/SettingsPanel';

export default function EditorLayout() {
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
    <div className="h-screen bg-[var(--background)] flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 flex relative overflow-hidden" style={{ paddingTop: headerHeight }}>
        <Toolbar />
        <EditorCanvas />
        <SettingsPanel />
        <FloatingMenus />
      </div>
      {activeTools.includes(TOOLS.PAN.id) && <PanTool />}
    </div>
  );
}