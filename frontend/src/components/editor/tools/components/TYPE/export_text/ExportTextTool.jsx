import React, { useState, useEffect } from 'react';
import { useEditorStore } from '../../../../../../stores/editorStore';
import { TOOLS } from '../../../../../../constants/tools';

// Components
import PromptModal from './components/PromptModal.jsx';
import ExportSection from './components/ExportSection.jsx';
import ImportSection from './components/ImportSection.jsx';

// Handlers
import { createExportHandler } from './handlers/exportHandlers.js';
import { createImportTextHandler } from './handlers/importHandlers.js';

const ExportTextTool = () => {
  const { canvasInstances, activeTools, toggleTool } = useEditorStore();
  const [showModal, setShowModal] = useState(false);
  const [importMode, setImportMode] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [exportData, setExportData] = useState(null);
  const [exportFormat, setExportFormat] = useState('copy');
  const [importText, setImportText] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  // Modal visibility effect
  useEffect(() => {
    if (activeTools.includes(TOOLS.EXPORT_TEXT.id)) {
      setShowModal(true);
    } else {
      setShowModal(false);
      setImportMode(false);
    }
  }, [activeTools, TOOLS.EXPORT_TEXT.id]);

  // Update texts from JSON data
  const updateTextsFromJson = (jsonData) => {
    jsonData.forEach((canvasTexts, canvasIndex) => {
      const canvas = canvasInstances[canvasIndex];
      if (!canvas) return;

      canvasTexts.forEach(textData => {
        const textObject = canvas.getObjects().find(obj => obj.type === 'textbox' && obj.id === textData.id);
        if (textObject) {
          textObject.set({
            text: textData.translatedText || '',
            originalText: textData.text || '',
            translatedText: textData.translatedText || ''
          });
        }
      });

      canvas.requestRenderAll();
    });
  };

  // Export handler
  const handleExport = () => {
    const exportHandler = createExportHandler(canvasInstances, exportFormat);
    const data = exportHandler();
    setExportData(data);
    setShowPrompt(true);
  };

  // Import handlers
  const handleImportText = createImportTextHandler(
    importText,
    updateTextsFromJson,
    () => {
      setShowModal(false);
      toggleTool(TOOLS.EXPORT_TEXT.id);
    }
  );

  const handleSuccess = () => {
    setShowModal(false);
    toggleTool(TOOLS.EXPORT_TEXT.id);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        // Handle file drop in import mode
        if (importMode) {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const jsonData = JSON.parse(e.target.result);
              updateTextsFromJson(jsonData);
              setShowModal(false);
              toggleTool(TOOLS.EXPORT_TEXT.id);
            } catch (error) {
              console.error('Error parsing JSON file:', error);
              alert('Invalid JSON file format');
            }
          };
          reader.readAsText(file);
        }
      } else {
        alert('Please drop a JSON file');
      }
    }
  };

  // Modal action handlers
  const handleCloseModal = () => {
    setShowModal(false);
    toggleTool(TOOLS.EXPORT_TEXT.id);
  };

  const handleClosePrompt = () => {
    setShowModal(false);
    setShowPrompt(false);
    setImportMode(false);
    toggleTool(TOOLS.EXPORT_TEXT.id);
  };

  const handleBackFromPrompt = () => {
    setShowPrompt(false);
  };

  const handleSwitchToImport = () => {
    setImportMode(true);
  };

  const handleSwitchToExport = () => {
    setImportMode(false);
  };

  // Don't render if modal is not active
  if (!showModal) {
    return null;
  }

  // Show prompt modal if active
  if (showPrompt && exportData) {
    return (
      <PromptModal
        exportData={exportData}
        onClose={handleClosePrompt}
        onBack={handleBackFromPrompt}
      />
    );
  }

  // Main modal content
  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-70"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="bg-[#1a1a1a] border border-white/20 rounded-md shadow-lg p-6 w-[500px] relative">
        <h3 className="text-lg font-semibold text-white/90 mb-4 text-center">
          {importMode ? 'Importar Textos' : 'Exportar Textos'}
        </h3>

        {!importMode ? (
          <ExportSection
            exportFormat={exportFormat}
            setExportFormat={setExportFormat}
            onExport={handleExport}
            onSwitchToImport={handleSwitchToImport}
          />
        ) : (
          <ImportSection
            importText={importText}
            setImportText={setImportText}
            isDragOver={isDragOver}
            onImportText={handleImportText}
            onSwitchToExport={handleSwitchToExport}
            updateTextsFromJson={updateTextsFromJson}
            onSuccess={handleSuccess}
          />
        )}

        <button
          onClick={handleCloseModal}
          className="absolute top-2 right-2 p-1 rounded-md hover:bg-gray-700/50 transition-colors duration-200"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ExportTextTool;
