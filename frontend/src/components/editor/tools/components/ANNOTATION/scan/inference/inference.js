// utils/lazyONNX.js
let onnxRuntime = null;

export const loadONNXRuntime = async () => {
  if (onnxRuntime) return onnxRuntime;
  
  try {
    // Dynamic import solo cuando se necesite
    onnxRuntime = await import('onnxruntime-web');
    
    // Configuración optimizada para producción
    onnxRuntime.env.wasm.wasmPaths = "/assets/";
    onnxRuntime.env.wasm.numThreads = Math.min(navigator.hardwareConcurrency || 4, 4);
    onnxRuntime.env.wasm.simd = true;
    
    return onnxRuntime;
  } catch (error) {
    console.error('Error loading ONNX Runtime:', error);
    throw error;
  }
};

// detectObjects.js optimizado
async function decodeBase64Image(
  base64String,
  targetWidth = 576,
  targetHeight = 832
) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
      resolve({
        data: imageData.data,
        width: targetWidth,
        height: targetHeight,
      });
    };
    img.onerror = reject;
    img.src = `data:image/webp;base64,${base64String}`;
  });
}

// Worker optimizado que carga ONNX dinámicamente
const createOptimizedWorkerCode = () => `
  let onnxRuntime = null;
  
  async function loadONNX() {
    if (onnxRuntime) return onnxRuntime;
    
    // Cargar desde CDN con versión específica
    importScripts("https://cdn.jsdelivr.net/npm/onnxruntime-web@1.21.0/dist/ort.min.js");
    
    // Configuración optimizada
    ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.21.0/dist/";
    ort.env.wasm.numThreads = Math.min(self.navigator?.hardwareConcurrency || 2, 2);
    ort.env.wasm.simd = true;
    
    onnxRuntime = ort;
    return onnxRuntime;
  }

  async function initializeSession(modelArrayBuffer) {
    const ort = await loadONNX();
    const modelData = new Uint8Array(modelArrayBuffer);
    
    // Configuración optimizada para el session
    const sessionOptions = {
      executionProviders: ["wasm"],
      enableMemPattern: false,
      enableCpuMemArena: false,
      extra: {
        session: {
          use_device_allocator_for_initializers: 1,
          use_ort_model_bytes_directly: 1,
          use_ort_model_bytes_for_initializers: 1
        }
      }
    };
    
    return await ort.InferenceSession.create(modelData, sessionOptions);
  }

  // Cache de sesiones para evitar reinicializar
  const sessionCache = new Map();
  
  async function getCachedSession(modelArrayBuffer, modelKey) {
    if (sessionCache.has(modelKey)) {
      return sessionCache.get(modelKey);
    }
    
    const session = await initializeSession(modelArrayBuffer);
    sessionCache.set(modelKey, session);
    return session;
  }

  function preprocessImage(imageBuffer, targetWidth, targetHeight) {
    const { data } = imageBuffer;
    const floatData = new Float32Array(3 * targetHeight * targetWidth);
    
    // Optimización: procesamiento por lotes
    const pixelCount = targetHeight * targetWidth;
    for (let i = 0; i < pixelCount; i++) {
      const offset = i * 4;
      floatData[i] = data[offset + 2] / 255.0; // B
      floatData[pixelCount + i] = data[offset + 1] / 255.0; // G
      floatData[2 * pixelCount + i] = data[offset] / 255.0; // R
    }
    return floatData;
  }

  function postprocess(boxes, scores, inputWidth, inputHeight) {
    const confThresh = 0.5;
    const detections = [];
    const numBoxes = boxes.length / 4;
    const numClasses = scores.length / numBoxes;

    for (let i = 0; i < numBoxes; i++) {
      const scoreOffset = i * numClasses;
      const classScores = Array.from(scores.slice(scoreOffset, scoreOffset + numClasses));
      const maxScore = Math.max(...classScores);
      const classId = classScores.indexOf(maxScore);

      if (maxScore < confThresh) continue;

      const boxOffset = i * 4;
      const x1 = boxes[boxOffset] * inputWidth;
      const y1 = boxes[boxOffset + 1] * inputHeight;
      const x2 = boxes[boxOffset + 2] * inputWidth;
      const y2 = boxes[boxOffset + 3] * inputHeight;

      detections.push([x1, y1, x2, y2, maxScore, classId]);
    }
    return detections;
  }

  function nms(detections, iouThresh = 0.45) {
    if (!detections.length) return [];
    let order = detections.map((d, i) => [d[4], i]).sort((a, b) => b[0] - a[0]).map(d => d[1]);
    const keep = [];
    while (order.length > 0) {
      const i = order[0];
      keep.push(detections[i]);
      const ious = order.slice(1).map(j => computeIoU(detections[i], detections[j]));
      order = order.slice(1).filter((_, idx) => ious[idx] <= iouThresh);
    }
    return keep;
  }

  function computeIoU(box1, box2) {
    const x1 = Math.max(box1[0], box2[0]);
    const y1 = Math.max(box1[1], box2[1]);
    const x2 = Math.min(box1[2], box2[2]);
    const y2 = Math.min(box1[3], box2[3]);
    const inter = Math.max(x2 - x1, 0) * Math.max(y2 - y1, 0);
    const area1 = (box1[2] - box1[0]) * (box1[3] - box1[1]);
    const area2 = (box2[2] - box2[0]) * (box2[3] - box2[1]);
    return inter / (area1 + area2 - inter + 1e-6);
  }

  function convertToYoloFormat(detections, imageWidth, imageHeight) {
    return detections.map(det => {
      const [x1, y1, x2, y2, conf, clsId] = det;
      const xCenter = (x1 + x2) / 2 / imageWidth;
      const yCenter = (y1 + y2) / 2 / imageHeight;
      const width = (x2 - x1) / imageWidth;
      const height = (y2 - y1) / imageHeight;
      return { class: clsId, confidence: conf, bbox: [xCenter, yCenter, width, height] };
    });
  }

  self.onmessage = async (e) => {
    const { modelArrayBuffer, images, inputWidth, inputHeight, totalImages, startIndex, workerId, modelKey } = e.data;
    try {
      // Usar cache de sesiones
      const session = await getCachedSession(modelArrayBuffer, modelKey);
      const results = [];
      const imagesToProcess = images.length;

      for (let i = 0; i < imagesToProcess; i++) {
        const { imageBuffer, filename, originalWidth, originalHeight } = images[i];
        const processedImage = preprocessImage(imageBuffer, inputWidth, inputHeight);
        
        // Crear tensor con configuración optimizada
        const ort = await loadONNX();
        const inputTensor = new ort.Tensor("float32", processedImage, [1, 3, inputHeight, inputWidth]);
        const feeds = { input: inputTensor };
        
        // Ejecutar inferencia
        const output = await session.run(feeds);

        const outputKeys = Object.keys(output);
        const boxes = output[outputKeys[0]];
        const scores = output[outputKeys[1]];

        let detections = postprocess(boxes.data, scores.data, inputWidth, inputHeight);
        detections = nms(detections);

        if (detections.length > 0) {
          const scaleX = originalWidth / inputWidth;
          const scaleY = originalHeight / inputHeight;
          detections = detections.map(det => {
            det[0] *= scaleX;
            det[1] *= scaleY;
            det[2] *= scaleX;
            det[3] *= scaleY;
            return det;
          });
        }

        const yoloDetections = convertToYoloFormat(detections, originalWidth, originalHeight);
        results.push({ filename, detections: yoloDetections });

        const globalCompleted = startIndex + i + 1;
        self.postMessage({
          type: "progress",
          data: { filename, completed: globalCompleted, total: totalImages, workerId },
        });
      }

      self.postMessage({ type: "results", data: results });
    } catch (error) {
      self.postMessage({ type: "error", data: error.message });
    }
  };
`;

async function detectObjects(
  imagesArray,
  modelsArrayBuffer,
  progressCallback,
  inputSize = [576, 832]
) {
  try {
    if (!Array.isArray(imagesArray) || imagesArray.length === 0) {
      throw new Error("imagesArray must be a non-empty array");
    }

    const [inputWidth, inputHeight] = inputSize;
    const resultsByModel = { globes: [], text: [] };

    // Crear worker optimizado
    const workerCode = createOptimizedWorkerCode();
    const blob = new Blob([workerCode], { type: "application/javascript" });
    const workerUrl = URL.createObjectURL(blob);

    // Procesar imágenes
    const imageBuffers = await Promise.all(
      imagesArray.map(async (imageData) => {
        if (!imageData.image_buffer || !imageData.filename) {
          throw new Error("Each imageData must have image_buffer and filename");
        }
        const { image_buffer: base64String, filename } = imageData;
        const buffer = await decodeBase64Image(
          base64String,
          inputWidth,
          inputHeight
        );
        return {
          imageBuffer: buffer,
          filename,
          originalWidth: buffer.width,
          originalHeight: buffer.height,
        };
      })
    );

    const totalImages = imageBuffers.length;
    const midPoint = Math.ceil(imageBuffers.length / 2);
    const imagesForWorker1 = imageBuffers.slice(0, midPoint);
    const imagesForWorker2 = imageBuffers.slice(midPoint);

    const createWorkerPromise = (images, modelArrayBuffer, startIndex, workerId, modelKey) => {
      return new Promise((resolve, reject) => {
        const worker = new Worker(workerUrl);
        
        // Timeout para evitar workers colgados
        const timeout = setTimeout(() => {
          worker.terminate();
          reject(new Error(`Worker ${workerId} timeout`));
        }, 300000); // 5 minutos

        worker.onmessage = (e) => {
          switch (e.data.type) {
            case "progress":
              if (progressCallback) progressCallback(e.data.data);
              break;
            case "results":
              clearTimeout(timeout);
              resolve(e.data.data);
              worker.terminate();
              break;
            case "error":
              clearTimeout(timeout);
              reject(new Error(e.data.data));
              worker.terminate();
              break;
          }
        };
        
        worker.onerror = (error) => {
          clearTimeout(timeout);
          reject(error);
          worker.terminate();
        };

        worker.postMessage({
          modelArrayBuffer,
          images,
          inputWidth,
          inputHeight,
          totalImages,
          startIndex,
          workerId,
          modelKey // Para cache de sesiones
        });
      });
    };

    const [globesModel, textModel] = modelsArrayBuffer;
    
    // Ejecutar workers con cache keys
    const allWorkerPromises = [
      createWorkerPromise(imagesForWorker1, globesModel, 0, "globes1", "globes_model"),
      createWorkerPromise(imagesForWorker2, globesModel, midPoint, "globes2", "globes_model"),
      createWorkerPromise(imagesForWorker1, textModel, 0, "text1", "text_model"),
      createWorkerPromise(imagesForWorker2, textModel, midPoint, "text2", "text_model"),
    ];

    const [globesResults1, globesResults2, textResults1, textResults2] = await Promise.all(allWorkerPromises);
    
    resultsByModel.globes = [...globesResults1, ...globesResults2];
    resultsByModel.text = [...textResults1, ...textResults2];

    // Limpiar
    URL.revokeObjectURL(workerUrl);

    return resultsByModel;
  } catch (error) {
    console.error("Error in detection:", error);
    throw error;
  }
}

export default detectObjects;