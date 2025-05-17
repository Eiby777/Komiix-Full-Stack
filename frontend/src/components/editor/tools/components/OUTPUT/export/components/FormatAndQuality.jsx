import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

/**
 * Un componente de React que renderiza controles para seleccionar el formato de imagen y la calidad de exportación.
 * 
 * @param {Object} props - Las propiedades del componente.
 * @param {string} props.format - El formato de imagen seleccionado (JPEG, PNG, WEBP).
 * @param {Function} props.setFormat - Función para actualizar el estado del formato.
 * @param {number} props.quality - El valor de calidad de la imagen (0-100).
 * @param {Function} props.setQuality - Función para actualizar el estado de la calidad.
 * @returns {JSX.Element} Un div con un selector de formato y un campo de calidad condicional con botones de incremento/decremento.
 */
const FormatAndQuality = ({ format, setFormat, quality, setQuality }) => {
  const options = [
    { value: 'JPEG', label: 'JPEG' },
    { value: 'PNG', label: 'PNG' },
    { value: 'WEBP', label: 'WEBP' },
  ];
  const handleQualityChange = (e) => {
    setQuality(Math.min(100, Math.max(0, e.target.value)));
  };

  const incrementQuality = () => {
    setQuality((prev) => Math.min(100, prev + 1));
  };

  const decrementQuality = () => {
    setQuality((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <style>
        {`
          .number-input-container {
            position: relative;
            display: flex;
            align-items: center;
          }
          .number-input-container input {
            width: 100%;
          }
          .number-input-buttons {
            position: absolute;
            right: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 2px;
          }
          .number-input-buttons button {
            background: none;
            border: none;
            color: white;
            padding: 0;
            line-height: 0;
            cursor: pointer;
          }
          .number-input-buttons button:hover {
            color: #60a5fa;
          }
          input[type='number']::-webkit-inner-spin-button,
          input[type='number']::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type='number'] {
            -moz-appearance: textfield;
          }
        `}
      </style>
      <div>
        <label className="text-sm text-white/80 block mb-1">Format:</label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="w-full p-3 bg-gray-700/50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {(format === 'JPEG' || format === 'WEBP') && (
        <div>
          <label className="text-sm text-white/80 block mb-1">Quality (0-100%):</label>
          <div className="number-input-container">
            <input
              type="number"
              value={quality}
              onChange={handleQualityChange}
              min="0"
              max="100"
              className="w-full p-3 bg-gray-700/50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
            <div className="number-input-buttons">
              <button type="button" onClick={incrementQuality}>
                <FontAwesomeIcon icon={faChevronUp} size="sm" />
              </button>
              <button type="button" onClick={decrementQuality}>
                <FontAwesomeIcon icon={faChevronDown} size="sm" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormatAndQuality;