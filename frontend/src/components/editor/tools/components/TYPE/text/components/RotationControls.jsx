import React from 'react';
import { FaUndo, FaRedo } from 'react-icons/fa';
import { handleRotate } from '../handlers/textSettingsHandlers';
import useLayerHistory from '../../../../../floating-menus/UndoRedoMenu/handlers/fabricHistoryManager';

const RotationControls = ({ textObject, fabricCanvas, buttonBaseStyle, buttonInactiveStyle }) => {
  const { saveState } = useLayerHistory();
  return (
    <div className="flex justify-center gap-4" title="Rotate Text">
      <button
        onClick={() => handleRotate('counterclockwise', textObject, fabricCanvas, saveState)}
        className={`${buttonBaseStyle} ${buttonInactiveStyle} hover:bg-blue-700`}
        title="Rotate Counterclockwise"
      >
        <FaUndo />
      </button>
      <button
        onClick={() => handleRotate('clockwise', textObject, fabricCanvas, saveState)}
        className={`${buttonBaseStyle} ${buttonInactiveStyle} hover:bg-blue-700`}
        title="Rotate Clockwise"
      >
        <FaRedo />
      </button>
    </div>
  );
};

export default RotationControls;