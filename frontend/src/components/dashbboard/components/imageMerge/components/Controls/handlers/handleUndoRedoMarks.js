const handleUndo = (
    undoStack, 
    setUndoStack, 
    setRedoStack, 
    setMarks, 
    setGhostMarks, 
    previewRef
) => {
    if (undoStack.length === 0) return;
    const lastChange = undoStack[undoStack.length - 1];

    setMarks(prev => prev.filter(mark => mark.id !== lastChange.id));
    setGhostMarks([{ id: lastChange.id, y: lastChange.y }]);
    setRedoStack(prev => [...prev, { id: lastChange.id, y: lastChange.y }]);

    if (undoStack.length === 1) {
        setUndoStack([]);
    } else {
        setUndoStack(prev => prev.slice(0, -1));
    }

    if (previewRef.current) {
        previewRef.current.scrollTop = lastChange.y - previewRef.current.clientHeight / 2;
    }

    setTimeout(() => {
        setGhostMarks([]);
    }, 1000);
};

const handleRedo = (
    redoStack, 
    setRedoStack, 
    setUndoStack, 
    setMarks, 
    setGhostMarks, 
    previewRef
) => {
    if (redoStack.length === 0) return;
    const lastChange = redoStack[redoStack.length - 1];

    // Restore last mark from redoStack
    setMarks(prev => [...prev, { id: lastChange.id, y: lastChange.y }]);
    setGhostMarks([{ id: lastChange.id, y: lastChange.y }]);
    setUndoStack(prev => [...prev, { id: lastChange.id, y: lastChange.y }]);
    if (redoStack.length === 1) {
        setRedoStack([]);
    } else {
        setRedoStack(prev => prev.slice(0, -1));
    }

    if (previewRef.current) {
        previewRef.current.scrollTop = lastChange.y - previewRef.current.clientHeight / 2;
    }

    // Clear ghost mark after animation
    setTimeout(() => {
        setGhostMarks([]);
    }, 1000);
};

export { handleUndo, handleRedo };
