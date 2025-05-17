import { v4 as uuidv4 } from "uuid";

const generateId = () => uuidv4();

const debounce = (func, wait) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

const handleMarkClick = (e, previewRef, marks, setSelectedMarkId) => {
  const rect = previewRef.current.getBoundingClientRect();
  const scrollTop = previewRef.current.scrollTop;
  const y = e.clientY - rect.top + scrollTop;

  // Check if clicking on existing mark
  const clickedMarkIndex = marks.findIndex((mark) => Math.abs(mark.y - y) < 5);
  if (clickedMarkIndex >= 0) {
    const clickedMark = marks[clickedMarkIndex];
    setSelectedMarkId(clickedMark.id);
    return { markIndex: clickedMarkIndex };
  }

  return null;
};

const handlePreviewClick = (
  e,
  images,
  marks,
  setMarks,
  setUndoStack,
  setRedoStack,
  setAlertMessage,
  setAlertType,
  setShowAlert,
  setProgress,
  previewRef
) => {
  if (!images || images?.length === 0) return;

  const rect = previewRef.current.getBoundingClientRect();
  const scrollTop = previewRef.current.scrollTop;
  const y = e.clientY - rect.top + scrollTop;

  // Check if clicking on existing mark (for drag purposes)
  const clickedMarkIndex = marks.findIndex((mark) => Math.abs(mark.y - y) < 5);
  if (clickedMarkIndex >= 0) {
    return { markIndex: clickedMarkIndex };
  }

  // Create new mark if no mark was clicked
  if (marks.some((mark) => Math.abs(mark.y - y) < 1)) {
    setAlertMessage("Ya existe una marca en esta posición");
    setAlertType("warning");
    setShowAlert(true);
    setProgress(100);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          setShowAlert(false);
          return 0;
        }
        return prev - 100 / 60;
      });
    }, 50);
    return;
  }

  const newMark = { id: generateId(), y };
  setMarks((prev) => [...prev, newMark]);
  setUndoStack((prev) => [...prev, { id: newMark.id, y: newMark.y }]);
  setRedoStack([]);
};

const handleMarkDrag = (
  draggedMarkIndex,
  setMarks,
  setUndoStack,
  setRedoStack,
  previewRef,
  heightMarks,
  setHeightMarks,
  marks
) => {
  const debouncedUpdate = debounce((e) => {
    if (draggedMarkIndex === null || draggedMarkIndex === undefined) return;
    const rect = previewRef.current.getBoundingClientRect();
    const scrollTop = previewRef.current.scrollTop;
    const y = e.clientY - rect.top + scrollTop;

    const newMarks = [...marks];
    const oldPosition = newMarks[draggedMarkIndex].y;
    newMarks[draggedMarkIndex].y = y;
    newMarks[draggedMarkIndex].auto = false;

    if (heightMarks.includes(newMarks[draggedMarkIndex].id)) {
      setHeightMarks(prev => prev.filter(id => id !== newMarks[draggedMarkIndex].id));
    }

    setMarks(newMarks);

    if (oldPosition !== y) {
      setUndoStack((prev) => {
        const newStack = [...prev];
        newStack[draggedMarkIndex] = { id: newMarks[draggedMarkIndex].id, y };
        return newStack;
      });
      setRedoStack([]);
    }
  }, 300);

  return (e) => {
    // Immediate visual update
    const rect = previewRef.current.getBoundingClientRect();
    const scrollTop = previewRef.current.scrollTop;
    const y = e.clientY - rect.top + scrollTop;
    setMarks((prev) => {
      const newMarks = [...prev];
      newMarks[draggedMarkIndex] = { ...newMarks[draggedMarkIndex], y };
      return newMarks;
    });
    debouncedUpdate(e);
  };
};

const handleMouseDown = (
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
) => {
  const result = handlePreviewClick(
    e,
    images,
    marks,
    setMarks,
    setUndoStack,
    setRedoStack,
    setAlertMessage,
    setAlertType,
    setShowAlert,
    setProgress,
    previewRef
  );

  if (result !== undefined && result !== null) {
    setDraggedMarkIndex(result.markIndex);
    setIsDragging(true);
    setSelectedMarkId(null);
    dragHandlerRef.current = handleMarkDrag(
      result.markIndex,
      setMarks,
      setUndoStack,
      setRedoStack,
      previewRef,
      heightMarks,
      setHeightMarks,
      marks
    );
  }
};

const handleClick = (e, setSelectedMarkId, previewRef, marks) => {
  const result = handleMarkClick(e, previewRef, marks, setSelectedMarkId);

  if (result === null) {
    setSelectedMarkId(null);
  }
};

const handleMouseMove = (e, isDragging, draggedMarkIndex, dragHandler) => {
  if (isDragging && draggedMarkIndex !== null && dragHandler) {
    dragHandler(e);
  }
};

const handleMouseUp = (e, setIsDragging, setDraggedMarkIndex, dragHandlerRef) => {
  setIsDragging(false);
  setDraggedMarkIndex(null);
  dragHandlerRef.current = null;
};

export {
  handleMouseDown,
  handleClick,
  handleMouseMove,
  handleMouseUp,
  handleMarkClick,
  handlePreviewClick,
  handleMarkDrag,
};