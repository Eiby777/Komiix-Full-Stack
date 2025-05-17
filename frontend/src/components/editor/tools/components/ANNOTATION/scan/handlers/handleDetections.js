import detectObjects from '../inference/inference.js';
import { getModel } from '../../../../../../../lib/localDB/modelDB.js';

let wasmModule = null;
async function loadWasmModule() {
  if (!wasmModule) {
    try {
      const module = await import('./reconstruct_model.js');
      wasmModule = await module.default();
    } catch (error) {
      console.error('Error al cargar el módulo WebAssembly:', error);
      throw new Error('No se pudo cargar el módulo de reconstrucción');
    }
  }
  return wasmModule;
}

function arrayBufferToUint8Array(buffer) {
  return new Uint8Array(buffer);
}

async function reconstructModel(modelData) {
  const module = await loadWasmModule();
  try {
    const { fragments, encrypted_fragment_index, encryption_key } = modelData;
    if (!fragments || !Array.isArray(fragments) || fragments.length === 0) {
      throw new Error('Fragments array es inválido o vacío');
    }
    if (!Number.isInteger(encrypted_fragment_index) || encrypted_fragment_index < 0 || encrypted_fragment_index >= fragments.length) {
      throw new Error(`encrypted_fragment_index inválido: ${encrypted_fragment_index}`);
    }
    if (!(encryption_key instanceof ArrayBuffer) || encryption_key.byteLength === 0) {
      throw new Error('encryption_key inválido o vacío');
    }

    const fragmentArrays = fragments.map((f, i) => {
      const arr = arrayBufferToUint8Array(f);
      return arr;
    });
    const fragmentLengths = fragments.map(f => f.byteLength);
    const keyArray = arrayBufferToUint8Array(encryption_key);

    const fragmentPointers = fragmentArrays.map((fragment, i) => {
      const ptr = module._malloc(fragment.length);
      if (ptr === 0) throw new Error(`Fallo al asignar memoria para fragment ${i}`);
      module.HEAPU8.set(fragment, ptr);
      return ptr;
    });
    const fragmentPtrArray = module._malloc(fragmentPointers.length * 4);
    if (fragmentPtrArray === 0) throw new Error('Fallo al asignar memoria para fragmentPtrArray');
    new Uint32Array(module.HEAPU32.buffer, fragmentPtrArray, fragmentPointers.length)
      .set(fragmentPointers);

    const lengthPtr = module._malloc(fragmentLengths.length * 4);
    if (lengthPtr === 0) throw new Error('Fallo al asignar memoria para lengthPtr');
    new Int32Array(module.HEAP32.buffer, lengthPtr, fragmentLengths.length)
      .set(fragmentLengths);

    const keyPtr = module._malloc(keyArray.length);
    if (keyPtr === 0) throw new Error('Fallo al asignar memoria para keyPtr');
    module.HEAPU8.set(keyArray, keyPtr);

    const outputLengthPtr = module._malloc(4);
    if (outputLengthPtr === 0) throw new Error('Fallo al asignar memoria para outputLengthPtr');

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

    const reconstructedData = new Uint8Array(module.HEAPU8.subarray(resultPtr, resultPtr + outputLength));
    const reconstructedBuffer = reconstructedData.buffer;

    fragmentPointers.forEach(ptr => module._free(ptr));
    module._free(fragmentPtrArray);
    module._free(lengthPtr);
    module._free(keyPtr);
    module._free(outputLengthPtr);
    module.ccall('free_model', null, ['number'], [resultPtr]);
    return reconstructedBuffer;
  } catch (error) {
    console.error('Error al reconstruir el modelo:', error);
    throw error;
  }
}

export async function fetchDetections(imagesArray, progressCallback) {
  try {
    if (!imagesArray || !Array.isArray(imagesArray) || imagesArray.length === 0) {
      throw new Error('Se requiere un array de imágenes no vacío');
    }

    const globesModel = await getModel('globes');
    const textModel = await getModel('text');
    if (!globesModel || !textModel) {
      throw new Error('No se encontraron los modelos globes o text en IndexedDB');
    }

    const modelsArrayBuffer = [];
    for (const model of [globesModel, textModel]) {
      const { modelData } = model;
      if (modelData.isFragmented) {
        const reconstructedBuffer = await reconstructModel(modelData);
        modelsArrayBuffer.push(reconstructedBuffer);
      } else {
        modelsArrayBuffer.push(modelData.data);
      }
    }

    console.log(modelsArrayBuffer);
    const results = await detectObjects(
      imagesArray,
      modelsArrayBuffer,
      progressCallback,
      [576, 832]
    );

    return results;
  } catch (error) {
    console.error('Error en fetchDetections:', error);
    throw error;
  }
}