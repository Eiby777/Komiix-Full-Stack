import React from 'react';
import { FaPalette, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import useLayerHistory from '../../../../../floating-menus/components/UndoRedoMenu/handlers/fabricHistoryManager';

const ColorControls = ({
  fillColor, setFillColor, strokeColor, setStrokeColor, strokeWidth, setStrokeWidth,
  hasStroke, setHasStroke, textObject, fabricCanvas, handleSizeInput, handleArrowKeys,
  handleFillColorChange, handleStrokeColorChange, handleStrokeToggle, handleStrokeWidthChange,
  handleStrokeWidthButtonChange,
  strokeMode, handleStrokeModeChange
}) => {
  const { saveState } = useLayerHistory();
  return (
    <>
      <div className="flex items-center w-full gap-2" title="Text Color">
        <FaPalette className="text-gray-400 flex-shrink-0" />
        <input
          type="color"
          value={fillColor}
          onChange={(e) => handleFillColorChange(e.target.value, textObject, fabricCanvas, setFillColor, saveState)}
          className="h-10 rounded-md border-none cursor-pointer w-full"
        />
      </div>
      <div className={`flex items-center w-full gap-2 transition-opacity ${!hasStroke ? 'opacity-50' : 'opacity-100'}`} title="Text Outline">
        <FaPalette className="text-gray-400 flex-shrink-0" />
        <input
          type="color"
          value={strokeColor}
          style={{ minWidth: '1rem' }}
          onChange={(e) => handleStrokeColorChange(e.target.value, textObject, fabricCanvas, setStrokeColor, hasStroke, saveState)}
          disabled={!hasStroke}
          className="h-10 rounded-md border-none cursor-pointer flex-1"
        />
        <div className="relative w-24">
          <input
            type="text"
            value={strokeWidth}
            style={{ minWidth: '1rem' }}
            onChange={(e) => handleSizeInput(e, handleStrokeWidthChange, setStrokeWidth, textObject, fabricCanvas)}
            onBlur={(e) => handleStrokeWidthChange(e.target.value, textObject, fabricCanvas, setStrokeWidth, saveState)}
            onKeyDown={(e) => handleArrowKeys(e, strokeWidth, setStrokeWidth, handleStrokeWidthChange, textObject, fabricCanvas, false)}
            disabled={!hasStroke}
            className="p-2 pr-8 rounded-md bg-[#2a2a2a] text-white border border-white/10 text-sm w-full"
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
            <button
              onClick={() => handleStrokeWidthButtonChange(true, strokeWidth, setStrokeWidth, handleStrokeWidthChange, textObject, fabricCanvas)}
              disabled={!hasStroke}
              className="text-gray-400 hover:text-white p-0.5 w-5 h-4 flex items-center justify-center disabled:opacity-50"
            >
              <FaChevronUp size={10} />
            </button>
            <button
              onClick={() => handleStrokeWidthButtonChange(false, strokeWidth, setStrokeWidth, handleStrokeWidthChange, textObject, fabricCanvas)}
              disabled={!hasStroke}
              className="text-gray-400 hover:text-white p-0.5 w-5 h-4 flex items-center justify-center disabled:opacity-50"
            >
              <FaChevronDown size={10} />
            </button>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={hasStroke}
            onChange={(e) => handleStrokeToggle(e.target.checked, textObject, fabricCanvas, setHasStroke, strokeColor, saveState)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-500"></div>
          <span className="absolute w-5 h-5 bg-white rounded-full transition-all left-0.5 top-0.5 peer-checked:translate-x-5"></span>
        </label>
        {hasStroke && (
          <div className="flex items-center gap-1 ml-1" title="Modo de contorno">
            <button
              onClick={() => handleStrokeModeChange('center')}
              className={`px-2 py-1 text-[10px] uppercase font-bold rounded transition-colors ${strokeMode === 'center'
                ? 'bg-blue-600 text-white'
                : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#3a3a3a]'
                }`}
            >
              C
            </button>
            <button
              onClick={() => handleStrokeModeChange('outside')}
              className={`px-2 py-1 text-[10px] uppercase font-bold rounded transition-colors ${strokeMode === 'outside'
                ? 'bg-blue-600 text-white'
                : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#3a3a3a]'
                }`}
            >
              O
            </button>
          </div>
        )}
      </div>
    </>
  )
};

export default ColorControls;