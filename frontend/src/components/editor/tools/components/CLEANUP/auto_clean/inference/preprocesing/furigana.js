/**
 * Detects and removes furigana from a binarized canvas
 */
export class Furigana {
    constructor() {
      this.FURIGANA_MIN_FG_PIX_PER_LINE = 3.0; // Minimum foreground pixels per line
      this.FURIGANA_MIN_WIDTH = 5.0; // Minimum span width
      this.NO_VALUE = -1; // Indicates unset span start/end
    }
  
    /**
     * Erases furigana from a vertical text canvas
     * @param {HTMLCanvasElement} canvas - Binarized canvas (0 for text, 255 for background)
     * @param {number} scaleFactor - Scaling factor for thresholds
     * @returns {Object} Updated canvas and number of text lines
     */
    eraseFuriganaVertical(canvas, scaleFactor) {
      const minFgPixPerLine = Math.round(this.FURIGANA_MIN_FG_PIX_PER_LINE * scaleFactor);
      const minSpanWidth = Math.round(this.FURIGANA_MIN_WIDTH * scaleFactor);
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const spans = [];
      let span = { start: this.NO_VALUE, end: this.NO_VALUE };
      let numGoodLinesInCurSpan = 0;
      let totalGoodLines = 0;
  
      // Scan columns for foreground pixel spans
      for (let x = 0; x < canvas.width; x++) {
        let numFgPixelsOnLine = 0;
        let goodLine = false;
  
        for (let y = 0; y < canvas.height; y++) {
          const idx = (y * canvas.width + x) * 4;
          if (data[idx] === 0) { // Foreground pixel (text)
            numFgPixelsOnLine++;
            if (numFgPixelsOnLine >= minFgPixPerLine) {
              goodLine = true;
              break;
            }
          }
        }
  
        if (goodLine && x === canvas.width - 1) {
          goodLine = false;
          numGoodLinesInCurSpan++;
        }
  
        if (goodLine) {
          if (span.start === this.NO_VALUE) {
            span.start = x;
          }
          numGoodLinesInCurSpan++;
        } else {
          if (span.start !== this.NO_VALUE) {
            if (numGoodLinesInCurSpan >= minSpanWidth) {
              span.end = x;
              totalGoodLines += numGoodLinesInCurSpan;
              spans.push({ start: span.start, end: span.end });
            }
            span = { start: this.NO_VALUE, end: this.NO_VALUE };
            numGoodLinesInCurSpan = 0;
          }
        }
      }
  
      if (spans.length === 0) {
        return { canvas, numTextLines: 0 };
      }
  
      // Calculate mean width of largest 50% of spans
      const spanLengths = spans.map(s => s.end - s.start).sort((a, b) => a - b);
      const meanUpperHalf = spanLengths
        .slice(Math.floor(spanLengths.length / 2))
        .reduce((sum, len) => sum + len, 0) / (spanLengths.length - Math.floor(spanLengths.length / 2));
  
      let x = 0;
      let numMinorSpans = 0;
  
      // Erase areas where no span exists or spans are too narrow
      for (const span of spans) {
        if (span.end - span.start >= meanUpperHalf * 0.6) {
          this.eraseAreaLeftToRight(canvas, x, span.start - x);
          x = span.end + 1;
        } else {
          numMinorSpans++;
        }
      }
  
      const numTextLines = Math.max(spans.length - numMinorSpans, 1);
  
      if (x > 0 && x < canvas.width - 1) {
        this.eraseAreaLeftToRight(canvas, x, canvas.width - x);
      }
  
      return { canvas, numTextLines };
    }
  
    /**
     * Erases furigana from a horizontal text canvas
     * @param {HTMLCanvasElement} canvas - Binarized canvas (0 for text, 255 for background)
     * @param {number} scaleFactor - Scaling factor for thresholds
     * @returns {Object} Updated canvas and number of text lines
     */
    eraseFuriganaHorizontal(canvas, scaleFactor) {
      const minFgPixPerLine = Math.round(this.FURIGANA_MIN_FG_PIX_PER_LINE * scaleFactor);
      const minSpanWidth = Math.round(this.FURIGANA_MIN_WIDTH * scaleFactor);
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const spans = [];
      let span = { start: this.NO_VALUE, end: this.NO_VALUE };
      let numGoodLinesInCurSpan = 0;
      let totalGoodLines = 0;
  
      // Scan rows for foreground pixel spans
      for (let y = 0; y < canvas.height; y++) {
        let numFgPixelsOnLine = 0;
        let goodLine = false;
  
        for (let x = 0; x < canvas.width; x++) {
          const idx = (y * canvas.width + x) * 4;
          if (data[idx] === 0) { // Foreground pixel (text)
            numFgPixelsOnLine++;
            if (numFgPixelsOnLine >= minFgPixPerLine) {
              goodLine = true;
              break;
            }
          }
        }
  
        if (goodLine && y === canvas.height - 1) {
          goodLine = false;
          numGoodLinesInCurSpan++;
        }
  
        if (goodLine) {
          if (span.start === this.NO_VALUE) {
            span.start = y;
          }
          numGoodLinesInCurSpan++;
        } else {
          if (span.start !== this.NO_VALUE) {
            if (numGoodLinesInCurSpan >= minSpanWidth) {
              span.end = y;
              totalGoodLines += numGoodLinesInCurSpan;
              spans.push({ start: span.start, end: span.end });
            }
            span = { start: this.NO_VALUE, end: this.NO_VALUE };
            numGoodLinesInCurSpan = 0;
          }
        }
      }
  
      if (spans.length === 0) {
        return { canvas, numTextLines: 0 };
      }
  
      // Calculate mean width of largest 50% of spans
      const spanLengths = spans.map(s => s.end - s.start).sort((a, b) => a - b);
      const meanUpperHalf = spanLengths
        .slice(Math.floor(spanLengths.length / 2))
        .reduce((sum, len) => sum + len, 0) / (spanLengths.length - Math.floor(spanLengths.length / 2));
  
      let y = 0;
      let numMinorSpans = 0;
  
      // Erase areas where no span exists or spans are too narrow
      for (const span of spans) {
        if (span.end - span.start >= meanUpperHalf * 0.6) {
          this.eraseAreaTopToBottom(canvas, y, span.start - y);
          y = span.end + 1;
        } else {
          numMinorSpans++;
        }
      }
  
      const numTextLines = Math.max(spans.length - numMinorSpans, 1);
  
      if (y > 0 && y < canvas.height - 1) {
        this.eraseAreaTopToBottom(canvas, y, canvas.height - y);
      }
  
      return { canvas, numTextLines };
    }
  
    /**
     * Clears a left-to-right section of the canvas
     * @param {HTMLCanvasElement} canvas - The canvas to modify
     * @param {number} x - Start x coordinate
     * @param {number} width - Width of the area to clear
     */
    eraseAreaLeftToRight(canvas, x, width) {
      if (width <= 0) return;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgb(255, 255, 255)';
      ctx.fillRect(x, 0, width, canvas.height);
    }
  
    /**
     * Clears a top-to-bottom section of the canvas
     * @param {HTMLCanvasElement} canvas - The canvas to modify
     * @param {number} y - Start y coordinate
     * @param {number} height - Height of the area to clear
     */
    eraseAreaTopToBottom(canvas, y, height) {
      if (height <= 0) return;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgb(255, 255, 255)';
      ctx.fillRect(0, y, canvas.width, height);
    }
  }