// handlers/handleDetections.js - Versión optimizada con lazy loading
import { getModel } from '../../../../../../../lib/localDB/modelDB.js';

// Cache para módulos cargados
let detectObjectsModule = null;
let wasmModule = null;

// Función para cargar detectObjects bajo demanda
async function loadDetectObjects() {
  if (detectObjectsModule) {
    return detectObjectsModule;
  }

  try {
    console.log('📦 Cargando módulo de detección de objetos...');
    const module = await import('../inference/inference.js');
    detectObjectsModule = module.default;
    console.log('✅ Módulo de detección cargado');
    return detectObjectsModule;
  } catch (error) {
    console.error('❌ Error cargando módulo de detección:', error);
    throw new Error('No se pudo cargar el módulo de detección de objetos');
  }
}

// Función para cargar WASM bajo demanda
async function loadWasmModule() {
  if (wasmModule) {
    return wasmModule;
  }

  try {
    console.log('🔧 Cargando módulo WebAssembly...');
    const module = await import('./reconstruct_model.js');
    wasmModule = await module.default();
    console.log('✅ Módulo WASM cargado');
    return wasmModule;
  } catch (error) {
    console.error('❌ Error cargando módulo WebAssembly:', error);
    throw new Error('No se pudo cargar el módulo de reconstrucción');
  }
}

function arrayBufferToUint8Array(buffer) {
  return new Uint8Array(buffer);
}

async function reconstructModel(modelData) {
  const module = await loadWasmModule();
  
  try {
    const { fragments, encrypted_fragment_index, encryption_key } = modelData;
    
    // Validaciones
    if (!fragments || !Array.isArray(fragments) || fragments.length === 0) {
      throw new Error('Fragments array es inválido o vacío');
    }
    if (!Number.isInteger(encrypted_fragment_index) || 
        encrypted_fragment_index < 0 || 
        encrypted_fragment_index >= fragments.length) {
      throw new Error(`encrypted_fragment_index inválido: ${encrypted_fragment_index}`);
    }
    if (!(encryption_key instanceof ArrayBuffer) || encryption_key.byteLength === 0) {
      throw new Error('encryption_key inválido o vacío');
    }

    console.log(`🔄 Reconstruyendo modelo con ${fragments.length} fragmentos...`);

    const fragmentArrays = fragments.map((f, i) => {
      const arr = arrayBufferToUint8Array(f);
      return arr;
    });
    const fragmentLengths = fragments.map(f => f.byteLength);
    const keyArray = arrayBufferToUint8Array(encryption_key);

    // Asignación de memoria con manejo de errores mejorado
    const fragmentPointers = [];
    let fragmentPtrArray = 0;
    let lengthPtr = 0;
    let keyPtr = 0;
    let outputLengthPtr = 0;

    try {
      // Asignar memoria para fragmentos
      for (let i = 0; i < fragmentArrays.length; i++) {
        const fragment = fragmentArrays[i];
        const ptr = module._malloc(fragment.length);
        if (ptr === 0) throw new Error(`Fallo al asignar memoria para fragment ${i}`);
        module.HEAPU8.set(fragment, ptr);
        fragmentPointers.push(ptr);
      }

      // Asignar array de punteros
      fragmentPtrArray = module._malloc(fragmentPointers.length * 4);
      if (fragmentPtrArray === 0) throw new Error('Fallo al asignar memoria para fragmentPtrArray');
      new Uint32Array(module.HEAPU32.buffer, fragmentPtrArray, fragmentPointers.length)
        .set(fragmentPointers);

      // Asignar array de longitudes
      lengthPtr = module._malloc(fragmentLengths.length * 4);
      if (lengthPtr === 0) throw new Error('Fallo al asignar memoria para lengthPtr');
      new Int32Array(module.HEAP32.buffer, lengthPtr, fragmentLengths.length)
        .set(fragmentLengths);

      // Asignar clave de encriptación
      keyPtr = module._malloc(keyArray.length);
      if (keyPtr === 0) throw new Error('Fallo al asignar memoria para keyPtr');
      module.HEAPU8.set(keyArray, keyPtr);

      // Asignar puntero para longitud de salida
      outputLengthPtr = module._malloc(4);
      if (outputLengthPtr === 0) throw new Error('Fallo al asignar memoria para outputLengthPtr');

      // Llamar función WASM
      const resultPtr = module.ccall(
        'reconstruct_model',
        'number',
        ['number', 'number', 'number', 'number', 'number', 'number', 'number'],
        [
          fragmentPtrArray,
          lengthPtr,
          fragments.length,
          encrypted_fragment_index,
          keyPtr,
          keyArray.length,
          outputLengthPtr
        ]
      );

      if (resultPtr === 0) {
        throw new Error('Reconstrucción del modelo falló');
      }

      const outputLength = module.HEAP32[outputLengthPtr >> 2];
      if (outputLength <= 0) {
        throw new Error('Longitud de salida inválida');
      }

      // Copiar datos reconstruidos
      const reconstructedData = new Uint8Array(
        module.HEAPU8.subarray(resultPtr, resultPtr + outputLength)
      );
      const reconstructedBuffer = reconstructedData.buffer.slice();

      // Liberar memoria
      fragmentPointers.forEach(ptr => module._free(ptr));
      if (fragmentPtrArray) module._free(fragmentPtrArray);
      if (lengthPtr) module._free(lengthPtr);
      if (keyPtr) module._free(keyPtr);
      if (outputLengthPtr) module._free(outputLengthPtr);
      module.ccall('free_model', null, ['number'], [resultPtr]);

      console.log(`✅ Modelo reconstruido exitosamente (${outputLength} bytes)`);
      return reconstructedBuffer;

    } catch (error) {
      // Limpiar memoria en caso de error
      fragmentPointers.forEach(ptr => {
        try { module._free(ptr); } catch {}
      });
      if (fragmentPtrArray) try { module._free(fragmentPtrArray); } catch {}
      if (lengthPtr) try { module._free(lengthPtr); } catch {}
      if (keyPtr) try { module._free(keyPtr); } catch {}
      if (outputLengthPtr) try { module._free(outputLengthPtr); } catch {}
      
      throw error;
    }

  } catch (error) {
    console.error('❌ Error al reconstruir el modelo:', error);
    throw error;
  }
}

// Cache para modelos reconstruidos
const modelCache = new Map();

async function getReconstructedModel(modelName, modelData) {
  const cacheKey = `${modelName}_${modelData.isFragmented}`;
  
  if (modelCache.has(cacheKey)) {
    console.log(`📋 Usando modelo ${modelName} desde cache`);
    return modelCache.get(cacheKey);
  }

  let reconstructedBuffer;
  if (modelData.isFragmented) {
    reconstructedBuffer = await reconstructModel(modelData);
  } else {
    reconstructedBuffer = modelData.data;
  }

  modelCache.set(cacheKey, reconstructedBuffer);
  return reconstructedBuffer;
}

export async function fetchDetections(imagesArray, progressCallback) {
  try {
    // Validación de entrada
    if (!imagesArray || !Array.isArray(imagesArray) || imagesArray.length === 0) {
      throw new Error('Se requiere un array de imágenes no vacío');
    }

    console.log(`🚀 Iniciando detección para ${imagesArray.length} imágenes`);

    // Paso 1: Obtener modelos de IndexedDB
    console.log('📚 Obteniendo modelos desde IndexedDB...');
    const [globesModel, textModel] = await Promise.all([
      getModel('globes'),
      getModel('text')
    ]);

    if (!globesModel || !textModel) {
      throw new Error('No se encontraron los modelos globes o text en IndexedDB');
    }

    // Paso 2: Reconstruir/preparar modelos en paralelo
    console.log('🔄 Preparando modelos...');
    const [globesBuffer, textBuffer] = await Promise.all([
      getReconstructedModel('globes', globesModel.modelData),
      getReconstructedModel('text', textModel.modelData)
    ]);

    const modelsArrayBuffer = [globesBuffer, textBuffer];

    // Paso 3: Cargar módulo de detección
    const detectObjects = await loadDetectObjects();

    // Paso 4: Ejecutar detección
    console.log('🔍 Ejecutando detección de objetos...');
    const results = await detectObjects(
      imagesArray,
      modelsArrayBuffer,
      (progress) => {
        console.log(`📊 Progreso: ${progress.completed}/${progress.total} - ${progress.filename}`);
        if (progressCallback) {
          progressCallback(progress);
        }
      },
      [576, 832] // inputSize
    );

    console.log('✅ Detección completada exitosamente');
    return results;

  } catch (error) {
    console.error('❌ Error en fetchDetections:', error);
    throw error;
  }
}

// Función para limpiar cache si es necesario
export function clearModelCache() {
  modelCache.clear();
  detectObjectsModule = null;
  // No limpiar wasmModule ya que es costoso de recargar
  console.log('🧹 Cache de modelos limpiado');
}

// Función para obtener estadísticas del cache
export function getCacheStats() {
  return {
    modelsCached: modelCache.size,
    detectObjectsLoaded: !!detectObjectsModule,
    wasmLoaded: !!wasmModule
  };
}