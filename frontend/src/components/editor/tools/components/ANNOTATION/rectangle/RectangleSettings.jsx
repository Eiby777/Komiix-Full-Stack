import React, { useState, useEffect } from 'react';
import { Type } from 'lucide-react';
import normalIcon from './icons/normal.svg';
import screamIcon from './icons/scream.svg';
import touchedIcon from './icons/touched.svg';
import thinkIcon from './icons/think.svg';
import sentenceIcon from './icons/sentence.svg';
import { useEditorStore } from '../../../../../../stores/editorStore';
import useLayerHistory from '../../../../floating-menus/UndoRedoMenu/handlers/fabricHistoryManager';
import ObjectStatus from '../../../../floating-menus/UndoRedoMenu/handlers/enumObjectRequests';

const BubbleButton = ({ icon, label, color, onClick, isActive }) => {
  
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="relative">
      <button
        className={`flex items-center justify-center p-2 rounded-md w-16 h-16 transition duration-200 ${
          isActive ? 'bg-opacity-20' : 'bg-gray-800 hover:bg-gray-700'
        }`}
        style={{
          border: `${isActive ? '3px' : '2px'} solid ${color}`,
          backgroundColor: isActive ? `${color}33` : 'transparent',
        }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img src={icon} alt={label} className="w-8 h-8" />
      </button>
      {isHovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded p-1 mt-1 whitespace-nowrap">
          {label}
        </div>
      )}
    </div>
  );
};

const TextButton = ({ isActive, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const textColor = '#FFFF00';
  return (
    <div className="relative">
      <button
        className={`flex items-center justify-center p-2 rounded-md w-16 h-16 transition duration-200 ${
          isActive ? 'bg-opacity-20' : 'bg-gray-800 hover:bg-gray-700'
        }`}
        style={{
          border: `${isActive ? '3px' : '2px'} solid ${textColor}`,
          backgroundColor: isActive ? `${textColor}33` : 'transparent',
        }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Type className="w-8 h-8" style={{ color: textColor }} />
      </button>
      {isHovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded p-1 mt-1 whitespace-nowrap">
          Text
        </div>
      )}
    </div>
  );
};

export default function RectangleSettings() {
  const { saveState } = useLayerHistory();
  const { selectedRectangleColor, setRectangleColor, getCanvasInstance, activeImageIndex } = useEditorStore();
  const canvas = getCanvasInstance(activeImageIndex);

  const bubbleTypes = [
    { icon: normalIcon, label: 'Normal', type: 'normal', color: '#4a90e2' },
    { icon: screamIcon, label: 'Scream', type: 'scream', color: '#ff6b6b' },
    { icon: touchedIcon, label: 'Touched', type: 'touched', color: '#9775fa' },
    { icon: thinkIcon, label: 'Think', type: 'think', color: '#69db7c' },
    { icon: sentenceIcon, label: 'Sentence', type: 'sentence', color: '#ffa94d' },
  ];

  // Función para determinar la cantidad de columnas según el ancho de la ventana
  const getColumns = (width) => {
    if (width >= 1700) return 3;
    else if (width >= 1000) return 2;
    else return 1;
  };

  const [columns, setColumns] = useState(getColumns(window.innerWidth));

  useEffect(() => {
    const handleResize = () => {
      setColumns(getColumns(window.innerWidth));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Agrupamos los botones en filas según la cantidad de columnas
  const rows = [];
  for (let i = 0; i < bubbleTypes.length; i += columns) {
    rows.push(bubbleTypes.slice(i, i + columns));
  }


  const updateRectStyleAndAnnotation = (rectObject, color) => {
    rectObject.set({
      stroke: color,
      cornerColor: color,
    });
    rectObject.setCoords();
    saveState(rectObject, ObjectStatus.UPDATE);
  };

  const handleBubbleTypeSelect = (type) => {
    const selectedType = bubbleTypes.find((t) => t.type === type);
    setRectangleColor(selectedType.color);

    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    updateRectStyleAndAnnotation(activeObject, selectedType.color);
  };

  const handleTextButtonClick = () => {
    setRectangleColor('#FFFF00');
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    updateRectStyleAndAnnotation(activeObject, '#FFFF00');
  };

  return (
    <div className="p-4">
      {/* Se renderiza cada fila en un contenedor flex centrado */}
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-2 mb-2">
          {row.map((type) => (
            <BubbleButton
              key={type.type}
              icon={type.icon}
              label={type.label}
              color={type.color}
              isActive={selectedRectangleColor === type.color}
              onClick={() => handleBubbleTypeSelect(type.type)}
            />
          ))}
        </div>
      ))}

      {/* Botón de texto, centrado de forma independiente */}
      <div className="mt-4 pt-4 border-t border-gray-700/50 flex justify-center">
        <TextButton
          isActive={selectedRectangleColor === '#FFFF00'}
          onClick={handleTextButtonClick}
        />
      </div>
    </div>
  );
}
