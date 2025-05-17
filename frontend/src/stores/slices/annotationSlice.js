export const createAnnotationSlice = (set, get) => ({
  convertToYOLO: (x, y, width, height, imageWidth, imageHeight) => {
    const x_center = (x + width / 2) / imageWidth;
    const y_center = (y + height / 2) / imageHeight;
    const w = width / imageWidth;
    const h = height / imageHeight;
    return { x: x_center, y: y_center, w, h };
  },
  colorToTypeMap: {
    "#4a90e2": "normal",
    "#ff6b6b": "scream",
    "#9775fa": "touched",
    "#69db7c": "think",
    "#ffa94d": "sentence",
    "#FFFF00": "text",
  },
  colorToTypeTextMap: {
    gray: 'Ninguno',
    '#4a90e2': 'normal',
    '#ff6b6b': 'scream',
    '#9775fa': 'touched',
    '#69db7c': 'think',
    '#ffa94d': 'sentence',
  },
  typeToColorMap: {
    normal: "#4a90e2",
    scream: "#ff6b6b",
    touched: "#9775fa",
    think: "#69db7c",
    sentence: "#ffa94d",
    text: "#FFFF00",
  },
  getTypeFromColor(color) {
    return get().colorToTypeMap[color] || "normal";
  },
  getColorFromType(type) {
    return get().typeToColorMap[type] || "#4a90e2";
  },
});
