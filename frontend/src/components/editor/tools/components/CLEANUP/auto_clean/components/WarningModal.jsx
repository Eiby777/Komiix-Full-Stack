import React from "react";

/**
 * Modal de advertencia para la limpieza automática
 * 
 * @component
 * @param {Object} props - Props del componente
 * @param {boolean} props.selectAllImages - Si se deben procesar todas las imágenes
 * @param {Function} props.setSelectAllImages - Función para actualizar la opción de imágenes
 * @param {Function} props.onAccept - Callback al aceptar el modal
 * @param {Function} props.onCancel - Callback al cancelar el modal
 * @returns {JSX.Element} Modal de advertencia
 */
const WarningModal = ({
  selectAllImages,
  setSelectAllImages,
  onAccept,
  onCancel
}) => {
  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold text-white/90 mb-4">Advertencia</h3>
      <div className="space-y-4">
        <p className="text-white/75 text-sm">
          Esta herramienta tomará como referencia las anotaciones de la capa anterior.
        </p>
        <div className="space-y-3">
          <div className="mb-6">
            <label className="text-white/75 text-sm block mb-2">Seleccionar imágenes a procesar:</label>
            <select
              value={selectAllImages}
              onChange={(e) => setSelectAllImages(e.target.value === "true")}
              className="w-full p-2 bg-[#2a2a2a] text-white rounded-md border border-gray-700 focus:outline-none focus:border-[#4a90e2]"
            >
              <option value="true">Todas las imágenes</option>
              <option value="false">Imagen actual</option>
            </select>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700/50 text-white rounded-md hover:bg-gray-600 active:bg-gray-500 transition-all duration-200"
        >
          Cancelar
        </button>
        <button
          onClick={onAccept}
          className="px-4 py-2 bg-[#4a90e2] text-white rounded-md hover:bg-[#357abd] active:bg-[#2d6aa6] transition-all duration-200"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default WarningModal;
