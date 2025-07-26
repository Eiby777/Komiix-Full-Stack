// components/ScanTool.jsx - Versión lazy optimizada
import { useEffect, useState, useRef, useCallback } from "react";
import { useEditorStore } from "../../../../../../stores/editorStore";
import { LAYERS } from "../../../../../../constants/layers";
import { TOOLS } from "../../../../../../constants/tools";
import LoadingScan from "./components/LoadingScan";
import { getProjectImages } from "../../../../../../lib/localDB/projectDB";
import { getUser } from "../../../../../../hooks/useAuth";
import LoadingOverlay from "./components/LoadingOverlay";
import { combineDetections, processCanvas } from "./handlers/handlePostProcess";
import { arrayBufferToBase64 } from "./handlers/handlePreprocess";

// Hook para cargar dinámicamente los módulos de detección
const useDetectionModules = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const modulesRef = useRef(null);

  const loadModules = useCallback(async () => {
    if (modulesRef.current) {
      return modulesRef.current;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 Iniciando carga de módulos de detección...');
      
      // Cargar módulos en paralelo con timeouts
      const loadWithTimeout = (importPromise, name, timeout = 30000) => {
        return Promise.race([
          importPromise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error(`Timeout loading ${name}`)), timeout)
          )
        ]);
      };

      const [detectionModule, wasmModule] = await Promise.all([
        loadWithTimeout(
          import('./handlers/handleDetections'),
          'handleDetections',
          30000
        ),
        loadWithTimeout(
          import('./handlers/reconstruct_model'),
          'reconstructModel',
          20000
        )
      ]);

      console.log('✅ Módulos de detección cargados exitosamente');

      const modules = {
        fetchDetections: detectionModule.fetchDetections,
        // Incluir cualquier otra función que necesites
      };

      modulesRef.current = modules;
      setIsLoaded(true);
      return modules;

    } catch (err) {
      console.error('❌ Error cargando módulos de detección:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetModules = useCallback(() => {
    modulesRef.current = null;
    setIsLoaded(false);
    setError(null);
  }, []);

  return { 
    loadModules, 
    resetModules, 
    isLoading, 
    isLoaded, 
    error,
    modules: modulesRef.current 
  };
};

const ScanTool = () => {
  const {
    toggleTool,
    setActiveLayer,
    canvasInstances,
    getColorFromType,
    getCanvasInstance,
    setCanvasObjectStatus,
    activeTools,
    projectId,
    activeImageIndex
  } = useEditorStore();

  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [progress, setProgress] = useState([]);
  const [loadingPhase, setLoadingPhase] = useState('');
  const prevActiveToolsRef = useRef([]);

  const { 
    loadModules, 
    isLoading: isLoadingModules, 
    isLoaded: isModulesLoaded, 
    error: moduleError 
  } = useDetectionModules();

  const getProjectId = () => projectId || window.location.pathname.split("/").pop();

  const scanImages = async (scanOption) => {
    try {
      setLoading(true);
      setProgress([]);
      setLoadingPhase('Inicializando...');

      // Paso 1: Cargar módulos de detección si no están cargados
      if (!isModulesLoaded) {
        setLoadingPhase('Cargando módulos de detección...');
        console.log('📦 Cargando módulos de detección bajo demanda...');
        await loadModules();
      }

      // Paso 2: Obtener imágenes del proyecto
      setLoadingPhase('Obteniendo imágenes...');
      const projectId = getProjectId();
      const user = await getUser();
      const images = await getProjectImages(projectId, user.id);

      // Paso 3: Preparar payload
      setLoadingPhase('Preparando imágenes...');
      let payload = [];
      if (scanOption === "current") {
        const currentImage = images.find(img => img.index === activeImageIndex);
        if (currentImage) {
          payload.push({
            image_buffer: arrayBufferToBase64(currentImage.image),
            filename: `${currentImage.index}.webp`,
          });
        }
      } else {
        payload = images.reduce((acc, { image, index }) => {
          acc.push({
            image_buffer: arrayBufferToBase64(image),
            filename: `${index}.webp`,
          });
          return acc;
        }, []);
      }

      if (payload.length === 0) {
        throw new Error("No hay imágenes disponibles para escanear.");
      }

      // Paso 4: Ejecutar detección
      setLoadingPhase('Ejecutando detección...');
      
      // Cargar dinámicamente fetchDetections
      const { fetchDetections } = await loadModules();
      
      const { globes: dataGlobe, text: dataText } = await fetchDetections(
        payload,
        (update) => {
          setProgress((prev) => {
            const existingIndex = prev.findIndex(
              p => p.filename === update.filename && p.workerId === update.workerId
            );
            if (existingIndex >= 0) {
              const newProgress = [...prev];
              newProgress[existingIndex] = update;
              return newProgress;
            }
            return [...prev, update];
          });
        }
      );

      // Paso 5: Procesar resultados
      setLoadingPhase('Procesando resultados...');
      let combinedResponse = combineDetections(dataGlobe, dataText);

      if (scanOption === "current" && Object.keys(combinedResponse).length > 0) {
        const remappedResponse = {};
        Object.entries(combinedResponse).forEach(([key, value]) => {
          remappedResponse[activeImageIndex] = value;
        });
        combinedResponse = remappedResponse;
      }

      // Paso 6: Aplicar al canvas
      setLoadingPhase('Aplicando detecciones...');
      Object.entries(combinedResponse).forEach(([key, { detections }]) =>
        processCanvas(
          parseInt(key),
          detections,
          canvasInstances,
          getColorFromType,
          setCanvasObjectStatus
        )
      );

      toggleTool(TOOLS.RECTANGLE.id);
      setActiveLayer(LAYERS.ANNOTATION.id);

      console.log('✅ Escaneo completado exitosamente');

    } catch (error) {
      console.error('❌ Error en el proceso de escaneo:', error);
      setLoadingPhase('Error: ' + error.message);
      
      // Mostrar error al usuario
      setTimeout(() => {
        setLoadingPhase('');
      }, 3000);
      
    } finally {
      setLoading(false);
      setLoadingPhase('');
    }
  };

  // Precargar módulos cuando el usuario abre la herramienta
  useEffect(() => {
    const wasScanInactive = !prevActiveToolsRef.current.includes(TOOLS.SCAN.id);
    const isScanActive = activeTools.includes(TOOLS.SCAN.id);

    if (wasScanInactive && isScanActive) {
      setShowWarning(true);
      
      // Precargar módulos en background para mejor UX
      if (!isModulesLoaded && !isLoadingModules) {
        console.log('🚀 Precargando módulos de detección...');
        loadModules().catch(err => {
          console.warn('⚠️ Precarga de módulos falló, se cargarán cuando se necesiten:', err);
        });
      }
    }

    prevActiveToolsRef.current = [...activeTools];

    return () => {
      Object.keys(canvasInstances).forEach((index) => {
        const canvas = getCanvasInstance(parseInt(index));
        if (canvas) {
          const canvasObjects = canvas.getObjects();
          setCanvasObjectStatus(parseInt(index), canvasObjects.length > 1);
        }
      });
    };
  }, [activeTools, toggleTool, setActiveLayer, canvasInstances, getCanvasInstance, setCanvasObjectStatus, loadModules, isModulesLoaded, isLoadingModules]);

  return (
    <>
      {showWarning && (
        <LoadingOverlay
          setShowWarning={setShowWarning}
          toggleTool={toggleTool}
          scanImages={scanImages}
          isLoadingModules={isLoadingModules}
          moduleError={moduleError}
        />
      )}
      {loading && (
        <LoadingScan 
          progress={progress} 
          loadingPhase={loadingPhase}
          isLoadingModules={isLoadingModules}
        />
      )}
    </>
  );
};

export default ScanTool;