
import { useState, useRef } from 'react';
const useMergeImages = () => {
    const [images, setImages] = useState([]);
    const [marks, setMarks] = useState([]); // TODO: Cambiar a objetos con {id, y}
    const [undoStack, setUndoStack] = useState([]); // TODO: Cambiar a objetos con {id, y}
    const [redoStack, setRedoStack] = useState([]); // TODO: Cambiar a objetos con {id, y}
    const [format, setFormat] = useState('png');
    const [quality, setQuality] = useState(100);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [progress, setProgress] = useState(100);
    const [alertType, setAlertType] = useState('error');
    const [ghostMarks, setGhostMarks] = useState([]); 
    const [isHeightMarksEnabled, setIsHeightMarksEnabled] = useState(false);
    const [heightValue, setHeightValue] = useState(832); // Default: round((576 * 10) / 7 / 32) * 32
    const previewRef = useRef(null);
    const [previewWidth, setPreviewWidth] = useState(null);

    return {
        images,
        setImages,
        marks,
        setMarks,
        undoStack,
        setUndoStack,
        redoStack,
        setRedoStack,
        format,
        setFormat,
        quality,
        setQuality,
        alertMessage,
        setAlertMessage,
        showAlert,
        setShowAlert,
        progress,
        setProgress,
        alertType,
        setAlertType,
        ghostMarks,
        setGhostMarks,
        isHeightMarksEnabled,
        setIsHeightMarksEnabled,
        heightValue,
        setHeightValue,
        previewRef,
        previewWidth,
        setPreviewWidth
    };
};

export default useMergeImages;
