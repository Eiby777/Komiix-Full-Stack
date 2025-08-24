// Handlers para las funciones de exportación

import { generatePrompt, downloadFile, extractTextsFromCanvas } from './utils.js';

export const createExportHandler = (canvasInstances, exportFormat) => {
  return () => {
    const textsByCanvas = extractTextsFromCanvas(canvasInstances);
    const dataStr = JSON.stringify(textsByCanvas, null, 2);
    const prompt = generatePrompt();

    if (exportFormat === 'download') {
      downloadFile(dataStr);
    }

    return {
      json: dataStr,
      prompt: prompt,
      wasDownloaded: exportFormat === 'download'
    };
  };
};
