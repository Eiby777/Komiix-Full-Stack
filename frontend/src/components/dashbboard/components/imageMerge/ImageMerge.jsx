import { useState, useRef } from 'react';
import Alert from './components/Alert';
import DragDropArea from './components/DragDropArea/DragDropArea';
import ImageList from './components/ImageList/ImageList';
import Preview from './components/Preview/Preview';
import Controls from './components/Controls/Controls';
import useClearStateOnEmptyImages from './hooks/useClearStateOnEmptyImages';
import useInitialicePreviewWidth from './hooks/useInitialicePreviewWidth';
import useResizeHandler from './hooks/useResizeHandler';
import './utils/ImageMerge.css';

const ImageMerge = ({ isProfileMenuOpen, headerHeight, darkMode }) => {
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
    const [ghostMarks, setGhostMarks] = useState([]); // TODO: Cambiar a objetos con {id, y}
    const [isHeightMarksEnabled, setIsHeightMarksEnabled] = useState(false);
    const [heightValue, setHeightValue] = useState(832); // Default: round((576 * 10) / 7 / 32) * 32
    const previewRef = useRef(null);
    const [previewWidth, setPreviewWidth] = useState(null);
    const [heightMarks, setHeightMarks] = useState([]);

    useInitialicePreviewWidth(setPreviewWidth);
    useClearStateOnEmptyImages(images, setUndoStack, setRedoStack, setMarks, marks);
    useResizeHandler(previewWidth, marks, setMarks, setPreviewWidth, previewRef);

    return (
        <div className={`h-full relative flex-1 transition-all duration-300 ${isProfileMenuOpen ? 'pointer-events-none opacity-50 z-10' : 'opacity-100 z-10'}`}>
            <div className={`absolute inset-0 backdrop-blur-sm z-[-1] ${darkMode ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`} />
            <main className="relative p-8 z-0 flex flex-col">
                <Alert
                    showAlert={showAlert}
                    alertType={alertType}
                    alertMessage={alertMessage}
                    progress={progress}
                    setShowAlert={setShowAlert}

                />
                <h1 className={`text-4xl font-extrabold mb-6 bg-clip-text text-transparent ${darkMode ? 'bg-gradient-to-r from-blue-400 to-indigo-400' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}>
                    Fusionar Imágenes
                </h1>
                <DragDropArea
                    darkMode={darkMode}
                    images={images}
                    setImages={setImages}
                    setAlertMessage={setAlertMessage}
                    setAlertType={setAlertType}
                    setShowAlert={setShowAlert}
                    setProgress={setProgress}
                />
                <ImageList
                    images={images}
                    darkMode={darkMode}
                    setImages={setImages}
                    setMarks={setMarks}
                />
                <div className="flex gap-4 flex-1">
                    <Preview
                        images={images}
                        marks={marks}
                        ghostMarks={ghostMarks}
                        setGhostMarks={setGhostMarks}
                        previewRef={previewRef}
                        setMarks={setMarks}
                        setUndoStack={setUndoStack}
                        setRedoStack={setRedoStack}
                        setAlertMessage={setAlertMessage}
                        setAlertType={setAlertType}
                        setShowAlert={setShowAlert}
                        setProgress={setProgress}
                        headerHeight={headerHeight}
                        darkMode={darkMode}
                        isHeightMarksEnabled={isHeightMarksEnabled}
                        heightValue={heightValue}
                        heightMarks={heightMarks}
                        setHeightMarks={setHeightMarks}
                    />
                    <Controls
                        format={format}
                        setFormat={setFormat}
                        quality={quality}
                        undoStack={undoStack}
                        redoStack={redoStack}
                        setQuality={setQuality}
                        darkMode={darkMode}
                        isHeightMarksEnabled={isHeightMarksEnabled}
                        setIsHeightMarksEnabled={setIsHeightMarksEnabled}
                        heightValue={heightValue}
                        setHeightValue={setHeightValue}
                        setUndoStack={setUndoStack}
                        setRedoStack={setRedoStack}
                        setMarks={setMarks}
                        setGhostMarks={setGhostMarks}
                        previewRef={previewRef}
                        images={images}
                        marks={marks}
                        heightMarks={heightMarks}
                        setHeightMarks={setHeightMarks}
                    />
                </div>
            </main>
        </div>
    );
};

export default ImageMerge;
