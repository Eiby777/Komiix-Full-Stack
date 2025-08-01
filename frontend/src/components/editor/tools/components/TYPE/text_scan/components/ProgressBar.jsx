/**
 * Componente que muestra una barra de progreso para el escaneo de texto en las imágenes.
 *
 * @param {Object} props - Los props del componente
 * @param {Object} props.progress - El objeto con la información de progreso
 * @param {number} props.progress.canvasProgress.current - El número actual de recortes procesados
 * @param {number} props.progress.canvasProgress.total - El número total de recortes a procesar
 * @param {string} props.progress.phase - La fase actual del proceso ('scanning', 'translating', 'creating')
 * @param {number} props.progressPercentage - El porcentaje de progreso actual
 *
 * @returns {React.Component} El componente ProgressBar
 */
const ProgressBar = ({ progress, progressPercentage }) => {
    const getPhaseMessage = () => {
      switch (progress.phase) {
        case 'scanning':
          return {
            title: 'Procesando...',
            message: `Escaneando texto en las imágenes: ${progress.canvasProgress.current} de ${progress.canvasProgress.total} recortes`
          };
        case 'translating':
          return {
            title: 'Traduciendo...',
            message: 'Procesando traducción del texto detectado'
          };
        case 'creating':
          return {
            title: 'Finalizando...',
            message: 'Creando cuadros de texto en el canvas'
          };
        default:
          return {
            title: 'Procesando...',
            message: 'Procesando imágenes...'
          };
      }
    };
  
    const { title, message } = getPhaseMessage();
    const showProgressBar = progress.phase === 'scanning';
    const showSpinner = progress.phase === 'translating' || progress.phase === 'creating';
  
    return (
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white/90 mb-4">{title}</h3>
        <p className="text-white/75 text-sm mb-4">{message}</p>
        
        {showProgressBar && (
          <div className="w-full bg-gray-700/50 rounded-full h-2.5 mb-6">
            <div
              className="bg-[#4a90e2] h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
        
        {showSpinner && (
          <div className="flex justify-center mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4a90e2]"></div>
          </div>
        )}
      </div>
    );
  };
  
  export default ProgressBar;