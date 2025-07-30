import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

/**
 * Un componente de React que renderiza campos de entrada para especificar las dimensiones de la imagen, con soporte para mantener la relación de aspecto y redimensionar múltiples imágenes.
 * 
 * @param {Object} props - Las propiedades del componente.
 * @param {Object} props.initialDimensions - Dimensiones iniciales de la imagen (ancho y alto).
 * @param {Object} props.dimensions - Dimensiones actuales de la imagen (ancho y alto).
 * @param {Function} props.setDimensions - Función para actualizar el estado de las dimensiones.
 * @param {boolean} props.maintainAspectRatio - Indica si se debe mantener la relación de aspecto.
 * @param {Function} props.setMaintainAspectRatio - Función para actualizar el estado de mantener la relación de aspecto.
 * @param {boolean} props.exportAll - Indica si todas las imágenes están seleccionadas para exportar.
 * @param {boolean} props.resizeAll - Indica si todas las imágenes deben redimensionarse.
 * @param {Function} props.setResizeAll - Función para actualizar el estado de redimensionar todas las imágenes.
 * @returns {JSX.Element} Un contenedor con campos de entrada para ancho y alto, y casillas para mantener la relación de aspecto y redimensionar todas las imágenes.
 */
const DimensionsInput = ({ 
  initialDimensions,
  dimensions, 
  setDimensions, 
  maintainAspectRatio, 
  setMaintainAspectRatio,
  exportAll,
  resizeAll,
  setResizeAll
}) => {
  const [aspectRatio, setAspectRatio] = useState(null);

  useEffect(() => {
    if (initialDimensions.width && initialDimensions.height) {
      setAspectRatio(initialDimensions.width / initialDimensions.height);
    }
  }, []);

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;
    
    setDimensions((prev) => {
      if (!maintainAspectRatio || !aspectRatio || name !== 'width' && name !== 'height') {
        return { ...prev, [name]: value };
      }

      const newDims = { ...prev, [name]: value };
      if (name === 'width') {
        newDims.height = Math.round(numValue / aspectRatio);
      } else {
        newDims.width = Math.round(numValue * aspectRatio);
      }
      return newDims;
    });
  };

  const incrementDimension = (field) => {
    setDimensions((prev) => {
      const newValue = parseInt(prev[field]) + 1 || 1;
      const newDims = { ...prev, [field]: newValue };

      if (maintainAspectRatio && aspectRatio) {
        if (field === 'width') {
          newDims.height = Math.round(newValue / aspectRatio);
        } else {
          newDims.width = Math.round(newValue * aspectRatio);
        }
      }
      return newDims;
    });
  };

  const decrementDimension = (field) => {
    setDimensions((prev) => {
      const newValue = Math.max(0, parseInt(prev[field]) - 1) || 0;
      const newDims = { ...prev, [field]: newValue };

      if (maintainAspectRatio && aspectRatio) {
        if (field === 'width') {
          newDims.height = Math.round(newValue / aspectRatio);
        } else {
          newDims.width = Math.round(newValue * aspectRatio);
        }
      }
      return newDims;
    });
  };

  return (
    <>
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-white/80 block mb-1">Ancho (px):</label>
          <div className="number-input-container">
            <input
              type="number"
              name="width"
              value={dimensions.width}
              onChange={handleDimensionChange}
              disabled={exportAll && !resizeAll}
              className={`w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
                exportAll && !resizeAll 
                  ? 'bg-gray-700/30 text-white/50 cursor-not-allowed' 
                  : 'bg-gray-700/50 text-white'
              }`}
            />
            <div className="number-input-buttons">
              <button type="button" onClick={() => incrementDimension('width')}>
                <FontAwesomeIcon icon={faChevronUp} size="sm" />
              </button>
              <button type="button" onClick={() => decrementDimension('width')}>
                <FontAwesomeIcon icon={faChevronDown} size="sm" />
              </button>
            </div>
          </div>
        </div>
        <div>
          <label className="text-sm text-white/80 block mb-1">Alto (px):</label>
          <div className="number-input-container">
            <input
              type="number"
              name="height"
              value={dimensions.height}
              onChange={handleDimensionChange}
              disabled={exportAll && !resizeAll}
              className={`w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
                exportAll && !resizeAll 
                  ? 'bg-gray-700/30 text-white/50 cursor-not-allowed' 
                  : 'bg-gray-700/50 text-white'
              }`}
            />
            <div className="number-input-buttons">
              <button type="button" onClick={() => incrementDimension('height')}>
                <FontAwesomeIcon icon={faChevronUp} size="sm" />
              </button>
              <button type="button" onClick={() => decrementDimension('height')}>
                <FontAwesomeIcon icon={faChevronDown} size="sm" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <label className="flex items-center text-sm text-white/75">
        <input
          type="checkbox"
          checked={maintainAspectRatio}
          onChange={(e) => setMaintainAspectRatio(e.target.checked)}
          className="mr-2 accent-blue-500"
        />
        Mantener Relación de Aspecto
      </label>
      {exportAll && (
        <label className="flex items-center text-sm text-white/75 mt-2">
          <input
            type="checkbox"
            checked={resizeAll}
            onChange={(e) => setResizeAll(e.target.checked)}
            className="mr-2 accent-blue-500"
          />
          Redimensionar todas las imágenes
        </label>
      )}
    </>
  );
};

export default DimensionsInput;
