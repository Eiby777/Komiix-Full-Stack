import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useEditorStore } from '../../../../../../stores/editorStore';
import { LAYERS } from '../../../../../../constants/layers';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  const [container, setContainer] = useState(null);

  useEffect(() => {
    const el = document.createElement('div');
    el.className = 'confirmation-overlay-container';
    document.body.appendChild(el);
    setContainer(el);
    return () => {
      if (document.body.contains(el)) document.body.removeChild(el);
    };
  }, []);

  if (!container) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[9999]">
      <div className="flex flex-col items-center space-y-4 bg-[#2a2a2a] p-6 rounded-md shadow-lg border border-gray-700/50 w-80">
        <p className="text-white text-lg text-center">{message}</p>
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors border border-red-700/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Confirmar
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors border border-gray-700/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>,
    container
  );
};

export default function RedrawSettings() {
  const {
    selectedRedrawSize,
    setSelectedRedrawSize,
    setShouldRedraw,
    setShouldRedrawCurrent,
    activeImageIndex,
    getCanvasInstance,
    getAllCanvasInstances,
    MASK,
    setMaskLayerState,
    setMaskLayerRedoState,
    activeLayer,
  } = useEditorStore();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleBrushSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setSelectedRedrawSize(newSize);
  };

  const handleRedraw = () => {
    setShouldRedraw(true);
    setShouldRedrawCurrent(false);
  };

  const handleRedrawCurrent = () => {
    setShouldRedraw(true);
    setShouldRedrawCurrent(true);
  };

  const resetAllMasks = () => {
    const canvases = getAllCanvasInstances();
    canvases.forEach((canvas, index) => {
      canvas.getObjects().forEach(obj => {
        if (obj.layer === MASK.id) {
          canvas.remove(obj);
        }
      });
      canvas.renderAll();
      setMaskLayerState(LAYERS.CLEANUP.id, index, []);
      setMaskLayerRedoState(LAYERS.CLEANUP.id, index, []);
    });
  };

  const handleResetAllMasks = () => {
    setShowConfirmation(true);
  };

  const confirmReset = () => {
    resetAllMasks();
    setShowConfirmation(false);
  };

  const resetMask = () => {
    const canvas = getCanvasInstance(activeImageIndex);
    canvas.getObjects().forEach(obj => {
      if (obj.layer === MASK.id) {
        canvas.remove(obj);
      }
    });
    canvas.renderAll();
    setMaskLayerState(LAYERS.CLEANUP.id, activeImageIndex, []);
    setMaskLayerRedoState(LAYERS.CLEANUP.id, activeImageIndex, []);
  };

  return (
    <div className="p-4 text-gray-300 rounded-lg shadow-md bg-[#1e1e1e] border border-gray-700/50">
      {/* Slider: Brush Size */}
      <div className="mb-6">
        <label htmlFor="brushSize" className="block text-sm font-medium mb-1 text-gray-300">
          Redraw Brush Size
        </label>
        <input
          id="brushSize"
          type="range"
          min="1"
          max="100"
          value={selectedRedrawSize}
          onChange={handleBrushSizeChange}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 accent-blue-600"
        />
        <div className="text-sm mt-1 text-gray-400">Size: {selectedRedrawSize}</div>
      </div>

      {/* Button: Redraw All */}
      <div className="mb-4">
        <button
          onClick={handleRedraw}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 border border-blue-700/50 shadow-sm"
        >
          Redibujar Todo
        </button>
      </div>

      {/* Button: Redraw Current */}
      <div className="mb-4">
        <button
          onClick={handleRedrawCurrent}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 border border-blue-700/50 shadow-sm"
        >
          Redibujar Imagen Actual
        </button>
      </div>

      {/* Button: Reset Current Mask */}
      <div className="mb-4">
        <button
          onClick={resetMask}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-600 border border-red-700/50 shadow-sm"
        >
          Resetear Máscara Actual
        </button>
      </div>

      {/* Button: Reset All Masks */}
      <div>
        <button
          onClick={handleResetAllMasks}
          className="w-full bg-red-700 hover:bg-red-800 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-700 border border-red-800/50 shadow-sm"
        >
          Resetear Todas las Máscaras
        </button>
      </div>

      {showConfirmation && (
        <ConfirmationModal
          message="¿Estás seguro que deseas borrar todas las máscaras? Esta acción no se puede deshacer."
          onConfirm={confirmReset}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
}