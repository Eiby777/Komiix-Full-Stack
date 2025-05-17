import LoadingOverlay from "./Components/LoadingOverlay";
import { useEditorStore } from "../../../../../../stores/editorStore";
import { useEffect, useRef } from "react";

export default function CanvasContainer({ images, isLoading }) {
  const { activeImageIndex, getCanvasInstance, setZoomLevel } = useEditorStore();
  const containerRef = useRef(null);

  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey) return;
      
      const activeCanvas = getCanvasInstance(activeImageIndex);
      if (!activeCanvas) return;
  
      e.preventDefault();
  
      const vpt = activeCanvas.viewportTransform;
      vpt[5] -= e.deltaY;
      activeCanvas.requestRenderAll();
  
      const newZoom = activeCanvas.getZoom() + 0.0000000001;
      setZoomLevel(activeImageIndex, newZoom);
    };
  
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        container.removeEventListener("wheel", handleWheel);
      };
    }
  }, [activeImageIndex, getCanvasInstance, setZoomLevel]);

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <div
        className="mx-auto"
        id="div_todo"
        style={{ width: "100%", height: "100%", position: "relative" }}
        ref={containerRef}
      >
        <div
          id="div_canvases"
          className="bg-[#1a1a1a] rounded-lg overflow-hidden shadow-xl"
          style={{ width: "100%", height: "100%", position: "relative" }}
        >
          {images.map((_, index) => (
            <div
              key={index}
              className="absolute inset-0"
              style={{
                opacity: index === activeImageIndex ? 1 : 0,
                zIndex: index === activeImageIndex ? images.length : 1,
              }}
            >
              <canvas
                id={`canvas-original-${index}`}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}