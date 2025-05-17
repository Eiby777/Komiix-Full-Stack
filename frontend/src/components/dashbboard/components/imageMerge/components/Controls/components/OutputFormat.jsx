
import { useState } from 'react';
import { handleFormatChange } from "../handlers/exportHandler";
import { handleExport } from "../handlers/exportHandler";
import { FaChevronUp, FaChevronDown, FaSpinner } from "react-icons/fa";

const OutputFormat = ({
    images,
    marks,
    format,
    setFormat,
    quality,
    setQuality,
    darkMode
}) => {
    const [loading, setLoading] = useState(false);
    return (
        <>
            <div
                className={`backdrop-blur-md rounded-xl shadow-lg border p-4 ${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-300 shadow-gray-400'
                    }`}
            >
                <div className="space-y-4">
                    <div>
                        <label
                            className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}
                        >
                            Formato de salida
                        </label>
                        <select
                            value={format}
                            onChange={(e) => handleFormatChange(e, setFormat, setQuality)}
                            className={`w-full rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-gray-100 border-gray-300 text-gray-900'
                                }`}
                        >
                            <option value="png">PNG (Sin pérdida)</option>
                            <option value="jpg">JPG</option>
                            <option value="webp">WebP</option>
                        </select>
                    </div>
                    <div>
                        <label
                            className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}
                        >
                            Calidad {format !== 'png' && `(${quality}%)`}
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="range"
                                min="1"
                                max="100"
                                value={quality}
                                onChange={(e) => setQuality(Number(e.target.value))}
                                disabled={format === 'png'}
                                className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer disabled:opacity-50 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'
                                    }`}
                            />
                            {format !== 'png' && (
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setQuality(Math.max(1, quality - 1))}
                                        disabled={format === 'png'}
                                        className={`disabled:opacity-50 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                                            }`}
                                    >
                                        <FaChevronDown size={12} />
                                    </button>
                                    <span className="w-10 text-center text-sm">{quality}%</span>
                                    <button
                                        onClick={() => setQuality(Math.min(100, quality + 1))}
                                        disabled={format === 'png'}
                                        className={`disabled:opacity-50 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                                            }`}
                                    >
                                        <FaChevronUp size={12} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <button
                onClick={async () => {
                    setLoading(true);
                    try {
                        await handleExport(images, marks, format, quality);
                    } finally {
                        setLoading(false);
                    }
                }}
                disabled={loading}
                className={`relative backdrop-blur-md rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300 text-white py-2 px-4 overflow-hidden group ${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-blue-500 border-blue-600'
                    } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                <div
                    className={`absolute inset-0 bg-gradient-to-r transition-all duration-300 ${darkMode
                        ? 'from-blue-500/0 to-blue-500/20 group-hover:from-blue-500/20 group-hover:to-blue-500/40'
                        : 'from-blue-600/0 to-blue-600/20 group-hover:from-blue-600/20 group-hover:to-blue-600/40'
                        }`}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                        <>
                            <FaSpinner className="animate-spin" />
                            Procesando...
                        </>
                    ) : (
                        'Exportar'
                    )}
                </span>
            </button>
        </>
    );
};

export default OutputFormat;
