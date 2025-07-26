// utils/performanceMonitor.js
class PerformanceMonitor {
    constructor() {
      this.metrics = {
        bundleLoadTime: 0,
        wasmLoadTime: 0,
        modelLoadTime: 0,
        totalLoadTime: 0,
        memoryUsage: 0
      };
      this.startTime = performance.now();
    }
  
    // Monitorear carga de chunks
    trackChunkLoad(chunkName, startTime, endTime) {
      const loadTime = endTime - startTime;
      console.log(`📦 Chunk "${chunkName}" loaded in ${loadTime.toFixed(2)}ms`);
      
      if (chunkName.includes('ml-detection')) {
        this.metrics.bundleLoadTime = loadTime;
      }
      
      return loadTime;
    }
  
    // Monitorear carga de WASM
    trackWasmLoad(wasmName, startTime, endTime) {
      const loadTime = endTime - startTime;
      this.metrics.wasmLoadTime = loadTime;
      console.log(`🔧 WASM "${wasmName}" loaded in ${loadTime.toFixed(2)}ms`);
      return loadTime;
    }
  
    // Monitorear carga de modelos
    trackModelLoad(modelName, startTime, endTime, size) {
      const loadTime = endTime - startTime;
      const sizeInMB = (size / 1024 / 1024).toFixed(2);
      console.log(`🧠 Model "${modelName}" (${sizeInMB}MB) loaded in ${loadTime.toFixed(2)}ms`);
      
      this.metrics.modelLoadTime += loadTime;
      return loadTime;
    }
  
    // Monitorear uso de memoria
    trackMemoryUsage() {
      if ('memory' in performance) {
        const memory = performance.memory;
        this.metrics.memoryUsage = {
          used: (memory.usedJSHeapSize / 1024 / 1024).toFixed(2),
          total: (memory.totalJSHeapSize / 1024 / 1024).toFixed(2),
          limit: (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)
        };
        
        console.log(`💾 Memory: ${this.metrics.memoryUsage.used}MB / ${this.metrics.memoryUsage.total}MB`);
      }
    }
  
    // Generar reporte completo
    generateReport() {
      this.metrics.totalLoadTime = performance.now() - this.startTime;
      this.trackMemoryUsage();
  
      const report = {
        ...this.metrics,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        connection: this.getConnectionInfo()
      };
  
      console.group('📊 Performance Report');
      console.table(this.metrics);
      console.log('Connection:', report.connection);
      console.groupEnd();
  
      return report;
    }
  
    // Obtener información de conexión
    getConnectionInfo() {
      if ('connection' in navigator) {
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        return {
          effectiveType: conn?.effectiveType || 'unknown',
          downlink: conn?.downlink || 'unknown',
          rtt: conn?.rtt || 'unknown'
        };
      }
      return { effectiveType: 'unknown' };
    }
  
    // Detectar dispositivos de baja potencia
    isLowEndDevice() {
      const memory = navigator.deviceMemory || 4; // Default 4GB
      const cores = navigator.hardwareConcurrency || 4; // Default 4 cores
      
      return memory <= 2 || cores <= 2;
    }
  
    // Recomendaciones basadas en performance
    getOptimizationRecommendations() {
      const recommendations = [];
      
      if (this.metrics.wasmLoadTime > 5000) {
        recommendations.push('Consider using a CDN for WASM files');
      }
      
      if (this.metrics.modelLoadTime > 10000) {
        recommendations.push('Consider model compression or lazy loading');
      }
      
      if (this.isLowEndDevice()) {
        recommendations.push('Enable low-end device optimizations');
      }
      
      if (this.metrics.memoryUsage.used > 100) {
        recommendations.push('Monitor memory usage - consider cleanup');
      }
      
      return recommendations;
    }
  }
  
  // Hook para usar el monitor de performance
  export const usePerformanceMonitor = () => {
    const [monitor] = useState(() => new PerformanceMonitor());
    const [metrics, setMetrics] = useState(null);
  
    const trackAsyncOperation = useCallback(async (name, operation) => {
      const startTime = performance.now();
      try {
        const result = await operation();
        const endTime = performance.now();
        
        if (name.includes('wasm')) {
          monitor.trackWasmLoad(name, startTime, endTime);
        } else if (name.includes('model')) {
          monitor.trackModelLoad(name, startTime, endTime, result?.byteLength || 0);
        } else {
          monitor.trackChunkLoad(name, startTime, endTime);
        }
        
        return result;
      } catch (error) {
        console.error(`Error in ${name}:`, error);
        throw error;
      }
    }, [monitor]);
  
    const generateReport = useCallback(() => {
      const report = monitor.generateReport();
      setMetrics(report);
      return report;
    }, [monitor]);
  
    return { trackAsyncOperation, generateReport, metrics, monitor };
  };
  
  // Componente para mostrar métricas en tiempo real
  export const PerformanceDebugger = ({ enabled = false }) => {
    const [metrics, setMetrics] = useState(null);
    const { generateReport } = usePerformanceMonitor();
  
    useEffect(() => {
      if (!enabled) return;
  
      const interval = setInterval(() => {
        const report = generateReport();
        setMetrics(report);
      }, 2000);
  
      return () => clearInterval(interval);
    }, [enabled, generateReport]);
  
    if (!enabled || !metrics) return null;
  
    return (
      <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-sm">
        <h3 className="font-bold mb-2">Performance Metrics</h3>
        <div className="space-y-1">
          <div>Bundle: {metrics.bundleLoadTime.toFixed(0)}ms</div>
          <div>WASM: {metrics.wasmLoadTime.toFixed(0)}ms</div>
          <div>Models: {metrics.modelLoadTime.toFixed(0)}ms</div>
          <div>Total: {metrics.totalLoadTime.toFixed(0)}ms</div>
          {metrics.memoryUsage && (
            <div>Memory: {metrics.memoryUsage.used}MB</div>
          )}
          <div className="text-xs text-gray-300">
            {metrics.connection.effectiveType}
          </div>
        </div>
      </div>
    );
  };
  
  // Función para medir el tamaño de chunks después del build
  export const analyzeBuildSize = async (distPath = './dist') => {
    const fs = await import('fs');
    const path = await import('path');
    
    const files = fs.readdirSync(path.join(distPath, 'assets'));
    const analysis = files
      .filter(file => file.endsWith('.js') || file.endsWith('.wasm'))
      .map(file => {
        const filePath = path.join(distPath, 'assets', file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          sizeInMB: (stats.size / 1024 / 1024).toFixed(2)
        };
      })
      .sort((a, b) => b.size - a.size);
  
    console.table(analysis);
    return analysis;
  };
  
  export default PerformanceMonitor;