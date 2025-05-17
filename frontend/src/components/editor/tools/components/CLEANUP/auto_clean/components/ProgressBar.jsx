import React from "react";

/**
 * Componente de barra de progreso para mostrar el avance del proceso de limpieza
 * 
 * @component
 * @param {Object} props - Props del componente
 * @param {Object} props.progress - Objeto con el progreso actual
 * @param {number} props.progress.current - Número de imágenes procesadas
 * @param {number} props.progress.total - Total de imágenes a procesar
 * @param {number} props.percentage - Porcentaje completado (0-100)
 * @returns {JSX.Element} Barra de progreso con información textual
 */
const ProgressBar = ({ canvasProgress, percentage }) => {
  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold text-white/90 mb-4">Procesando...</h3>
      <p className="text-white/75 text-sm mb-4">
        Limpiando automáticamente las imágenes: {canvasProgress.current} de {canvasProgress.total} imágenes
      </p>
      <div className="w-full bg-gray-700/50 rounded-full h-2.5 mb-6">
        <div
          className="bg-[#4a90e2] h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
