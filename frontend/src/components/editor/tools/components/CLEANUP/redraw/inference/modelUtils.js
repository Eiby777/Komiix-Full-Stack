// modelUtils.js
export function initializeSession(modelArrayBuffer, progressCallback) {
  const workerCode = `
    importScripts("https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/ort.min.js");
    ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/";

    let session = null;
    let inputNames = null;
    let outputNames = null;

    async function initialize(modelArrayBuffer) {
      const modelData = new Uint8Array(modelArrayBuffer);
      session = await ort.InferenceSession.create(modelData, {
        executionProviders: ["wasm"],
      });
      inputNames = session.inputNames;
      outputNames = session.outputNames;
      return { inputNames, outputNames };
    }

    async function run(inputs) {
      if (!session) throw new Error("Session not initialized");
      const feeds = {};
      for (const [name, tensor] of Object.entries(inputs)) {
        const data = tensor.type === "uint8" ? new Uint8Array(tensor.data) : tensor.data;
        feeds[name] = new ort.Tensor(tensor.type, data, tensor.dims);
      }
      const outputs = await session.run(feeds);
      const outputTensor = outputs[outputNames[0]];
      return {
        data: outputTensor.type === "float32" ? Array.from(outputTensor.data) : outputTensor.data,
        dims: outputTensor.dims,
        type: outputTensor.type,
      };
    }

    self.onmessage = async (e) => {
      try {
        const { type, data } = e.data;
        switch (type) {
          case "initialize":
            const { inputNames, outputNames } = await initialize(data.modelArrayBuffer);
            self.postMessage({
              type: "initialized",
              data: { inputNames, outputNames },
            });
            self.postMessage({
              type: "progress",
              data: { message: "Modelo inicializado", initialized: true },
            });
            break;
          case "run":
            const output = await run(data.inputs);
            self.postMessage({ type: "run_result", data: output });
            break;
          default:
            throw new Error("Unknown message type: " + type);
        }
      } catch (error) {
        self.postMessage({ type: "error", data: error.message });
      }
    };
  `;

  const blob = new Blob([workerCode], { type: "application/javascript" });
  const workerUrl = URL.createObjectURL(blob);
  const worker = new Worker(workerUrl);

  let inputNames = null;
  let outputNames = null;

  const initialized = new Promise((resolve, reject) => {
    worker.onmessage = (e) => {
      switch (e.data.type) {
        case "progress":
          if (progressCallback) progressCallback(e.data.data);
          break;
        case "initialized":
          inputNames = e.data.data.inputNames;
          outputNames = e.data.data.outputNames;
          resolve();
          break;
        case "error":
          reject(new Error(e.data.data));
          worker.terminate();
          URL.revokeObjectURL(workerUrl);
          break;
      }
    };
  });

  worker.postMessage({ type: "initialize", data: { modelArrayBuffer } }, [modelArrayBuffer]);

  const sessionInterface = {
    inputNames,
    outputNames,
    run: (inputs) => {
      return new Promise((resolve, reject) => {
        const handler = (e) => {
          switch (e.data.type) {
            case "run_result":
              resolve({
                [outputNames[0]]: {
                  data: e.data.data.type === "float32" ? new Float32Array(e.data.data.data) : new Uint8Array(e.data.data.data),
                  dims: e.data.data.dims,
                  type: e.data.data.type,
                },
              });
              worker.removeEventListener("message", handler);
              break;
            case "error":
              reject(new Error(e.data.data));
              worker.removeEventListener("message", handler);
              break;
          }
        };
        worker.addEventListener("message", handler);

        // Clonar entradas para evitar detaching
        const transferables = [];
        const serializedInputs = {};
        for (const [name, tensor] of Object.entries(inputs)) {
          const clonedData = tensor.data instanceof Uint8Array ? new Uint8Array(tensor.data) : tensor.data;
          serializedInputs[name] = {
            type: tensor.type,
            data: clonedData,
            dims: tensor.dims,
          };
          if (clonedData instanceof Uint8Array) {
            transferables.push(clonedData.buffer);
          }
        }

        worker.postMessage(
          { type: "run", data: { inputs: serializedInputs } },
          transferables
        );
      });
    },
  };

  return initialized.then(() => ({
    ...sessionInterface,
    inputNames,
    outputNames,
  }));
}

function getMinMax(array) {
  let min = array[0];
  let max = array[0];
  for (let i = 1; i < array.length; i++) {
    min = Math.min(min, array[i]);
    max = Math.max(max, array[i]);
  }
  return [min, max];
}

export function preprocessImage(imageBuffer, targetWidth, targetHeight) {
  if (!imageBuffer || typeof imageBuffer !== 'object') {
    console.error('Invalid imageBuffer:', imageBuffer);
    throw new Error('imageBuffer must be an object with data, width, and height properties');
  }
  const { data, width, height } = imageBuffer;
  if (!data || !width || !height) {
    console.error('Invalid imageBuffer properties:', { data: !!data, width, height });
    throw new Error('imageBuffer must have data, width, and height properties');
  }
  const uint8Data = new Uint8Array(3 * targetHeight * targetWidth);
  for (let i = 0; i < targetHeight * targetWidth; i++) {
    const offset = i * 4;
    uint8Data[i] = data[offset]; // R
    uint8Data[targetHeight * targetWidth + i] = data[offset + 1]; // G
    uint8Data[2 * targetHeight * targetWidth + i] = data[offset + 2]; // B
  }
  return uint8Data;
}

export function preprocessMask(maskBuffer, targetWidth, targetHeight) {
  const { data } = maskBuffer;
  const uint8Data = new Uint8Array(targetHeight * targetWidth);
  for (let i = 0; i < targetHeight * targetWidth; i++) {
    const value = data[i * 4]; 
    uint8Data[i] = value <= 128 ? 255 : 0; // Invertir lógica: 255 para texto negro, 0 para fondo blanco
  }
  return uint8Data;
}

export function postprocessOutput(outputTensor, inputImageData, maskData, width, height) {
  const outputData = outputTensor.data; // [1, 3, H, W]
  const inputData = inputImageData; // [3, H, W]
  const mask = maskData; // [H, W]

  const resultUint8 = new Uint8Array(width * height * 4); // RGBA

  const outputImage = new Uint8Array(width * height * 3);
  for (let i = 0; i < height * width; i++) {
    const r = outputTensor.type === "float32" ? Math.round(outputData[i] * 255) : outputData[i];
    const g = outputTensor.type === "float32" ? Math.round(outputData[height * width + i] * 255) : outputData[height * width + i];
    const b = outputTensor.type === "float32" ? Math.round(outputData[2 * height * width + i] * 255) : outputData[2 * height * width + i];
    outputImage[i * 3] = Math.min(Math.max(r, 0), 255); // R
    outputImage[i * 3 + 1] = Math.min(Math.max(g, 0), 255); // G
    outputImage[i * 3 + 2] = Math.min(Math.max(b, 0), 255); // B
  }

  const inputImage = new Uint8Array(width * height * 3);
  for (let i = 0; i < height * width; i++) {
    inputImage[i * 3] = inputData[i]; // R
    inputImage[i * 3 + 1] = inputData[height * width + i]; // G
    inputImage[i * 3 + 2] = inputData[2 * height * width + i]; // B
  }

  for (let i = 0; i < height * width; i++) {
    const maskValue = mask[i] / 255; 
    const r = (1 - maskValue) * outputImage[i * 3] + maskValue * inputImage[i * 3];
    const g = (1 - maskValue) * outputImage[i * 3 + 1] + maskValue * inputImage[i * 3 + 1];
    const b = (1 - maskValue) * outputImage[i * 3 + 2] + maskValue * inputImage[i * 3 + 2];

    resultUint8[i * 4] = Math.min(Math.max(Math.round(r), 0), 255);
    resultUint8[i * 4 + 1] = Math.min(Math.max(Math.round(g), 0), 255);
    resultUint8[i * 4 + 2] = Math.min(Math.max(Math.round(b), 0), 255);
    resultUint8[i * 4 + 3] = 255; 
  }

  return resultUint8;
}