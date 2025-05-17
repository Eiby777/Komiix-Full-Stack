import React from 'react';

/**
 * Un componente de React que renderiza opciones avanzadas para incluir metadatos y habilitar entrelazado.
 * 
 * @param {Object} props - Las propiedades del componente.
 * @param {boolean} props.includeMetadata - Indica si se deben incluir metadatos en la imagen.
 * @param {Function} props.setIncludeMetadata - Función para actualizar el estado de inclusión de metadatos.
 * @param {boolean} props.interlacing - Indica si el entrelazado está habilitado.
 * @param {Function} props.setInterlacing - Función para actualizar el estado del entrelazado.
 * @returns {JSX.Element} Un contenedor con casillas de verificación para incluir metadatos y habilitar entrelazado.
 */
const AdvancedOptions = ({ includeMetadata, setIncludeMetadata, interlacing, setInterlacing }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center text-sm text-white/75">
        <input
          type="checkbox"
          checked={includeMetadata}
          onChange={(e) => setIncludeMetadata(e.target.checked)}
          className="mr-2 accent-blue-500"
        />
        Include Metadata
      </label>
      <label className="flex items-center text-sm text-white/75">
        <input
          type="checkbox"
          checked={interlacing}
          onChange={(e) => setInterlacing(e.target.checked)}
          className="mr-2 accent-blue-500"
        />
        Enable Interlacing
      </label>
    </div>
  );
};

export default AdvancedOptions;