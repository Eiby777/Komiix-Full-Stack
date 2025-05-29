import { PanTool } from './tools/components';
import { useEditorStore } from '../../stores/editorStore';
import { TOOLS } from '../../constants/tools';
import { useEffect, useState, useRef } from 'react';
import { LAYERS } from '../../constants/layers';
import ToggleConfigButton from './floating-menus/ToggleConfigButton';

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
  } = useEditorStore();

  const [isCanvasLoaded, setIsCanvasLoaded] = useState(false);
  const [topPositionIcons, setTopPositionIcons] = useState("");
  const [toolbarWidth, setToolbarWidth] = useState(50);
  const toolbarRef = useRef(null);
  const settingsButtonRef = useRef(null);

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

  // Calculate settings button size based on height
  const calculateButtonSize = () => {
    const baseSize = 34; // Size at 952px height
    const minSize = 30;
    const maxSize = 34;
    const scaleFactor = Math.max(0.7, Math.min(1, window.innerHeight / 952));
    const calculatedSize = baseSize * scaleFactor;
    return Math.max(minSize, Math.min(maxSize, calculatedSize));
  };

  const [settingsButtonSize, setSettingsButtonSize] = useState(calculateButtonSize());

  useEffect(() => {
    const updateSize = () => {
      setSettingsButtonSize(calculateButtonSize());
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key.toLowerCase() !== "n") return;
      if (LAYERS.ANNOTATION.id !== activeLayer) return;

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
        <div ref={toolbarRef} className="border-r border-[var(--muted)] bg-[#1a1a1a]" style={{ width: `${toolbarWidth}px` }}>
          {toolbar}
        </div>

        {canvas}

        {isCanvasLoaded && undoRedoMenu}

        {settingsPanel}

        {/* Botón de configuración */}
        <ToggleConfigButton
          settingsButtonRef={settingsButtonRef}
          toggleSettingsPanel={toggleSettingsPanel}
          topPositionIcons={topPositionIcons}
          configIconsPositions={configIconsPositions}
          settingsButtonSize={settingsButtonSize}
        />
      </div>
      {activeTools.includes(TOOLS.PAN.id) && <PanTool />}
    </div>
  );
}