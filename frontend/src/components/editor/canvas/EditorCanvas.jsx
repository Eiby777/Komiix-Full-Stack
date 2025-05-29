import { useEditorStore } from "../../../stores/editorStore";
import { CanvasContainer, CanvasEffects, ToolsContainer, CanvasResizeHandler } from "./components";
import ZoomControls from "../floating-menus/ZoomControls";
import { useFabricCanvas } from "./handlers/useFabricCanvas";
import { useCanvasZoom } from "./handlers/useCanvasZoom";

export default function EditorCanvas() {
  const { imagesLoaded, activeImageIndex, isSettingsVisible, images } = useEditorStore();

  useFabricCanvas(images);

  const zoomControls = useCanvasZoom();

  return (
    <div
      className={`${isSettingsVisible ? 'w-[80%]' : 'w-full'
        } overflow-auto transition-all duration-300`}
      id="div_editor"
    >
      <CanvasContainer images={images} isLoading={!imagesLoaded} />
      <ToolsContainer currentImageIndex={activeImageIndex} />
      <ZoomControls {...zoomControls} />
      <CanvasEffects />
      <CanvasResizeHandler />
    </div>
  );
}