import React from 'react';
import { useEditorStore } from '../../../../../../stores/editorStore';

export default function BrushSettings() {
  const {
    selectedBrushColor,
    setSelectedBrushColor,
    selectedBrushSize,
    setSelectedBrushSize,
    selectedBrushHardness,
    setSelectedBrushHardness,
  } = useEditorStore();

  const handleBrushSizeChange = (e) => {
    setSelectedBrushSize(Number(e.target.value));
  };

  const handleBrushHardnessChange = (e) => {
    setSelectedBrushHardness(Number(e.target.value));
  };

  const handleBrushColorChange = (e) => {
    setSelectedBrushColor(e.target.value);
  };

  return (
    <div className="p-4 text-gray-300 rounded-lg shadow-md bg-[#1e1e1e] border border-gray-700/50">
      {/* Slider: Brush Size */}
      <div className="mb-6">
        <label htmlFor="brushSize" className="block text-sm font-medium mb-1 text-gray-300">
          Brush Size
        </label>
        <input
          id="brushSize"
          type="range"
          min="1"
          max="100"
          value={selectedBrushSize}
          onChange={handleBrushSizeChange}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 accent-blue-600"
        />
        <div className="text-sm mt-1 text-gray-400">Size: {selectedBrushSize}</div>
      </div>

      {/* Slider: Hardness */}
      <div className="mb-6">
        <label htmlFor="hardness" className="block text-sm font-medium mb-1 text-gray-300">
          Hardness
        </label>
        <input
          id="hardness"
          type="range"
          min="0"
          max="100"
          value={selectedBrushHardness}
          onChange={handleBrushHardnessChange}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 accent-blue-600"
        />
        <div className="text-sm mt-1 text-gray-400">Hardness: {selectedBrushHardness}</div>
      </div>

      {/* Color Picker: Brush Color */}
      <div>
        <label htmlFor="brushColor" className="block text-sm font-medium mb-1 text-gray-300">
          Brush Color
        </label>
        <input
          id="brushColor"
          type="color"
          value={selectedBrushColor}
          onChange={handleBrushColorChange}
          className="w-full h-10 p-0 border border-gray-700/50 rounded-md cursor-pointer transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>
    </div>
  );
}