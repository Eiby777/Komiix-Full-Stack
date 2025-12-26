import * as fabric from 'fabric';

/**
 * Patch fabric.Textbox to support "outside" stroke mode
 */

// Store original render method
const originalRender = fabric.Textbox.prototype._render;

// Add strokeMode property default to the prototype
fabric.Textbox.prototype.strokeMode = 'center';

// Ensure strokeMode triggers a cache invalidation (re-render)
if (fabric.Textbox.prototype.cacheProperties && Array.isArray(fabric.Textbox.prototype.cacheProperties)) {
    if (!fabric.Textbox.prototype.cacheProperties.includes('strokeMode')) {
        fabric.Textbox.prototype.cacheProperties.push('strokeMode');
    }
}

// Override _render
fabric.Textbox.prototype._render = function (ctx) {
    // If not using outside mode or no stroke, use default rendering
    if (this.strokeMode !== 'outside' || !this.stroke || this.strokeWidth <= 0) {
        originalRender.call(this, ctx);
        return;
    }

    // Safety check for width/height
    if (this.width <= 0 || this.height <= 0) {
        originalRender.call(this, ctx);
        return;
    }

    // To achieve a true "outside" stroke of width X, we need to draw 
    // a centered stroke of width X*2 and then hide the inner half.
    const effectiveStrokeWidth = this.strokeWidth * 2;

    // Get dimensions for the off-screen canvas with padding for stroke
    const padding = effectiveStrokeWidth;
    const width = this.width + padding * 2;
    const height = this.height + padding * 2;

    // Create off-screen canvas for compositing
    const offCanvas = document.createElement('canvas');
    // Using a reasonable scale factor for quality (match browser zoom or fixed 2)
    const scale = 2;
    offCanvas.width = width * scale;
    offCanvas.height = height * scale;
    const offCtx = offCanvas.getContext('2d');

    if (!offCtx) {
        originalRender.call(this, ctx);
        return;
    }

    // Scale for quality
    offCtx.scale(scale, scale);

    // Translate to center of off-screen canvas (Fabric coordinates are centered)
    offCtx.translate(width / 2, height / 2);

    // Step 1: Draw the stroke (at double width) on the off-screen canvas
    const originalFill = this.fill;
    const originalStroke = this.stroke;
    const originalStrokeWidth = this.strokeWidth;

    // First render ONLY the stroke
    this.fill = null;
    this.strokeWidth = effectiveStrokeWidth;
    originalRender.call(this, offCtx);

    // Step 2: Use 'destination-out' to cut out the interior shape
    offCtx.globalCompositeOperation = 'destination-out';
    this.stroke = null;
    this.strokeWidth = 0;
    this.fill = '#000000'; // Any opaque color works for cutting
    originalRender.call(this, offCtx);

    // Step 3: Draw the composited outline onto the main canvas
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(
        offCanvas,
        -width / 2, -height / 2,
        width, height
    );
    ctx.restore();

    // Step 4: Draw the fill on top (with a tiny bleed to fix gap)
    this.fill = originalFill;
    this.stroke = originalFill; // Same color as fill to bleed into the outline
    this.strokeWidth = 0.5;      // Small overlap to avoid antialiasing gap
    originalRender.call(this, ctx);

    // Restore all properties to their original state
    this.stroke = originalStroke;
    this.strokeWidth = originalStrokeWidth;
};

// Ensure strokeMode is serialized
const originalToObject = fabric.Textbox.prototype.toObject;
fabric.Textbox.prototype.toObject = function (propertiesToInclude = []) {
    return {
        ...originalToObject.call(this, propertiesToInclude),
        strokeMode: this.strokeMode,
    };
};

console.log('Fabric Textbox patched with Outline support');
