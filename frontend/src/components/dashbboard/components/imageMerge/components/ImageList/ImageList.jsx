import PropTypes from 'prop-types';
import { deleteImage, moveImage } from './handlers/imageHandler';
const ImageList = ({
    images,
    darkMode,
    setImages,
    setMarks
}) => {
    return (
        <div className={`flex flex-wrap gap-2 mb-4 p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-200/80'}`}>
            {images.map((img, index) => (
                <div
                    key={img.id}
                    className={`cursor-pointer backdrop-blur-md rounded-xl shadow-md border p-1.5 flex items-center gap-1.5 transition-all duration-300 hover:shadow-xl text-sm ${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-300 shadow-gray-400'}`}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                        moveImage(fromIndex, index, images, setImages);
                    }}
                >
                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{img.file.name}</span>
                    <button
                        onClick={() => deleteImage(img.id, setImages, setMarks)}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center transition-all duration-200 text-xs"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
};

ImageList.propTypes = {
    darkMode: PropTypes.bool.isRequired,
    images: PropTypes.array.isRequired,
    setImages: PropTypes.func.isRequired,
    setMarks: PropTypes.func.isRequired
};

export default ImageList;
