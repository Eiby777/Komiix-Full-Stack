import fabric from "../../../../../../../constants/fabricInstance";
import { v4 as uuidv4 } from "uuid";

const createMaskOverlay = (
    canvas,
    minimumZoom,
) => {
    const MASK_OVERLAY_ID = "main-mask-overlay";
    const MASK_BACKGROUND_LAYER = "mask-background";
    const { width, height } = canvas;
    const adjustedWidth = width / minimumZoom;
    const adjustedHeight = height / minimumZoom;
    const offsetX = minimumZoom < 1 ? -(adjustedWidth - width) / 2 : 0;
    const offsetY = minimumZoom < 1 ? -(adjustedHeight - height) / 2 : 0;

    return new fabric.Rect({
      width: adjustedWidth,
      height: adjustedHeight,
      left: offsetX,
      top: offsetY,
      fill: "rgba(0, 0, 0, 0.7)",
      selectable: false,
      evented: false,
      isMaskOverlay: true,
      maskId: MASK_OVERLAY_ID,
      originX: "left",
      originY: "top",
      layer: MASK_BACKGROUND_LAYER,
      id: uuidv4(),
    });
  };

export default createMaskOverlay;