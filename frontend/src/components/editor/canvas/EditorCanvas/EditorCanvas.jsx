import { useEditorStore } from "../../../../stores/editorStore";
import { CanvasContainer, CanvasEffects, ToolsContainer, CanvasResizeHandler } from "./components";
import ZoomControls from "../ZoomControls";
import { useFabricCanvas } from "./handlers/useFabricCanvas";
import { useCanvasZoom } from "./handlers/useCanvasZoom";

export default function EditorCanvas({ images }) {
  const { imagesLoaded, activeImageIndex } = useEditorStore();
  useFabricCanvas(images);
  const zoomControls = useCanvasZoom();

  return (
    <>
      <CanvasContainer images={images} isLoading={!imagesLoaded} />
      <ToolsContainer currentImageIndex={activeImageIndex} />
      <ZoomControls {...zoomControls} />
      <CanvasEffects />
      <CanvasResizeHandler />
    </>
  );
}