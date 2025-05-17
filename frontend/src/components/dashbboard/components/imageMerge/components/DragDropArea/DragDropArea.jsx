import PropTypes from 'prop-types';
import { handleDropImages } from './handlers/dropHandlers';

const DragDropArea = ({ 
    darkMode, 
    images, 
    setImages, 
    setAlertMessage, 
    setAlertType, 
    setShowAlert, 
    setProgress 
}) => {
    return (
        <div
            className={`backdrop-blur-md rounded-xl border-2 p-4 mb-4 text-center transition-all duration-300 ${darkMode ? 'bg-gray-800/80 border-gray-700 hover:border-blue-400' : 'bg-white/80 border-gray-300 hover:border-blue-500'}`}
            onDrop={(e) => handleDropImages(
                e, 
                images, 
                setImages, 
                setAlertMessage, 
                setAlertType, 
                setShowAlert, 
                setProgress
            )}
            onDragOver={(e) => e.preventDefault()}
        >
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleDropImages(
                    e, 
                    images, 
                    setImages, 
                    setAlertMessage, 
                    setAlertType, 
                    setShowAlert, 
                    setProgress
                )}
                className="hidden"
                id="image-upload"
            />
            <label htmlFor="image-upload" className={`cursor-pointer ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                Arrastra y suelta imágenes aquí o haz clic para seleccionar
            </label>
        </div>
    );
};

DragDropArea.propTypes = {
    darkMode: PropTypes.bool.isRequired,
    images: PropTypes.array.isRequired,
    setImages: PropTypes.func.isRequired,
    setAlertMessage: PropTypes.func.isRequired,
    setAlertType: PropTypes.func.isRequired,
    setShowAlert: PropTypes.func.isRequired,
    setProgress: PropTypes.func.isRequired
};

export default DragDropArea;