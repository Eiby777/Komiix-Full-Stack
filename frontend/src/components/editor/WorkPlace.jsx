import { PanTool } from './tools/components'
import { useEditorStore } from '../../stores/editorStore'
import { TOOLS } from '../../constants/tools'
import { useEffect, useState, useRef } from 'react';
import { LAYERS } from '../../constants/layers';
import { FaCog } from 'react-icons/fa';

export default function EditorLayout({
  header,
  toolbar,
  canvas,
  settingsPanel,
  layerPanel,
  undoRedoMenu
}) {
  const {
    activeTools,
    activeLayer,
    toggleTool,
    configIconsPositions,
    setConfigIconsPositions,
    isSettingsVisible,
    setIsSettingsVisible,
    isLayerCarouselVisible,
    headerHeight
  } = useEditorStore()

  const [isCanvasLoaded, setIsCanvasLoaded] = useState(false);
  const [topPositionIcons, setTopPositionIcons] = useState("");
  const toolsHeight = useRef("75px");

  useEffect(() => {
    console.log(toolsHeight.current.offsetWidth)
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key.toLowerCase() != "n") return
      if (LAYERS.ANNOTATION.id != activeLayer) return

      toggleTool(TOOLS.PLUS.id);
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [toggleTool]);

  useEffect(() => {
    if (canvas) {
      setIsCanvasLoaded(true);
    }
  }, [canvas]);

  const toggleSettingsPanel = () => {
    setIsSettingsVisible(!isSettingsVisible);
    setConfigIconsPositions('settingsIcon', {
      ...configIconsPositions.settingsIcon,
      right: !isSettingsVisible ? "20%" : "10%",
    });
  };

  useEffect(() => {
    const undoRedoActive = configIconsPositions.undoRedoIcon.active;
    const topPosition = undoRedoActive
      ? isLayerCarouselVisible
        ? "16.7rem"
        : "14.9rem"
      : isLayerCarouselVisible
        ? "17.7rem"
        : "15.5rem";
    setTopPositionIcons(topPosition);
  }, [isLayerCarouselVisible, configIconsPositions]);

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <div className="flex-shrink-0 flex">
        {header}
      </div>
      <div className="flex-1 flex relative" style={{ paddingTop: headerHeight }}>
        {layerPanel}
        <div ref={toolsHeight} className="border-r border-[var(--muted)] bg-[#1a1a1a]" style={{ width: "50px" }}>
          {toolbar}
        </div>
        <div
          className={`${isSettingsVisible ? 'w-[80%]' : 'w-full'
            } overflow-auto transition-all duration-300`}
          id="div_editor"
        >
          {canvas}
        </div>
        {isCanvasLoaded && undoRedoMenu}
        <div
          className={`flex w-[20%] min-w-[230px] transition-all duration-300 ${isSettingsVisible ? 'block' : 'hidden'
            }`}
        >
          <div className="border-l border-[var(--muted)] bg-[var(--muted)] w-[100%]">
            {settingsPanel}
          </div>
        </div>
        {/* Botón de configuración */}
        <button
          onClick={toggleSettingsPanel}
          style={{
            position: 'fixed',
            top: topPositionIcons,
            right: configIconsPositions.settingsIcon.right,
            zIndex: 50,
            padding: '0.5rem',
            backgroundColor: '#2a2a2a',
            borderRadius: '0.375rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid rgba(55, 65, 81, 0.5)',
            color: 'white',
            transition: 'background-color 600ms'
          }}
          className="hover:bg-[#357abd]"
          title="Toggle settings panel"
        >
          <FaCog className="w-4 h-4" />
        </button>
      </div>
      {activeTools.includes(TOOLS.PAN.id) && <PanTool />}
    </div>
  );
}
