import fabric from "../../../../../../../constants/fabricInstance";
import ObjectStatus from "../../../../../floating-menus/components/UndoRedoMenu/handlers/enumObjectRequests";
import { v4 as uuidv4 } from "uuid";

class SolidBrush extends fabric.BaseBrush {
  constructor(canvas, options, saveState) {
    super(canvas);
    this.canvas = canvas;
    this.baseWidth = options.width || 10; // Base brush size
    this.color = options.color || "#000000"; // Default to black
    this.zoomLevel = options.zoomLevel || 1;
    this.points = [];
    this.width = this.baseWidth / this.zoomLevel;
    this.maskId = options.maskId;
    this.saveState = saveState;
  }

  setZoomLevel(zoomLevel) {
    this.zoomLevel = zoomLevel || 1;
    this.width = this.baseWidth / this.zoomLevel; // Recalculate width
  }

  onMouseDown(pointer) {
    this.points = [];
    this._preparePoint(pointer);
    this.isDrawing = true;
    this._render();
  }

  onMouseMove(pointer) {
    if (this.isDrawing) {
      this._preparePoint(pointer);
      this._render();
    }
  }

  onMouseUp() {
    this.isDrawing = false;
    this._finalizeAndAddImage();
  }

  _preparePoint(pointer) {
    this.points.push(new fabric.Point(pointer.x, pointer.y));
  }

  _render() {
    const ctx = this.canvas.contextTop;
    const v = this.canvas.viewportTransform;
    const currentPoint = this.points[this.points.length - 1];
    if (!currentPoint) return;

    ctx.save();
    ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);

    const radius = this.width / 2;

    if (this.points.length >= 2) {
      const previousPoint = this.points[this.points.length - 2];
      const dist = this._getDistance(previousPoint, currentPoint);
      const step = Math.max(1, radius / 2);
      const steps = Math.floor(dist / step);
      for (let i = 1; i <= steps; i++) {
        const t = i / (steps + 1);
        const interpolatedPoint = this._interpolatePoint(previousPoint, currentPoint, t);
        this._drawStamp(ctx, interpolatedPoint, radius);
      }
    }

    this._drawStamp(ctx, currentPoint, radius);
    ctx.restore();
  }

  _drawStamp(ctx, point, radius) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2, false);
    ctx.fill();
  }

  _getDistance(p1, p2) {
    return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
  }

  _interpolatePoint(p1, p2, t) {
    return new fabric.Point(p1.x + (p2.x - p1.x) * t, p1.y + (p2.y - p1.y) * t);
  }

  _generateAllStamps() {
    const radius = this.width / 2;
    const allStamps = [];

    if (this.points.length === 0) return allStamps;

    allStamps.push(this.points[0]);
    for (let i = 1; i < this.points.length; i++) {
      const pPrev = this.points[i - 1];
      const pCurrent = this.points[i];
      const dist = this._getDistance(pPrev, pCurrent);
      const step = Math.max(1, radius / 2);
      const steps = Math.floor(dist / step);

      for (let j = 1; j <= steps; j++) {
        const t = j / (steps + 1);
        const interpolatedPoint = this._interpolatePoint(pPrev, pCurrent, t);
        allStamps.push(interpolatedPoint);
      }
      allStamps.push(pCurrent);
    }
    return allStamps;
  }

  _finalizeAndAddImage() {
    const allStamps = this._generateAllStamps();
    if (allStamps.length === 0) {
      this.canvas.clearContext(this.canvas.contextTop);
      this.canvas.renderAll();
      return;
    }

    const radius = this.width / 2;
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    allStamps.forEach((point) => {
      minX = Math.min(minX, point.x - radius);
      maxX = Math.max(maxX, point.x + radius);
      minY = Math.min(minY, point.y - radius);
      maxY = Math.max(maxY, point.y + radius);
    });

    const width = maxX - minX;
    const height = maxY - minY;
    if (width <= 0 || height <= 0) return;

    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = width;
    offScreenCanvas.height = height;
    const ctx = offScreenCanvas.getContext("2d");

    allStamps.forEach((point) => {
      const x = point.x - minX;
      const y = point.y - minY;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2, false);
      ctx.fill();
    });

    const img = new fabric.FabricImage(offScreenCanvas, {
      left: minX,
      top: minY,
      originX: "left",
      originY: "top",
      layer: "mask",
      scaleX: 1,
      scaleY: 1,
      src: offScreenCanvas.toDataURL(),
      id: uuidv4(),
    });

    this.canvas.add(img);
    this.canvas.clearContext(this.canvas.contextTop);
    this.canvas.requestRenderAll();
    this.saveState(img, ObjectStatus.ADD);
  }
}

export default SolidBrush;