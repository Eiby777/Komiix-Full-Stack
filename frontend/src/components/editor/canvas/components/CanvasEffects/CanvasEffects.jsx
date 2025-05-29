import { useEffect, useState } from "react";
import { useEditorStore } from "../../../../../stores/editorStore";
import { TOOLS } from "../../../../../constants/tools";

export default function CanvasEffects() {
  const { activeTools, imagesLoaded, dimensionImages, activeImageIndex } =
    useEditorStore();
  const isActive = activeTools.includes(TOOLS.PAN.id);
  const [_, setCurrentDimensions] = useState(null);

  useEffect(() => {
    if (imagesLoaded && dimensionImages && dimensionImages[activeImageIndex]) {
      setCurrentDimensions(dimensionImages[activeImageIndex]);
    }
  }, [imagesLoaded, dimensionImages, activeImageIndex]);

  useEffect(() => {
    const container = document.getElementById("div_editor");
    const canvases = document.querySelectorAll("canvas");

    if (!isActive) {
      canvases.forEach((canvas) => {
        canvas.style.cursor = "default";
        container.style.cursor = "default";
      });
      return;
    }

    canvases.forEach((canvas) => {
      canvas.style.cursor = "grab";
    });
  }, [isActive]);

  return null;
}
