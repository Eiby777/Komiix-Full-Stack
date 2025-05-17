/**
 * Componente que muestra una barra de progreso para el escaneo de texto en las imágenes.
 * 
 * @param {Object} props - Los props del componente
 * @param {Object} props.progress - El objeto con la información de progreso
 * @param {number} props.progress.canvasProgress.current - El número actual de recortes procesados
 * @param {number} props.progress.canvasProgress.total - El número total de recortes a procesar
 * @param {number} props.progressPercentage - El porcentaje de progreso actual
 * 
 * @returns {React.Component} El componente ProgressBar
 */
const ProgressBar = ({ progress, progressPercentage }) => {
    return (
        <div className="text-center">
            <h3 className="text-lg font-semibold text-white/90 mb-4">Procesando...</h3>
            <p className="text-white/75 text-sm mb-4">
                Escaneando texto en las imágenes: {progress.canvasProgress.current} de {progress.canvasProgress.total} recortes
            </p>
            <div className="w-full bg-gray-700/50 rounded-full h-2.5 mb-6">
                <div
                    className="bg-[#4a90e2] h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
