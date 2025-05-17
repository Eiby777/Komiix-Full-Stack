import { useEffect } from 'react';

const useClearStateOnEmptyImages = (images, setUndoStack, setRedoStack, setMarks, marks) => {
    useEffect(() => {
        if (images.length === 0) {
            setUndoStack([]);
            setRedoStack([]);
            setMarks([]);
        }
    }, [images, setUndoStack, setRedoStack, setMarks]);

    useEffect(() => {
        if (images.length > 0 && marks.length === 0) {
            setUndoStack([]);
        }
    }, [marks, setUndoStack, setRedoStack, images]);
};

export default useClearStateOnEmptyImages;