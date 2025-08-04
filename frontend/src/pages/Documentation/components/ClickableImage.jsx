import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand } from '@fortawesome/free-solid-svg-icons';
import ImageModal from './ImageModal';

const ClickableImage = ({ 
  src, 
  alt, 
  placeholderText, 
  placeholderIcon, 
  className = "",
  isPlaceholder = false 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    if (!isPlaceholder) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div 
        className={`
          relative cursor-pointer group transition-all duration-300 
          hover:scale-105 hover:shadow-xl rounded-xl overflow-hidden
          ${className}
          ${isPlaceholder ? 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600' : ''}
        `}
        onClick={handleClick}
      >
        {isPlaceholder ? (
          // Placeholder para imágenes/GIFs futuras
          <div className="p-12 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              {placeholderIcon && (
                <div className="mb-4">
                  {placeholderIcon}
                </div>
              )}
              <p className="font-medium">{placeholderText}</p>
              <p className="text-sm mt-2">Haz clic para ver la imagen</p>
            </div>
          </div>
        ) : (
          // Imagen real
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Overlay con icono de expandir */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
            <FontAwesomeIcon 
              icon={faExpand} 
              className="w-5 h-5 text-gray-700 dark:text-gray-300" 
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      <ImageModal
        isOpen={isModalOpen}
        imageSrc={src}
        imageAlt={alt}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ClickableImage; 