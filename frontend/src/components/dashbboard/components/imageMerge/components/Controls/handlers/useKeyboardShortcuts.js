import { useEffect } from 'react';
import { handleUndo, handleRedo } from './handleUndoRedoMarks';

const useKeyboardShortcuts = (
    undoStack, 
    redoStack, 
    setUndoStack, 
    setRedoStack, 
    setMarks, 
    setGhostMarks, 
    previewRef
) => {
    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.key === 'z' && (e.metaKey || e.ctrlKey)) {
                handleUndo(undoStack, setUndoStack, setRedoStack, setMarks, setGhostMarks, previewRef);
            } else if (e.key === 'y' && (e.metaKey || e.ctrlKey)) {
                handleRedo(redoStack, setRedoStack, setUndoStack, setMarks, setGhostMarks, previewRef);
            }
        };

        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, [undoStack, redoStack, setUndoStack, setRedoStack, setMarks, setGhostMarks, previewRef]);
};

export default useKeyboardShortcuts;