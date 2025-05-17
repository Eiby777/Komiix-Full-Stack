import React from 'react';
import { useEditorStore } from '../../../../../../../stores/editorStore';

const ColorTypeSelector = ({ selectedColor, setSelectedColor }) => {
  const { colorToTypeTextMap } = useEditorStore();
  return (
    <div className="w-full">
      <select
        value={selectedColor}
        onChange={(e) => setSelectedColor(e.target.value)}
        className="w-full p-2 rounded-md text-white text-xs font-size-12"
        style={{
          backgroundColor: selectedColor,
          transition: 'all 0.3s ease-in-out',
        }}
      >
        {Object.entries(colorToTypeTextMap).map(([color, type]) => (
          <option
            key={color}
            value={color}
            style={{ backgroundColor: color }}
          >
            {type}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ColorTypeSelector;