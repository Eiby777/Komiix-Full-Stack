import React from 'react';

/**
 * Un componente de React que renderiza un campo de entrada para especificar el nombre o prefijo del archivo.
 * 
 * @param {Object} props - Las propiedades del componente.
 * @param {boolean} props.exportAll - Indica si todas las imágenes están seleccionadas para exportar.
 * @param {string} props.fileName - El nombre o prefijo del archivo actual.
 * @param {Function} props.setFileName - Función para actualizar el estado de fileName.
 * @returns {JSX.Element} Un div que contiene un campo de entrada para el nombre o prefijo del archivo con una etiqueta dinámica.
 */
const FileNameInput = ({ exportAll, fileName, setFileName }) => {
  return (
    <div>
      <label className="text-sm text-white/80 block mb-1">
        {exportAll ? 'Prefijo de Archivo:' : 'Nombre de Archivo:'}
      </label>
      <input
        type="text"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        className="w-full p-3 bg-gray-700/50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        placeholder={exportAll ? 'ej., imagen (se convierte en imagen-1, imagen-2, ...)' : 'ej., mi-imagen'}
      />
    </div>
  );
};

export default FileNameInput;
