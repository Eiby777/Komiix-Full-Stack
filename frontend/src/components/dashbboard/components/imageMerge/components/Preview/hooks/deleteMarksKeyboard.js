// deleteMarksKeyboard.js
import { useEffect } from "react";

const useDeleteMarksKeyboard = ({
  selectedMarkId,
  heightMarks,
  setHeightMarks,
  setSelectedMarkId,
  setMarks,
  setUndoStack,
  setRedoStack,
  setGhostMarks,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === "Backspace" || e.key === "Delete") && selectedMarkId) {
        setMarks((prev) => {
          const markToDelete = prev.find((mark) => mark.id === selectedMarkId);
          console.log(markToDelete);
          if (markToDelete) {
            setGhostMarks([{ id: markToDelete.id, y: markToDelete.y }]);
            setUndoStack((prev) => prev.filter((action) => action.id !== selectedMarkId));
            setRedoStack((prev) => prev.filter((action) => action.id !== selectedMarkId));
            setTimeout(() => {
              setGhostMarks([]);
            }, 1500);
            if (heightMarks.includes(markToDelete.id)) {
              setHeightMarks((prev) => prev.filter((id) => id !== markToDelete.id));
            }
            return prev.filter((mark) => mark.id !== selectedMarkId);
          }
          return prev;
        });
        setSelectedMarkId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    selectedMarkId,
    heightMarks,
    setHeightMarks,
    setSelectedMarkId,
    setMarks,
    setUndoStack,
    setRedoStack,
    setGhostMarks,
  ]);
};

export default useDeleteMarksKeyboard;