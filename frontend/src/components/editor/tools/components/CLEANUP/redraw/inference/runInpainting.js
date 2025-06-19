import * as ort from "onnxruntime-web";
import { decodeBase64Image } from "./imageUtils";
import { initializeSession, preprocessImage, preprocessMask, postprocessOutput } from "./modelUtils";

ort.env.wasm.wasmPaths = "/node_modules/onnxruntime-web/dist/";

async function runInpainting(imagesArray, modelArrayBuffer, progressCallback) {
  if (!Array.isArray(imagesArray) || imagesArray.length === 0) {
    throw new Error("imagesArray must be a non-empty array");
  }

  const results = [];
  let session = null;

  try {
    // Inicializar el modelo
    if (progressCallback) {
      progressCallback({ message: "Inicializando modelo...", initialized: false });
    }
    
    session = await initializeSession(modelArrayBuffer, progressCallback);
    
    if (progressCallback) {
      progressCallback({ message: "Procesando imágenes...", initialized: true });
    }

    // Procesar cada imagen
    for (let i = 0; i < imagesArray.length; i++) {
      const { image, mask, filename } = imagesArray[i];
      
      if (!image || !filename) {
        throw new Error("Cada objeto debe tener propiedades 'image' y 'filename'");
      }

      // Decodificar imágenes base64
      const imageObj = await decodeBase64Image(image);
      const maskObj = await decodeBase64Image(mask);

      // Obtener dimensiones originales
      const width = imageObj.width;
      const height = imageObj.height;

      // Crear canvas para la imagen
      const imageCanvas = document.createElement('canvas');
      imageCanvas.width = width;
      imageCanvas.height = height;
      const imageCtx = imageCanvas.getContext('2d');
      imageCtx.drawImage(imageObj, 0, 0);
      const imageData = imageCtx.getImageData(0, 0, width, height);

      // Crear canvas para la máscara
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = width;
      maskCanvas.height = height;
      const maskCtx = maskCanvas.getContext('2d');
      maskCtx.drawImage(maskObj, 0, 0);
      const maskData = maskCtx.getImageData(0, 0, width, height);

      // Preprocesar imagen y máscara
      const imageTensorData = preprocessImage({ data: imageData.data, width, height }, width, height);
      const maskTensorData = preprocessMask({ data: maskData.data, width, height }, width, height);

      // Preparar entradas del modelo
      const inputs = {
        [session.inputNames[0]]: new ort.Tensor("uint8", imageTensorData, [1, 3, height, width]),
        [session.inputNames[1]]: new ort.Tensor("uint8", maskTensorData, [1, 1, height, width]),
      };

      // Ejecutar inferencia
      const outputs = await session.run(inputs);
      const outputTensor = outputs[session.outputNames[0]];

      // Procesar la salida
      const resultData = postprocessOutput(outputTensor, imageTensorData, maskTensorData, width, height);

      // Crear imagen de resultado
      const resultCanvas = document.createElement("canvas");
      resultCanvas.width = width;
      resultCanvas.height = height;
      const ctx = resultCanvas.getContext("2d");
      const resultImageData = new ImageData(new Uint8ClampedArray(resultData), width, height);
      ctx.putImageData(resultImageData, 0, 0);

      results.push({
        filename,
        output: resultCanvas.toDataURL("image/png")
      });

      if (progressCallback) {
        progressCallback({
          filename,
          completedImages: i + 1,
          totalImages: imagesArray.length,
          percentage: Math.round(((i + 1) / imagesArray.length) * 100),
        });
      }
    }
    console.log("Results:", results);

    return results;
  } finally {
    try {
      if (session) {
        // session.release(); // Descomentar si es necesario
      }
    } catch (error) {
      console.error("Error durante la limpieza de recursos:", error);
    }
  }
}

export default runInpainting;