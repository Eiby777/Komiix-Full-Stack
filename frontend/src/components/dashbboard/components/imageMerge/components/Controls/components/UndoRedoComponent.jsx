import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faRedo } from '@fortawesome/free-solid-svg-icons';
import { handleUndo, handleRedo } from '../handlers/handleUndoRedoMarks';
const UndoRedoComponent = ({
  undoStack,
  setUndoStack,
  setRedoStack,
  setMarks,
  setGhostMarks,
  previewRef,
  darkMode,
  redoStack
}) => {
  return (
    <div
      className={`backdrop-blur-md rounded-xl shadow-lg border p-3 ${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-300 shadow-gray-400'
        }`}
    >
      <div className="flex gap-3 justify-center">
        <button
          onClick={() =>
            handleUndo(
              undoStack,
              setUndoStack,
              setRedoStack,
              setMarks,
              setGhostMarks,
              previewRef
            )
          }
          className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300 border-gray-300'
            }`}
          disabled={undoStack.length === 0}
        >
          <FontAwesomeIcon icon={faUndo} />
          <span>Deshacer</span>
        </button>
        <button
          onClick={() =>
            handleRedo(
              redoStack,
              setRedoStack,
              setUndoStack,
              setMarks,
              setGhostMarks,
              previewRef
            )
          }
          className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300 border-gray-300'
            }`}
          disabled={redoStack.length === 0}
        >
          <FontAwesomeIcon icon={faRedo} />
          <span>Rehacer</span>
        </button>
      </div>
    </div>
  );
};

export default UndoRedoComponent;