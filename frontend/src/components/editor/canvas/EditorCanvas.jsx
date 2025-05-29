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
        } overflow-auto transition-all duration-300`}
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