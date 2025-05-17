/**
 * Muestra un modal con un mensaje de carga y un icono de carga giratorio
 * 
 * @param {Object} props - Los props del componente
 * @param {string} props.title - El título del modal
 * @param {string} props.message - El mensaje del modal
 * 
 * @returns {React.Component} El componente Modal de carga
 */
const LoadingModal = ({ title, message }) => {
    console.log(message);
    return (
        <div className="text-center">
            <h3 className="text-lg font-semibold text-white/90 mb-4">{title}</h3>
            <div className="flex justify-center mb-6">
                <div className="w-8 h-8 border-4 border-[#4a90e2] border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-white/75 text-sm">
                {message}
            </p>
        </div>
    );
};

export default LoadingModal;