import React from 'react';

/**
 * Un componente de React que renderiza un interruptor para seleccionar el modo de exportación.
 * 
 * @param {Object} props - Las propiedades del componente.
 * @param {boolean} props.exportAll - Indica si todas las imágenes están seleccionadas para exportar.
 * @param {Function} props.setExportAll - Función para actualizar el estado de exportAll.
 * @returns {JSX.Element} Un div que contiene un interruptor estilizado y una etiqueta para la selección del modo de exportación.
 */
const ExportMode = ({ exportAll, setExportAll }) => {
    return (
        <div>
            <style>
                {`
          .custom-switch {
            position: relative;
            display: inline-flex;
            align-items: center;
            width: 44px;
            height: 24px;
            flex-shrink: 0;
          }
          .custom-switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }
          .custom-switch .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #4b5563;
            transition: background-color 0.2s;
            border-radius: 9999px;
          }
          .custom-switch input:checked + .slider {
            background-color: #2563eb;
          }
          .custom-switch .slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: transform 0.2s;
            border-radius: 50%;
          }
          .custom-switch input:checked + .slider:before {
            transform: translateX(20px);
          }
        `}
            </style>
            <label className="text-sm text-white/80 block mb-2">Export Mode:</label>
            <div className="flex items-center gap-4">
                <label className="custom-switch">
                    <input
                        type="checkbox"
                        checked={exportAll}
                        onChange={(e) => setExportAll(e.target.checked)}
                    />
                    <span className="slider"></span>
                </label>
                <span className="text-sm text-white/75">{exportAll ? 'All Images' : 'Current Image'}</span>
            </div>
        </div>
    );
};

export default ExportMode;