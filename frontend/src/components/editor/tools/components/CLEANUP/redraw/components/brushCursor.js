export const createBrushCursor = (size) => {
    const maxBrushSize = 64;
    const maxCanvasSize = 128;
    const desiredCanvasSize = size * 2;
  
    let canvasSize = Math.min(desiredCanvasSize, maxCanvasSize);
    const scaleFactor = canvasSize / desiredCanvasSize;
  
    const cursorCanvas = document.createElement("canvas");
    cursorCanvas.width = canvasSize;
    cursorCanvas.height = canvasSize;
    const ctx = cursorCanvas.getContext("2d");
  
    ctx.scale(scaleFactor, scaleFactor);
  
    const centerX = desiredCanvasSize / 2;
    const centerY = desiredCanvasSize / 2;
    const radius = (size / 2) * (1 / scaleFactor);
  
    ctx.clearRect(0, 0, canvasSize, canvasSize);
  
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#FF4444";
    ctx.lineWidth = 2 / scaleFactor;
    ctx.stroke();
  
    ctx.beginPath();
    ctx.moveTo(centerX - radius * 0.5, centerY);
    ctx.lineTo(centerX + radius * 0.5, centerY);
    ctx.moveTo(centerX, centerY - radius * 0.5);
    ctx.lineTo(centerX, centerY + radius * 0.5);
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 1 / scaleFactor;
    ctx.stroke();
  
    const hotspot = canvasSize / 2;
  
    return {
      dataURL: cursorCanvas.toDataURL(),
      hotspotX: hotspot,
      hotspotY: hotspot,
    };
  };