import fabric from "../../../../../../constants/fabricInstance";

class CustomEraserBrush extends fabric.PencilBrush {
  constructor(canvas, activeLayer, saveState) {
    super(canvas);
    this.startX = null;
    this.startY = null;
    this.selectionRect = null;
    this.width = 20;
    this.activeLayer = activeLayer;
    this.saveState = saveState;
  }

  onMouseDown(pointer) {
    if (!this.canvas) return;
    
    this.startX = pointer.x;
    this.startY = pointer.y;
    
    this.selectionRect = new fabric.Rect({
      left: this.startX,
      top: this.startY,
      width: 0,
      height: 0,
      fill: "rgba(0,0,0,0.1)",
      stroke: "rgba(255,0,0,0.8)",
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
    });
    
    this.canvas.add(this.selectionRect);
    this.canvas.renderAll();
  }

  onMouseMove(pointer) {
    if (!this.selectionRect || !this.canvas) return;

    const x = Math.min(this.startX, pointer.x);
    const y = Math.min(this.startY, pointer.y);
    const width = Math.abs(pointer.x - this.startX);
    const height = Math.abs(pointer.y - this.startY);

    this.selectionRect.set({ left: x, top: y, width, height });
    this.selectionRect.setCoords();

    const selectionBounds = this.selectionRect.getBoundingRect();
    const objects = this.canvas.getObjects();

    objects.forEach((obj) => {
      if (obj !== this.selectionRect && "layer" in obj && obj.layer === this.activeLayer) {
        const objBounds = obj.getBoundingRect();
        if (this._rectsIntersect(selectionBounds, objBounds)) {
          this.canvas.remove(obj);
          this.saveState(obj);
        }
      }
    });

    this.canvas.renderAll();
  }

  onMouseUp() {
    if (!this.canvas || !this.selectionRect) return;

    this.canvas.remove(this.selectionRect);
    this.selectionRect = null;
    this.startX = null;
    this.startY = null;
    this.canvas.renderAll();
  }

  _rectsIntersect(rect1, rect2) {
    return !(
      rect2.left > rect1.left + rect1.width ||
      rect2.left + rect2.width < rect1.left ||
      rect2.top > rect1.top + rect1.height ||
      rect2.top + rect2.height < rect1.top
    );
  }
}

export default CustomEraserBrush;