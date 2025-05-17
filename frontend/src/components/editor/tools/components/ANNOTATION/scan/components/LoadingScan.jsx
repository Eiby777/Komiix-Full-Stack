import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const LoadingScan = ({ message = "Cargando...", progress = [] }) => {
  const [container, setContainer] = useState(null);
  const [displayPercentage, setDisplayPercentage] = useState(0);

  useEffect(() => {
    const el = document.createElement('div');
    el.className = 'loading-overlay-container';
    document.body.appendChild(el);
    setContainer(el);
    return () => {
      if (document.body.contains(el)) document.body.removeChild(el);
    };
  }, []);

  const calculateProgress = () => {
    if (progress.length === 0) return { percentage: 0, completedFiles: 0, totalFiles: 0 };

    // Sum completed tasks across all unique updates
    const totalCompleted = progress.reduce((sum, file) => sum + (file.completed || 0), 0);
    const totalTasks = Math.max(...progress.map(file => file.total || 1));
    const percentage = Math.min(Math.round((totalCompleted / (totalTasks * 4)) * 100), 100) || 0; // 4 workers
    const completedFiles = progress.filter(file => file.completed >= file.total).length;
    const totalFiles = totalTasks;

    return { percentage, completedFiles, totalFiles };
  };

  useEffect(() => {
    const { percentage } = calculateProgress();
    const interval = setInterval(() => {
      setDisplayPercentage(prev => {
        if (prev < percentage) {
          return Math.min(prev + 1, percentage);
        }
        return prev;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [progress]);

  const { completedFiles, totalFiles } = calculateProgress();

  if (!container) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[9999]">
      <div className="flex flex-col items-center space-y-4 bg-[#2a2a2a] p-6 rounded-md shadow-lg border border-gray-700/50 w-80">
        <div className="w-12 h-12 border-4 border-gray-700/50 border-t-white rounded-full animate-spin" />
        <p className="text-white text-lg">{message}</p>
        <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-white h-full rounded-full transition-all duration-300"
            style={{ width: `${displayPercentage}%` }}
          />
        </div>
        <p className="text-white text-sm text-center">
          {totalFiles > 0 ? `Progreso: ${displayPercentage}%` : 'Iniciando...'}
        </p>
      </div>
    </div>,
    container
  );
};

export default LoadingScan;