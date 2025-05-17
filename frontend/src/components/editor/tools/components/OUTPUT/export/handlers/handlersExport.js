import JSZip from 'jszip';
import pako from 'pako';
import handleAddText from './createFabricObjects';
import { loadAndCleanImage } from '../../../../handlers/loadAndCleanImage';

/**
 * Converts a canvas to a blob with specified format and quality.
 * @param {HTMLCanvasElement} canvas - The canvas to convert.
 * @param {string} format - Image format (JPEG, PNG, WEBP).
 * @param {number} quality - Quality (0-100, ignored for PNG).
 * @param {boolean} interlacing - Enable interlacing for PNG.
 * @returns {Promise<Blob>} The resulting blob.
 */
const canvasToBlob = async (canvas, format, quality, interlacing) => {
  return new Promise((resolve) => {
    const mimeType = `image/${format.toLowerCase()}`;
    const exportQuality = format === 'PNG' ? 1 : quality / 100;

    if (format === 'PNG' && interlacing) {
      // Convert canvas to PNG binary and compress with pako
      const dataUrl = canvas.toDataURL(mimeType, exportQuality);
      const binary = atob(dataUrl.split(',')[1]);
      const array = new Uint8Array(binary.length).map((_, i) => binary.charCodeAt(i));
      const compressed = pako.deflate(array, { level: 9 });
      resolve(new Blob([compressed], { type: mimeType }));
    } else {
      canvas.toBlob(resolve, mimeType, exportQuality);
    }
  });
};

/**
 * Applies image mode transformations (e.g., Grayscale).
 * @param {HTMLCanvasElement} canvas - The canvas to transform.
 * @param {string} imageMode - The image mode (RGB, Grayscale).
 * @returns {Promise<HTMLCanvasElement>} The transformed canvas.
 */
const applyImageMode = async (canvas, imageMode) => {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  if (imageMode === 'Grayscale') {
    ctx.filter = 'grayscale(100%)';
    const imageData = ctx.getImageData(0, 0, width, height);
    ctx.putImageData(imageData, 0, 0);
    ctx.filter = 'none';
  }

  return canvas;
};

/**
 * Handles metadata inclusion or stripping.
 * @param {Blob} blob - The image blob.
 * @param {boolean} includeMetadata - Whether to include metadata.
 * @returns {Promise<Blob>} The processed blob.
 */
const handleMetadata = async (blob, includeMetadata) => {
  if (includeMetadata) {
    return blob; // Keep metadata as is
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(blob);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0);
      canvas.toBlob(
        (newBlob) => {
          URL.revokeObjectURL(img.src);
          canvas.remove();
          resolve(newBlob);
        },
        blob.type,
        1
      );
    };
  });
};

/**
 * Resizes an image based on provided dimensions and aspect ratio settings.
 * @param {HTMLImageElement} img - The image to resize.
 * @param {{ width: number, height: number }} dimensions - Target dimensions.
 * @param {boolean} maintainAspectRatio - Whether to maintain aspect ratio.
 * @param {boolean} shouldResize - Whether resizing is required.
 * @returns {{ width: number, height: number, canvas: HTMLCanvasElement }} Resized canvas and dimensions.
 */
const resizeImage = (img, dimensions, maintainAspectRatio, shouldResize) => {
  const canvas = document.createElement('canvas');
  let { width, height } = dimensions;

  if (!shouldResize || !width || !height) {
    width = img.width;
    height = img.height;
  } else if (maintainAspectRatio) {
    const ratio = Math.min(width / img.width, height / img.height);
    width = Math.round(img.width * ratio);
    height = Math.round(img.height * ratio);
  } else {
    // For exact dimensions without aspect ratio
    width = Math.round(width);
    height = Math.round(height);
  }

  // Ensure canvas uses exact integer dimensions
  canvas.width = Math.round(width);
  canvas.height = Math.round(height);

  // Draw image with precise dimensions
  canvas.getContext('2d').drawImage(
    img,
    0, 0, img.width, img.height,  // source dimensions
    0, 0, width, height           // destination dimensions
  );

  return { width, height, canvas };
};

/**
 * Exports a single image with specified settings.
 * @param {string} base64Image - Base64-encoded image.
 * @param {Object} options - Export options.
 * @param {string} options.format - Image format.
 * @param {number} options.quality - Image quality.
 * @param {{ width: number, height: number }} options.dimensions - Target dimensions.
 * @param {boolean} options.maintainAspectRatio - Maintain aspect ratio.
 * @param {string} options.imageMode - Image mode.
 * @param {boolean} options.includeMetadata - Include metadata.
 * @param {boolean} options.interlacing - Enable interlacing.
 * @param {string} options.fileName - File name.
 * @returns {Promise<void>}
 */
const exportSingleImage = async ({
  base64Image,
  format,
  quality,
  dimensions,
  maintainAspectRatio,
  imageMode,
  includeMetadata,
  interlacing,
  fileName,
}) => {
  const img = new Image();
  img.src = base64Image;

  await new Promise((resolve) => {
    img.onload = async () => {
      const { canvas } = resizeImage(img, dimensions, maintainAspectRatio, true);
      await applyImageMode(canvas, imageMode);

      let blob = await canvasToBlob(canvas, format, quality, interlacing);
      blob = await handleMetadata(blob, includeMetadata);

      const finalFileName = `${fileName}.${format.toLowerCase()}`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = finalFileName;
      a.click();
      URL.revokeObjectURL(url);
      canvas.remove();
      resolve();
    };
  });
};

/**
 * Exporta múltiples imágenes como un archivo ZIP.
 * @param {string[]} base64Images - Array de imágenes codificadas en base64.
 * @param {Object} options - Opciones de exportación.
 * @param {string} options.format - Formato de la imagen.
 * @param {number} options.quality - Calidad de la imagen.
 * @param {{ width: number, height: number }} options.dimensions - Dimensiones objetivo.
 * @param {boolean} options.maintainAspectRatio - Mantener la relaci n de aspecto.
 * @param {string} options.imageMode - Modo de im gen.
 * @param {boolean} options.includeMetadata - Incluir metadatos.
 * @param {boolean} options.interlacing - Habilitar entrelazado.
 * @param {string} options.fileName - Prefijo de nombre de archivo.
 * @param {boolean} options.resizeAll - Redimensionar todas las im genes.
 * @returns {Promise<void>}
 */
const exportMultipleImages = async ({
  base64Images,
  format,
  quality,
  dimensions,
  maintainAspectRatio,
  imageMode,
  includeMetadata,
  interlacing,
  fileName,
  resizeAll,
}) => {
  const zip = new JSZip();

  for (let index = 0; index < base64Images.length; index++) {
    const img = new Image();
    img.src = base64Images[index];

    await new Promise((resolve) => {
      img.onload = async () => {
        const shouldResize = resizeAll && dimensions.width && dimensions.height;
        const { canvas } = resizeImage(img, dimensions, maintainAspectRatio, shouldResize);
        await applyImageMode(canvas, imageMode);

        let blob = await canvasToBlob(canvas, format, quality, interlacing);
        blob = await handleMetadata(blob, includeMetadata);

        const finalFileName = `${fileName}_${index + 1}.${format.toLowerCase()}`;
        zip.file(finalFileName, blob);
        canvas.remove();
        resolve();
      };
    });
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.zip`;
  a.click();
  URL.revokeObjectURL(url);
};

/**
   * Main export handler.
   * @returns {Promise<void>}
   */
const handleExport = async (
  setIsLoading,
  exportAll,
  canvasInstances,
  activeImageIndex,
  images,
  format,
  quality,
  dimensions,
  maintainAspectRatio,
  imageMode,
  includeMetadata,
  interlacing,
  fileName,
  resizeAll
) => {
  setIsLoading(true);
  const cleanImages = [];

  if (!exportAll) {
    const currentCanvasInstance = canvasInstances[activeImageIndex];
    const cleanImage = await loadAndCleanImage(currentCanvasInstance, images[activeImageIndex]);
    cleanImages.push(cleanImage);
  } else {
    for (let i = 0; i < canvasInstances.length; i++) {
      const cleanImage = await loadAndCleanImage(canvasInstances[i], images[i]);
      cleanImages.push(cleanImage);
    }
  }
  if (!cleanImages || cleanImages.length === 0) {
    console.warn('No se encontraron imágenes válidas para procesar');
    return;
  }

  const addText = await handleAddText(
    cleanImages,
    canvasInstances,
    activeImageIndex
  );

  const exportOptions = {
    format,
    quality,
    dimensions,
    maintainAspectRatio,
    imageMode,
    includeMetadata,
    interlacing,
    fileName,
    resizeAll,
  };

  if (!exportAll && addText.length === 1) {
    await exportSingleImage({ ...exportOptions, base64Image: addText[0] });
  } else {
    await exportMultipleImages({ ...exportOptions, base64Images: addText });
  }
  setIsLoading(false);
};

export default handleExport;
