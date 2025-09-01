// Handlers para las funciones de importación

import { validateJsonText } from './utils.js';

export const createImportTextHandler = (importText, updateTextsFromJson, onSuccess) => {
  return () => {
    if (!importText.trim()) {
      alert('Por favor, pega el JSON traducido en el campo de texto');
      return;
    }

    const validation = validateJsonText(importText);
    if (!validation.valid) {
      alert('El texto pegado no es un JSON válido. Asegúrate de que sea el resultado exacto de tu LLM.');
      return;
    }

    try {
      updateTextsFromJson(validation.data);
      onSuccess();
    } catch (error) {
      console.error('Error updating texts from JSON:', error);
      alert('Error al actualizar los textos. Verifica que el formato sea correcto.');
    }
  };
};

export const createImportFileHandler = (file, updateTextsFromJson, onSuccess) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve();
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        updateTextsFromJson(jsonData);
        onSuccess();
        resolve();
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        alert('Formato de archivo JSON inválido');
        reject(error);
      }
    };

    reader.onerror = () => {
      alert('Error al leer el archivo');
      reject(new Error('Error reading file'));
    };

    reader.readAsText(file);
  });
};

export const createDragAndDropHandlers = (setIsDragOver) => {
  return {
    handleDragOver: (e) => {
      e.preventDefault();
      setIsDragOver(true);
    },

    handleDragLeave: (e) => {
      e.preventDefault();
      setIsDragOver(false);
    },

    handleDrop: (file, updateTextsFromJson, onSuccess) => {
      return (e) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
          const droppedFile = files[0];
          if (droppedFile.type === 'application/json' || droppedFile.name.endsWith('.json')) {
            return createImportFileHandler(droppedFile, updateTextsFromJson, onSuccess)();
          } else {
            alert('Por favor, arrastra un archivo JSON válido');
          }
        }
      };
    }
  };
};
