import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const LoadingScan = ({ 
  message = "Cargando...", 
  progress = [], 
  loadingPhase = "",
  isLoadingModules = false 
}) => {
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
    
    const totalCompleted = progress.reduce((sum, file) => sum + (file.completed || 0), 0);
    const totalTasks = Math.max(...progress.map(file => file.total || 1));
    const percentage = Math.min(Math.round((totalCompleted / (totalTasks * 4)) * 100), 100) || 0;
    const completedFiles = progress.filter(file => file.completed >= file.total).length;
    const totalFiles = totalTasks;
    
    return { percentage, completedFiles, totalFiles };
  };

  const getPhaseIcon = (phase) => {
    if (phase.includes('Cargando módulos')) return '📦';
    if (phase.includes('Obteniendo')) return '📚';
    if (phase.includes('Preparando')) return '🔄';
    if (phase.includes('Ejecutando')) return '🔍';
    if (phase.includes('Procesando')) return '⚙️';
    if (phase.includes('Aplicando')) return '🎯';
    if (phase.includes('Error')) return '❌';
    return '🚀';
  };

  const getCurrentWorkerInfo = () => {
    if (progress.length === 0) return null;
    
    const activeWorkers = progress.reduce((acc, p) => {
      if (!acc[p.workerId]) {
        acc[p.workerId] = [];
      }
      acc[p.workerId].push(p);
      return acc;
    }, {});

    return Object.entries(activeWorkers).map(([workerId, workerProgress]) => {
      const latestProgress = workerProgress[workerProgress.length - 1];
      return {
        workerId,
        filename: latestProgress.filename,
        completed: latestProgress.completed,
        total: latestProgress.total
      };
    });
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
  const workerInfo = getCurrentWorkerInfo();

  if (!container) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[9999]">
      <div className="flex flex-col items-center space-y-4 bg-[#2a2a2a] p-6 rounded-md shadow-lg border border-gray-700/50 w-96 min-w-80">
        
        {/* Título */}
        <h2 className="text-xl font-bold text-white/90 mb-2">Procesando Escaneo</h2>
        
        {/* Fase actual con icono */}
        {loadingPhase && (
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-lg">{getPhaseIcon(loadingPhase)}</span>
            <span className="text-white/75 text-sm text-center">{loadingPhase}</span>
          </div>
        )}

        {/* Spinner principal */}
        {isLoadingModules ? (
          <div className="flex flex-col items-center space-y-2 mb-4">
            <div className="w-12 h-12 border-4 border-gray-700/50 border-t-[#4a90e2] rounded-full animate-spin" />
            <div className="text-[#4a90e2] text-sm">Cargando IA...</div>
          </div>
        ) : (
          <div className="w-12 h-12 border-4 border-gray-700/50 border-t-white rounded-full animate-spin" />
        )}

        {/* Mensaje principal */}
        <p className="text-white text-lg text-center">{message}</p>

        {/* Progreso global */}
        {totalFiles > 0 && (
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm text-white/60">
              <span>Progreso global</span>
              <span>{completedFiles} / {totalFiles}</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${displayPercentage}%` }}
              />
            </div>
            <div className="text-xs text-white/50 text-center">
              {displayPercentage.toFixed(1)}% completado
            </div>
          </div>
        )}

        {/* Información de workers */}
        {workerInfo && workerInfo.length > 0 && (
          <div className="w-full">
            <div className="text-sm text-white/60 mb-2 text-center">Workers activos:</div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {workerInfo.map(({ workerId, filename, completed, total }) => (
                <div key={workerId} className="bg-gray-800/50 p-2 rounded text-xs">
                  <div className="flex justify-between text-white/75">
                    <span className="font-mono">{workerId}</span>
                    <span>{completed}/{total}</span>
                  </div>
                  <div className="text-white/50 truncate">
                    {filename}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progreso simple para casos básicos */}
        {!totalFiles && (
          <p className="text-white text-sm text-center">
            {displayPercentage > 0 ? `Progreso: ${displayPercentage}%` : 'Iniciando...'}
          </p>
        )}

        {/* Consejos durante la carga */}
        <div className="text-xs text-white/50 bg-gray-800/30 p-3 rounded w-full">
          <div className="mb-1">💡 <strong className="text-white/70">Consejo:</strong></div>
          <div className="text-center">
            {isLoadingModules 
              ? "Los módulos de IA se cargan solo la primera vez"
              : totalFiles > 10 
                ? "Escaneo grande detectado. Puedes minimizar esta ventana."
                : "El escaneo estará listo en unos momentos"
            }
          </div>
        </div>
      </div>
    </div>,
    container
  );
};

export default LoadingScan;