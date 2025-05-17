import React from "react";

/**
 * Componente de modal de carga para mostrar durante operaciones asíncronas
 * 
 * @component
 * @param {Object} props - Props del componente
 * @param {string} props.title - Título del modal
 * @param {string} props.message - Mensaje descriptivo del proceso
 * @returns {JSX.Element} Modal con spinner de carga y mensaje
 */
const LoadingModal = ({ title, message }) => {
  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold text-white/90 mb-4">{title}</h3>
      <div className="flex justify-center mb-6">
        <div className="w-8 h-8 border-4 border-[#4a90e2] border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="text-white/75 text-sm">{message}</p>
    </div>
  );
};

export default LoadingModal;
