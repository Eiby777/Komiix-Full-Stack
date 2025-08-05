import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';

const ImageModal = ({ isOpen, imageSrc, imageAlt, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay oscuro */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Contenedor del modal */}
      <div className="relative z-10 max-w-7xl max-h-[95vh] mx-4">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-3 text-white hover:text-gray-300 transition-colors duration-200 z-20"
          aria-label="Cerrar modal"
        >
          <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
        </button>

        {/* Contenedor de la imagen */}
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
          {/* Imagen */}
          <img
            src={imageSrc}
            alt={imageAlt}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          
          {/* Overlay de información */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="text-white text-sm font-medium">
              {imageAlt}
            </p>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="text-center mt-4 text-white text-sm">
          <p>Presiona ESC para cerrar</p>
        </div>
      </div>
    </div>
  );
};

export default ImageModal; 