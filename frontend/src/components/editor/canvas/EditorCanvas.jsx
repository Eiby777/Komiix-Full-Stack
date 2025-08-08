import { useEditorStore } from "../../../stores/editorStore";
import { CanvasContainer, CanvasEffects, ToolsContainer, CanvasResizeHandler } from "./components";
import { useFabricCanvas } from "./handlers/useFabricCanvas";
import FloatingMenus from "../floating-menus/FloatingMenus";

export default function EditorCanvas() {
  const { imagesLoaded, activeImageIndex, isSettingsVisible, images } = useEditorStore();

  useFabricCanvas(images);

  return (
    <div
      className={`${isSettingsVisible ? 'w-[80%]' : 'w-full'
        } transition-all duration-300 overflow-hidden`}
      id="div_editor"
    >
      <CanvasContainer images={images} isLoading={!imagesLoaded} />
      <ToolsContainer currentImageIndex={activeImageIndex} />
      <CanvasEffects />
      <CanvasResizeHandler />
      <FloatingMenus />
    </div>
  );
}