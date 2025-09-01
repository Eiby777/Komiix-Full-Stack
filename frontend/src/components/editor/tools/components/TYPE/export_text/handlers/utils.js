// Utilidades generales para ExportTextTool

export const generatePrompt = () => {
  return `Por favor, traduce el contenido de texto al [ESCRIBIR IDIOMA DESTINO] en el JSON que te voy a proporcionar manteniendo exactamente el mismo formato y estructura. La traducción debe ir en la propiedad "translatedText".

Instrucciones:
1. Mantén la propiedad "originalText" sin cambios
2. Traduce únicamente la propiedad "translatedText" de cada objeto
3. Mantén todos los IDs y la estructura del JSON exactamente igual
4. Retorna únicamente el JSON traducido sin explicaciones adicionales
5. Asegúrate de que la traducción sea consistente en terminología`;
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    // Podríamos agregar una notificación de éxito aquí si fuera necesario
  } catch (err) {
    console.error('Error al copiar al portapapeles:', err);
    // Fallback: crear un elemento temporal para copiar
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
};

export const downloadFile = (dataStr, fileName = 'text-export.json') => {
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', fileName);
  linkElement.click();
};

export const extractTextsFromCanvas = (canvasInstances) => {
  return canvasInstances.map((canvas, canvasIndex) => {
    const textObjects = canvas.getObjects().filter(obj => obj.type === 'textbox');
    return textObjects.map(obj => ({
      id: obj.id,
      originalText: obj.originalText || obj.text,
      translatedText: obj.translatedText || obj.text
    }));
  });
};

export const validateJsonText = (text) => {
  try {
    JSON.parse(text.trim());
    return { valid: true, data: JSON.parse(text.trim()) };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};
