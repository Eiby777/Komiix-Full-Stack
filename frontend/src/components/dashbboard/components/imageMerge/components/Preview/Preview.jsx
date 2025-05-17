import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import {
  handleMouseDown,
  handleClick,
  handleMouseMove,
  handleMouseUp,
} from "./handlers/handleMarks";
import useDeleteMarksKeyboard from "./hooks/deleteMarksKeyboard";

const Preview = ({
  images,
  marks,
  ghostMarks,
  setGhostMarks,
  previewRef,
  setMarks,
  setUndoStack,
  setRedoStack,
  setAlertMessage,
  setAlertType,
  setShowAlert,
  setProgress,
  headerHeight,
  darkMode,
  isHeightMarksEnabled,
  heightValue,
  heightMarks,
  setHeightMarks
}) => {

  const [draggedMarkIndex, setDraggedMarkIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedMarkId, setSelectedMarkId] = useState(null);
  
  const dragHandlerRef = useRef(null);

  // Generate height-based marks
  useEffect(() => {
    if (isHeightMarksEnabled && heightValue > 0) {
      const newHeightMarks = Array.from({ length: heightValue }, (_, i) => i + 1);
      setHeightMarks(newHeightMarks);
    }
  }, [isHeightMarksEnabled, heightValue]);

  useDeleteMarksKeyboard({
    selectedMarkId,
    heightMarks,
    setHeightMarks,
    setSelectedMarkId,
    setMarks,
    setUndoStack,
    setRedoStack,
    setGhostMarks,
  });

  return (
    <div
      id="image-preview-container"
      ref={previewRef}
      className={`w-1/2 flex-1 overflow-y-auto rounded-xl shadow-xl border relative ${darkMode ? "bg-gray-900/80 border-gray-700" : "bg-gray-100/80 border-gray-300 shadow-gray-400"
        }`}
      onMouseDown={(e) =>
        handleMouseDown(
          e,
          setIsDragging,
          setDraggedMarkIndex,
          dragHandlerRef,
          setSelectedMarkId,
          images,
          marks,
          setMarks,
          setUndoStack,
          setRedoStack,
          setAlertMessage,
          setAlertType,
          setShowAlert,
          setProgress,
          previewRef,
          heightMarks,
          setHeightMarks
        )
      }
      onMouseMove={(e) => handleMouseMove(e, isDragging, draggedMarkIndex, dragHandlerRef.current)}
      onMouseUp={(e) => handleMouseUp(e, setIsDragging, setDraggedMarkIndex, dragHandlerRef)}
      onMouseLeave={(e) => handleMouseUp(e, setIsDragging, setDraggedMarkIndex, dragHandlerRef)}
      onClick={(e) => handleClick(e, setSelectedMarkId, previewRef, marks)}
      style={{ height: `calc(100vh - ${headerHeight}px - 14rem)` }}
    >
      {images.map((img, index) => (
        <img
          key={index}
          src={img.url}
          alt={`Preview ${index}`}
          className="w-full block"
          style={{ margin: 0, padding: 0 }}
        />
      ))}
      {marks.map((mark, index) => (
        <div
          key={`mark-${mark.id}`}
          className={`absolute w-full h-0.5 ${mark.id === selectedMarkId
              ? "bg-green-500"
              : index === draggedMarkIndex
                ? "bg-blue-500"
                : heightMarks.includes(mark.id)
                  ? "bg-red-500 opacity-50"
                  : "bg-red-500"
            }`}
          style={{
            top: mark.y,
            cursor: isDragging && index === draggedMarkIndex ? "grabbing" : "grab",
          }}
        />
      ))}
      {ghostMarks.map((mark, _) => (
        <div
          key={`ghost-${mark.id}`}
          data-mark-id={`ghost-${mark.id}`}
          className="absolute w-full h-0.5 bg-red-500 blinking-mark"
          style={{ top: mark.y }}
        />
      ))}
    </div>
  );
};

Preview.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  headerHeight: PropTypes.number.isRequired,
};

export default Preview;