const Alert = ({
    showAlert,
    alertType,
    alertMessage,
    progress,
    setShowAlert
}) => {
    if (!showAlert) return null;

    return (
        <div className={`fixed top-20 right-4 ${alertType === 'error' ? 'bg-red-500' : 'bg-yellow-500'} text-white px-4 py-2 rounded-lg shadow-lg z-50 max-w-xs`}>
            <div className="flex justify-between items-center mb-1">
                <span>{alertMessage}</span>
                <button
                    onClick={() => setShowAlert(false)}
                    className="ml-2 text-white hover:text-gray-200"
                >
                    ✕
                </button>
            </div>
            <div className={`w-full ${alertType === 'error' ? 'bg-red-300' : 'bg-yellow-300'} rounded-full h-1.5`}>
                <div
                    className="bg-white h-1.5 rounded-full"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
};

export default Alert;