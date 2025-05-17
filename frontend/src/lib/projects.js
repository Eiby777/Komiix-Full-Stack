
import getBanner from "../hooks/createProjectBanner";

export async function convertFileArrayToBufferArray(fileArray) {
  return Promise.all(
    fileArray.map(async (file) => {
      const buffer = await file.arrayBuffer();
      return buffer;
    })
  );
}

export async function convertFileArrayToBufferArrayObject(fileArray) {
  return Promise.all(
    fileArray.map(async (file, index) => {
      const buffer = await file.arrayBuffer();
      return { image: buffer, index };
    })
  );
}

export async function convertToBanner(files) {
  const ArrayBuffer = await convertFileArrayToBufferArray(files);
  
  const bannerImageArrayBuffer = await getBanner(ArrayBuffer);
  return bannerImageArrayBuffer
}

export async function convertToWebpLossless(input) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    let inputName = "image";

    // Helper function to process File input
    function processFile(fileInput) {
      inputName = fileInput.name;
      if (!fileInput.type.startsWith("image/")) {
        console.warn("File type may not be image:", fileInput.type);
      }
      return URL.createObjectURL(fileInput);
    }

    // Helper function to process Buffer/ArrayBuffer input
    function processBuffer(bufferInput) {
      let blob;
      if (bufferInput instanceof Uint8Array) {
        blob = new Blob([bufferInput], { type: "image/*" });
      } else if (typeof Buffer !== "undefined" && Buffer.isBuffer(bufferInput)) {
        blob = new Blob([bufferInput], { type: "image/*" });
      } else {
        blob = new Blob([new Uint8Array(bufferInput)], { type: "image/*" });
      }
      return URL.createObjectURL(blob);
    }

    // Helper function to process object URL
    function processObjectUrl(urlInput) {
      if (typeof urlInput !== "string" || !urlInput.startsWith("blob:")) {
        throw new Error("Invalid object URL");
      }
      return urlInput;
    }

    // Helper function to process image conversion
    function processImageConversion() {
      if (img.src.startsWith("blob:")) {
        URL.revokeObjectURL(img.src);
      }
      
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error("WebP lossless conversion failed");
            return reject(new Error("Conversion failed"));
          }

          const webpFile = new File([blob], `${inputName.split(".")[0]}.webp`, {
            type: "image/webp",
          });

          resolve(webpFile);
        },
        "image/webp",
        { lossless: true } // Especifica modo sin pérdida
      );
    }

    // Handle different input types
    try {
      if (input instanceof File || (input?.name && input?.type && input?.size)) {
        img.src = processFile(input);
      } else if (
        input instanceof ArrayBuffer ||
        input instanceof Uint8Array ||
        (typeof Buffer !== "undefined" && Buffer.isBuffer(input))
      ) {
        img.src = processBuffer(input);
      } else if (typeof input === "string" && input.startsWith("blob:")) {
        img.src = processObjectUrl(input);
      } else {
        console.error("Invalid input type:", input);
        return reject(
          new Error("Invalid input: Must be File, Buffer/ArrayBuffer, or object URL")
        );
      }
    } catch (error) {
      return reject(error);
    }

    // Image event handlers
    img.onload = processImageConversion;

    img.onerror = (error) => {
      console.error("Error loading image:", error);
      if (img.src.startsWith("blob:")) {
        URL.revokeObjectURL(img.src);
      }
      reject(new Error(`Failed to load image: ${error.message || error}`));
    };
  });
}
