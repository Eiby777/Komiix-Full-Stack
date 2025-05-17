import handleExport from "../handlers/handlersExport";

const ExportButton = ({
    isLoading,
    setIsLoading,
    exportAll,
    canvasInstances,
    activeImageIndex,
    images,
    format,
    quality,
    dimensions,
    maintainAspectRatio,
    imageMode,
    includeMetadata,
    interlacing,
    fileName,
    resizeAll
}) => {
    return (
        <div className="flex justify-end pt-4 border-t border-white/10">
            <button
                onClick={() => handleExport(
                    setIsLoading,
                    exportAll,
                    canvasInstances,
                    activeImageIndex,
                    images,
                    format,
                    quality,
                    dimensions,
                    maintainAspectRatio,
                    imageMode,
                    includeMetadata,
                    interlacing,
                    fileName,
                    resizeAll
                )}
                disabled={isLoading}
                className={`px-4 py-2 ${isLoading ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md font-medium transition duration-200 flex items-center justify-center gap-2`}
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Exporting...
                    </>
                ) : (
                    'Export'
                )}
            </button>
        </div>
    )
}

export default ExportButton;
