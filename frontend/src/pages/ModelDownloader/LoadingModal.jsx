/**
 * Muestra un modal con un mensaje de carga, un icono de carga giratorio y una barra de progreso
 * 
 * @param {Object} props - Los props del componente
 * @param {string} props.title - El título del modal
 * @param {string} props.message - El mensaje del modal
 * 
 * @returns {React.Component} El componente Modal de carga
 */
const LoadingModal = ({ title, message }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-[600]">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative bg-[#262626] border border-white/10 rounded-2xl shadow-2xl p-6 w-[400px] text-center">
                <h3 className="text-lg font-semibold text-white/90 mb-4">{title}</h3>
                <div className="flex justify-center mb-6">
                    <div className="w-8 h-8 border-4 border-[#4a90e2] border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-white/75 text-sm mb-4">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default LoadingModal;
