import PropTypes from 'prop-types';
import useKeyboardShortcuts from './handlers/useKeyboardShortcuts';
import UndoRedoComponent from './components/UndoRedoComponent';
import DefineMarksChunks from './components/DefineMarksChunks';
import OutputFormat from "./components/OutputFormat";

const Controls = ({
  format,
  setFormat,
  quality,
  undoStack,
  redoStack,
  setQuality,
  darkMode,
  isHeightMarksEnabled,
  setIsHeightMarksEnabled,
  heightValue,
  setHeightValue,
  setUndoStack,
  setRedoStack,
  setMarks,
  marks,
  setGhostMarks,
  previewRef,
  images,
  heightMarks,
  setHeightMarks
}) => {
  useKeyboardShortcuts(
    undoStack,
    redoStack,
    setUndoStack,
    setRedoStack,
    setMarks,
    setGhostMarks,
    previewRef
  );

  return (
    <div className="w-1/2 flex flex-col gap-4">
      <UndoRedoComponent
        undoStack={undoStack}
        setUndoStack={setUndoStack}
        redoStack={redoStack}
        setRedoStack={setRedoStack}
        setMarks={setMarks}
        setGhostMarks={setGhostMarks}
        previewRef={previewRef}
        darkMode={darkMode}
      />
      <DefineMarksChunks
        darkMode={darkMode}
        isHeightMarksEnabled={isHeightMarksEnabled}
        setIsHeightMarksEnabled={setIsHeightMarksEnabled}
        heightValue={heightValue}
        setHeightValue={setHeightValue}
        images={images}
        setMarks={setMarks}
        heightMarks={heightMarks}
        setHeightMarks={setHeightMarks}
      />
      <OutputFormat
        marks={marks}
        images={images}
        format={format}
        setFormat={setFormat}
        quality={quality}
        setQuality={setQuality}
        darkMode={darkMode}
      />
    </div>
  );
};

Controls.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  format: PropTypes.string.isRequired,
  setFormat: PropTypes.func.isRequired,
  quality: PropTypes.number.isRequired,
  undoStack: PropTypes.array.isRequired,
  redoStack: PropTypes.array.isRequired,
  setQuality: PropTypes.func.isRequired,
  isHeightMarksEnabled: PropTypes.bool.isRequired,
  setIsHeightMarksEnabled: PropTypes.func.isRequired,
  heightValue: PropTypes.number.isRequired,
  setHeightValue: PropTypes.func.isRequired,
};

export default Controls;