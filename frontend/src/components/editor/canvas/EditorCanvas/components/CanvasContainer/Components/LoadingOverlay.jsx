import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const LoadingOverlay = ({ message = "Cargando..." }) => {
  const [container, setContainer] = useState(null);

  useEffect(() => {
    const el = document.createElement('div');
    el.className = 'loading-overlay-container';
    document.body.appendChild(el);
    setContainer(el);


    return () => {
      if (document.body.contains(el)) {
        document.body.removeChild(el);
      }
    };
  }, []);

  if (!container) return null; 

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[9999]">
      <div className="flex flex-col items-center space-y-4 bg-[#2a2a2a] p-6 rounded-md shadow-lg border border-gray-700/50">
        <div className="w-12 h-12 border-4 border-gray-700/50 border-t-white rounded-full animate-spin" />
        <p className="text-white text-lg">{message}</p>
      </div>
    </div>,
    container
  );
};

export default LoadingOverlay;
