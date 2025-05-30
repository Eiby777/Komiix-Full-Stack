export const createTextSlice = (set, get) => ({
  textData: [[]],
  setTextData: (newTextData) => set((state) => ({
    ...state,
    textData: typeof newTextData === 'function' ? newTextData(state.textData) : newTextData
  })),
  configTypeTexts: {
    normal: {},
    scream: {},
    touched: {},
    think: {},
    sentence: {},
  },
  setConfigTypeTexts: (updater) => set((draft) => {
    updater(draft.configTypeTexts);
  }),
  getConfigTypeTexts: () => get().configTypeTexts,
  updateTextConfig: (textObject, typeText) => {
    
    const { canvasObjectStatus, canvasInstances } = get();
    canvasInstances.forEach((canvas, index) => { 
      if (!canvasObjectStatus[index]) return;
      
      const objects = canvas.getObjects();
      const hasTextBox = objects.some((obj) => obj.type === 'textbox' && obj !== textObject && obj.typeText === typeText);
      if (!hasTextBox) return;
      
      const textBoxes = objects.filter((obj) => obj.type === 'textbox' && obj !== textObject && obj.typeText === typeText);
      const configTypeText = get().configTypeTexts[typeText] ?? {};
      const propertiesToApply = [
        'fontFamily', 'lineHeight', 'fill', 'stroke', 'textAlign',
        'uppercase', 'lowercase', 'underline', 'strikethrough', 'italic', 'bold', 'strokeWidth'
      ];
      const propertiesToApplyFiltered = propertiesToApply.
      filter((property) => (property === 'stroke' || 
      configTypeText[property] !== undefined && configTypeText[property] !== null));
      
      textBoxes.forEach((textBox) => {
        propertiesToApplyFiltered.forEach((property) => {
          if (configTypeText[property] !== undefined && configTypeText[property] !== null || property === 'stroke') {
            if (property === 'bold') {
              textBox.set('fontWeight', configTypeText[property] === true ? 'bold' : 'normal');
            } else if (property === 'italic') {
              textBox.set('fontStyle', configTypeText[property] === true ? 'italic' : 'normal');
            } else if (property === 'strikethrough') {
              textBox.set('linethrough', configTypeText[property] === true ? 'linethrough' : null);
            } else if (property === 'stroke') {
              textBox.set('stroke', ![undefined, false, null].includes(configTypeText[property]) ? configTypeText[property] : null);
            } else if (property === 'uppercase') {
              textBox.set('text', configTypeText[property] === true ? textObject.text.toUpperCase() : textObject.text);
            } else if (property === 'lowercase') {
              textBox.set('text', configTypeText[property] === true ? textObject.text.toLowerCase() : textObject.text);
            } else {
              textBox.set(property, configTypeText[property]);
            }
          }
        });
        textBox.setCoords();
      });
      
      canvas.requestRenderAll();
    });
  },

  isDownloadingModels: false,
  setIsDownloadingModels: (value) => set((draft) => {
    draft.isDownloadingModels = value;
  })
});