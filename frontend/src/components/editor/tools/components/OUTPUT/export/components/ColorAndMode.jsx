import React from 'react';

/**
 * Un componente de React que renderiza un selector para elegir el modo de imagen.
 * 
 * @param {Object} props - Las propiedades del componente.
 * @param {string} props.imageMode - El modo de imagen seleccionado (RGB, Grayscale).
 * @param {Function} props.setImageMode - Función para actualizar el estado del modo de imagen.
 * @returns {JSX.Element} Un contenedor con un selector para el modo de imagen.
 */
const ColorAndMode = ({ imageMode, setImageMode }) => {
  const optionsColorMode = [
    { value: 'RGB', label: 'Color' },
    { value: 'Grayscale', label: 'Escala de Grises' },
  ];
  
  return (
    <div>
      <label className="text-sm text-white/80 block mb-1">Modo de Imagen:</label>
      <select
        value={imageMode}
        onChange={(e) => setImageMode(e.target.value)}
        className="w-full p-3 bg-gray-700/50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
      >
        {optionsColorMode.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ColorAndMode;
