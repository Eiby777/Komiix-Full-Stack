import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DefineMarksChunks = ({
    darkMode,
    isHeightMarksEnabled,
    setIsHeightMarksEnabled,
    heightMarks,
    setHeightMarks,
    heightValue,
    setHeightValue,
    images,
    setMarks
}) => {

    useEffect(() => {
        if (isHeightMarksEnabled) {
            const preview = document.getElementById('image-preview-container');
            if (!preview) {
                console.error('Preview container not found');
                return;
            }
            const previewHeight = preview.scrollHeight;
            if (previewHeight <= 0) {
                console.error('Preview height is invalid:', previewHeight);
                return;
            }

            const previewWidth = preview.scrollWidth;
            if (previewWidth <= 0) {
                console.error('Preview width is invalid:', previewWidth);
                return;
            }

            const aspectRatio = images[0].width / previewWidth;

            if (aspectRatio <= 0) {
                console.error('Preview aspect ratio is invalid:', aspectRatio);
                return;
            }

            const maxHeight = images.reduce((sum, img) => sum + img.height, 0);
            if (maxHeight <= 0) {
                console.error('Max height is invalid:', maxHeight);
                return;
            }

            const maxMarks = maxHeight / heightValue;
            if (maxMarks <= 0) {
                console.error('Max marks is invalid:', maxMarks);
                return;
            }

            const transformedHeight = heightValue / aspectRatio;
            
            const ids = [];
            setMarks((prevMarks) => {
                const newMarks = prevMarks.filter(mark => !mark.auto);
                for (let i = 1; i < maxMarks; i++) {
                    const id = uuidv4();
                    newMarks.push({
                        id,
                        auto: true,
                        y: i * transformedHeight
                    });
                    ids.push(id);
                }
                return newMarks;
            });
            setHeightMarks(ids);
        }

        if (!isHeightMarksEnabled) {
            setMarks((prevMarks) => prevMarks.filter(mark => !mark.auto));
            setHeightMarks([]);
        }
    }, [isHeightMarksEnabled, heightValue, setMarks, setHeightMarks]);

    useEffect(() => {
        if (images.length === 0) return;
        const imageWidth = images[0].width;
        const imageHeight = images[0].height;
        console.log(imageWidth, imageHeight);
        const calculatedHeight = Math.floor(imageWidth / .07 / 32) + imageWidth;
        if (calculatedHeight > imageHeight) {
            setHeightValue(imageHeight);
        } else {
            setHeightValue(calculatedHeight);
        }
    }, [images]);
    return (
        <div
            className={`backdrop-blur-md rounded-xl shadow-lg border p-4 ${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-300 shadow-gray-400'
                }`}
        >
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label
                        className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                        Agregar recortes en chunks de {heightValue}px
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isHeightMarksEnabled}
                            onChange={(e) => setIsHeightMarksEnabled(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div
                            className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${darkMode ? 'bg-gray-600 peer-checked:bg-blue-500' : 'bg-gray-300 peer-checked:bg-blue-500'
                                }`}
                        ></div>
                    </label>
                </div>
                <div>
                    <label
                        className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}
                    >
                        Altura (px)
                    </label>
                    <div className="relative flex items-center">
                        <input
                            type="number"
                            value={heightValue}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value >= 32 && value % 32 === 0) {
                                    setHeightValue(value);
                                }
                            }}
                            min="32"
                            step="32"
                            className={`w-full rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 appearance-none ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-gray-100 border-gray-300 text-gray-900'
                                }`}
                            style={{
                                WebkitAppearance: 'none',
                                MozAppearance: 'textfield',
                            }}
                        />
                        <div className="absolute right-2 flex flex-col items-center gap-1">
                            <button
                                type="button"
                                onClick={() => setHeightValue((prev) => prev + 32)}
                                className={`text-xs ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                                    }`}
                            >
                                <FaChevronUp />
                            </button>
                            <button
                                type="button"
                                onClick={() => setHeightValue((prev) => Math.max(32, prev - 32))}
                                className={`text-xs ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                                    }`}
                            >
                                <FaChevronDown />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DefineMarksChunks;