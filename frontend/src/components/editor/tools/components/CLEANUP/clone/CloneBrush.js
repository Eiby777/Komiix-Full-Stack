import fabric from "../../../../../../constants/fabricInstance";

class CloneBrush extends fabric.BaseBrush {
  constructor(canvas, options) {
    super(canvas);
    this.canvas = canvas;
    this.cloneSource = null;
    this.baseWidth = options.width || 10; // Tamaño base
    this.hardness = options.hardness !== undefined ? options.hardness : 0.5;
    this.zoomLevel = options.zoomLevel || 1;
    this.width = this.baseWidth / this.zoomLevel; // Ajuste dinámico según zoom
  }

  setZoomLevel(zoomLevel) {
    this.zoomLevel = zoomLevel || 1;
    this.width = this.baseWidth / this.zoomLevel; // Recalcular el tamaño
  }

  setCloneSource(dataURL) {
    this.cloneSource = dataURL;
  }

  onMouseDown() {}
  onMouseUp() {}
  onMouseMove() {}
}

export default CloneBrush;