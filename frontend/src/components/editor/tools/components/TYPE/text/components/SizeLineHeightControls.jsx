import React from 'react';
import { FaTextHeight, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import useLayerHistory from '../../../../../floating-menus/UndoRedoMenu/handlers/fabricHistoryManager';

const SizeLineHeightControls = ({
  fontSize, setFontSize, lineHeight, setLineHeight, textObject, fabricCanvas,
  handleSizeInput, handleArrowKeys, handleFontSizeButtonChange, handleLineHeightButtonChange, handleSizeChange, handleLineHeightChange
}) => {
  const { saveState } = useLayerHistory();

  return (
    <div className="flex gap-2 items-center">
      <div className="flex-1 flex items-center gap-2" title="Font Size">
        <FaTextHeight className="text-gray-400" />
        <div className="relative flex-1">
          <input
            type="text"
            value={fontSize}
            onChange={(e) => handleSizeInput(e, handleSizeChange, setFontSize, textObject, fabricCanvas)}
            onBlur={(e) => handleSizeChange(e.target.value, textObject, fabricCanvas, setFontSize, saveState)}
            onKeyDown={(e) => handleArrowKeys(e, fontSize, setFontSize, handleSizeChange, textObject, fabricCanvas, true)}
            className="p-2 pr-8 rounded-md bg-[#2a2a2a] text-white border border-white/10 text-sm w-full"
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
            <button
              onClick={() => handleFontSizeButtonChange(true, fontSize, setFontSize, handleSizeChange, textObject, fabricCanvas)}
              className="text-gray-400 hover:text-white p-0.5 w-5 h-4 flex items-center justify-center"
            >
              <FaChevronUp size={10} />
            </button>
            <button
              onClick={() => handleFontSizeButtonChange(false, fontSize, setFontSize, handleSizeChange, textObject, fabricCanvas)}
              className="text-gray-400 hover:text-white p-0.5 w-5 h-4 flex items-center justify-center"
            >
              <FaChevronDown size={10} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center gap-2" title="Line Height">
        <FaTextHeight className="text-gray-400" />
        <div className="relative flex-1">
          <input
            type="text"
            value={lineHeight}
            onChange={(e) => handleSizeInput(e, handleLineHeightChange, setLineHeight, textObject, fabricCanvas)}
            onBlur={(e) => handleLineHeightChange(e.target.value, textObject, fabricCanvas, setLineHeight, saveState)}
            onKeyDown={(e) => handleArrowKeys(e, lineHeight, setLineHeight, handleLineHeightChange, textObject, fabricCanvas, false)}
            className="p-2 pr-8 rounded-md bg-[#2a2a2a] text-white border border-white/10 text-sm w-full"
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
            <button
              onClick={() => handleLineHeightButtonChange(true, lineHeight, setLineHeight, handleLineHeightChange, textObject, fabricCanvas)}
              className="text-gray-400 hover:text-white p-0.5 w-5 h-4 flex items-center justify-center"
            >
              <FaChevronUp size={10} />
            </button>
            <button
              onClick={() => handleLineHeightButtonChange(false, lineHeight, setLineHeight, handleLineHeightChange, textObject, fabricCanvas)}
              className="text-gray-400 hover:text-white p-0.5 w-5 h-4 flex items-center justify-center"
            >
              <FaChevronDown size={10} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeLineHeightControls;