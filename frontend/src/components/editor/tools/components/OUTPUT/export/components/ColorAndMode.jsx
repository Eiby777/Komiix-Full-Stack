import React from 'react';

/**
 * Un componente de React que renderiza selectores para elegir el espacio de color y el modo de imagen.
 * 
 * @param {Object} props - Las propiedades del componente.
 * @param {string} props.colorSpace - El espacio de color seleccionado (sRGB, AdobeRGB).
 * @param {Function} props.setColorSpace - Función para actualizar el estado del espacio de color.
 * @param {string} props.imageMode - El modo de imagen seleccionado (RGB, Grayscale).
 * @param {Function} props.setImageMode - Función para actualizar el estado del modo de imagen.
 * @returns {JSX.Element} Un contenedor con dos selectores para el espacio de color y el modo de imagen.
 */
const ColorAndMode = ({ colorSpace, setColorSpace, imageMode, setImageMode }) => {
  const optionsColorSpaceMode = [
    { value: 'sRGB', label: 'sRGB' },
    { value: 'AdobeRGB', label: 'AdobeRGB' },
  ];
  const optionsColorMode = [
    { value: 'RGB', label: 'RGB' },
    { value: 'Grayscale', label: 'Grayscale' },
  ];
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-sm text-white/80 block mb-1">Color Space:</label>
        <select
          value={colorSpace}
          onChange={(e) => setColorSpace(e.target.value)}
          className="w-full p-3 bg-gray-700/50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        >
          {optionsColorSpaceMode.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm text-white/80 block mb-1">Image Mode:</label>
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
    </div>
  );
};

export default ColorAndMode;