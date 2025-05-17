import React from 'react';
import { useEditorStore } from '../../../../../../stores/editorStore';

export default function CloneSettings() {
  const {
    selectedCloneSize,
    setSelectedCloneSize,
    selectedCloneHardness,
    setSelectedCloneHardness,
  } = useEditorStore();

  const handleCloneSizeChange = (e) => {
    setSelectedCloneSize(Number(e.target.value));
  };

  const handleCloneHardnessChange = (e) => {
    setSelectedCloneHardness(Number(e.target.value));
  };

  return (
    <div className="p-4 text-gray-300 rounded-lg shadow-md bg-[#1e1e1e] border border-gray-700/50">
      {/* Slider: Clone Size */}
      <div className="mb-6">
        <label htmlFor="cloneSize" className="block text-sm font-medium mb-1 text-gray-300">
          Clone Size
        </label>
        <input
          id="cloneSize"
          type="range"
          min="1"
          max="100"
          value={selectedCloneSize}
          onChange={handleCloneSizeChange}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 accent-blue-600"
        />
        <div className="text-sm mt-1 text-gray-400">Size: {selectedCloneSize}</div>
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
          value={selectedCloneHardness}
          onChange={handleCloneHardnessChange}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 accent-blue-600"
        />
        <div className="text-sm mt-1 text-gray-400">Hardness: {selectedCloneHardness}</div>
      </div>
    </div>
  );
}