import * as ort from "onnxruntime-web";
import { decodeBase64Image, resizeWithPadding, cropPatch } from "./imageUtils.js";
import { initializeSession, preprocessImage, preprocessMask, postprocessOutput } from "./modelUtils.js";
import { scalePositions, getDynamicPatches, combinePatches } from "./patchUtils.js";

ort.env.wasm.wasmPaths = "/node_modules/onnxruntime-web/dist/";

async function runInpainting(imagesArray, modelArrayBuffer, progressCallback, inputSize = [512, 512]) {
  if (!Array.isArray(imagesArray) || imagesArray.length === 0) throw new Error("imagesArray must be a non-empty array");

  const [inputWidth, inputHeight] = inputSize;
  const results = [];
  let totalPatchesProcessed = 0;
  let session = null;

  if (progressCallback) progressCallback({ message: "Preparando imágenes...", initialized: false });

  try {
    let totalPatches = 0;
    const preprocessedImages = [];

    // Preprocesamiento inicial y cálculo de parches
    for (const img of imagesArray) {
      if (!img.mask || !img.positions || img.positions.length === 0) continue;

      const imageObj = await decodeBase64Image(img.image);

      // Determinar tamaño objetivo dinámicamente
      let targetSize;
      if (imageObj.width > 1024 || imageObj.height > 1024) {
        targetSize = 1024;
      } else {
        targetSize = Math.max(imageObj.width, imageObj.height);
      }

      // Redimensionar con padding
      const resizedImage = await resizeWithPadding(imageObj, targetSize);
      const resizedMask = await resizeWithPadding(await decodeBase64Image(img.mask), targetSize);

      // Calcular parámetros de escalado
      const scaleX = resizedImage.scaleX;
      const scaleY = resizedImage.scaleY;
      const scaleParams = { scaleX, scaleY, xOffset: resizedImage.xOffset, yOffset: resizedImage.yOffset };

      // Escalar posiciones con compensación de padding
      const scaledPositions = scalePositions(
        img.positions,
        scaleX,
        scaleY,
        scaleParams.xOffset,
        scaleParams.yOffset
      );

      // Calcular número total de parches
      const patches = getDynamicPatches(scaledPositions, targetSize, targetSize, inputWidth);
      totalPatches += patches.length;

      preprocessedImages.push({
        ...img,
        imageObj,
        resizedImage,
        resizedMask,
        scaledPositions,
        targetSize,
        scaleParams,
      });
    }

    // Inicializar modelo
    if (progressCallback) progressCallback({ message: "Inicializando modelo...", initialized: false });
    session = await initializeSession(modelArrayBuffer, progressCallback);
    if (progressCallback) progressCallback({ message: "Realizando inferencia...", initialized: true });

    // Procesar cada imagen
    for (let i = 0; i < preprocessedImages.length; i++) {
      const {
        image,
        mask,
        filename,
        imageObj,
        resizedImage,
        resizedMask,
        scaledPositions,
        targetSize,
        scaleParams,
      } = preprocessedImages[i];

      if (!image || !filename) throw new Error("Each object must have image and filename properties");

      const patches = getDynamicPatches(scaledPositions, targetSize, targetSize, inputWidth);
      const patchResults = [];

      for (let j = 0; j < patches.length; j++) {
        const patch = patches[j];
        const { imageBuffer, maskBuffer } = await cropPatch(
          resizedImage,
          resizedMask,
          patch.bounds,
          inputWidth
        );

        const imageTensorData = preprocessImage(imageBuffer, inputWidth, inputHeight);
        const maskTensorData = preprocessMask(maskBuffer, inputWidth, inputHeight);
        
        function getMinMax(array) {
          let min = array[0];
          let max = array[0];
          for (let i = 1; i < array.length; i++) {
            min = Math.min(min, array[i]);
            max = Math.max(max, array[i]);
          }
          return [min, max];
        }

        const inputs = {
          [session.inputNames[0]]: new ort.Tensor("uint8", imageTensorData, [1, 3, inputHeight, inputWidth]),
          [session.inputNames[1]]: new ort.Tensor("uint8", maskTensorData, [1, 1, inputHeight, inputWidth]),
        };

        const outputs = await session.run(inputs);
        const outputTensor = outputs[session.outputNames[0]];

        patchResults.push({
          resultData: postprocessOutput(outputTensor, imageTensorData, maskTensorData, inputWidth, inputHeight),
          bounds: patch.bounds,
        });
        totalPatchesProcessed++;

        if (progressCallback) progressCallback({
          filename,
          completedImages: i,
          completedPatches: totalPatchesProcessed,
          totalPatches,
          percentage: Math.round((totalPatchesProcessed / totalPatches) * 100),
        });
      }

      results.push({
        filename,
        output: await combinePatches(
          patchResults,
          imageObj.width,
          imageObj.height,
          image,
          scaleParams.scaleX,
          scaleParams.scaleY,
          scaleParams.xOffset,
          scaleParams.yOffset
        ),
      });
    }

    return results;
  } finally {
    try {
      //if (session) await session.release();
    } catch (error) {
      console.error("Error durante la liberación de recursos:", error);
    }
  }
}

export default runInpainting;