import fabric from "../../../../../../constants/fabricInstance";
import { LAYERS } from "../../../../../../constants/layers";
import { v4 as uuid } from "uuid";
import ObjectStatus from "../../../../canvas/UndoRedoMenu/handlers/enumObjectRequests";

class CustomHardnessBrush extends fabric.BaseBrush {
  constructor(canvas, options, saveState) {
    super(canvas);
    this.canvas = canvas;
    this.baseWidth = options.width || 10; // Tamaño base del pincel
    this.color = options.color || "#000000";
    this.hardness = options.hardness !== undefined ? options.hardness : 0.5;
    this.zoomLevel = options.zoomLevel || 1;
    this.points = [];
    this.hardness = Math.min(Math.max(this.hardness, 0.1), 1);
    this.width = this.baseWidth / this.zoomLevel; // Área de efecto ajustada
    this.saveState = saveState;
  } 

  setZoomLevel(zoomLevel) {
    this.zoomLevel = zoomLevel || 1;
    this.width = this.baseWidth / this.zoomLevel; // Recalculamos el área de efecto
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

    // Usamos el width ajustado dinámicamente
    const radius = this.width / 2;

    if (this.points.length >= 2) {
      const previousPoint = this.points[this.points.length - 2];
      const dist = this._getDistance(previousPoint, currentPoint);
      const step = Math.max(1, radius / 2);
      const steps = Math.floor(dist / step);
      for (let i = 1; i <= steps; i++) {
        const t = i / (steps + 1);
        const interpolatedPoint = this._interpolatePoint(
          previousPoint,
          currentPoint,
          t
        );
        this._drawStamp(ctx, interpolatedPoint, radius);
      }
    }

    this._drawStamp(ctx, currentPoint, radius);
    ctx.restore();
  }

  _drawStamp(ctx, point, radius) {
    // Usamos el radius ajustado dinámicamente
    this._drawHardnessStamp(
      ctx,
      point.x,
      point.y,
      radius,
      this.hardness,
      this.color
    );
  }

  _drawHardnessStamp(ctx, x, y, radius, hardness, color) {
    const normalizedHardness = Math.min(Math.max(hardness, 0), 1);

    if (normalizedHardness >= 1) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2, false);
      ctx.fill();
    } else {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      const rgbaColor = this._getColorWithAlpha(color, 1);
      const transparentColor = this._getColorWithAlpha(color, 0);

      gradient.addColorStop(0, rgbaColor);
      gradient.addColorStop(normalizedHardness, rgbaColor);
      gradient.addColorStop(1, transparentColor);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2, false);
      ctx.fill();
    }
  }

  _getColorWithAlpha(color, alpha) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  _getDistance(p1, p2) {
    return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
  }

  _interpolatePoint(p1, p2, t) {
    return new fabric.Point(p1.x + (p2.x - p1.x) * t, p1.y + (p2.y - p1.y) * t);
  }

  _generateAllStamps() {
    const radius = this.width / 2; // Usamos el width ajustado
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

    const radius = this.width / 2; // Usamos el width ajustado
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
      this._drawHardnessStamp(ctx, x, y, radius, this.hardness, this.color);
    });

    const img = new fabric.FabricImage(offScreenCanvas, {
      left: minX,
      top: minY,
      originX: "left",
      originY: "top",
      layer: LAYERS.CLEANUP.id,
      scaleX: 1,
      scaleY: 1,
      src: offScreenCanvas.toDataURL(),
      id: uuid(),
    });

    this.canvas.add(img);
    this.canvas.clearContext(this.canvas.contextTop);
    this.canvas.requestRenderAll();
    this.saveState(img, ObjectStatus.ADD);
  }
}

export default CustomHardnessBrush;
