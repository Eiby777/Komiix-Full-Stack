/**
    Valida si una cadena es una imagen base64 válida
    @param {string} base64String - Cadena base64 a validar
    @returns {boolean} - True si es una imagen base64 válida, false en caso contrario
*/
const isValidBase64Image = (base64String) => {
    if (typeof base64String !== "string" || !base64String.startsWith("data:image/")) {
        return false;
    }
    try {
        const img = new Image();
        img.src = base64String;
        return true;
    } catch (error) {
        return false;
    }
};

/**
    Convierte un canvas a imagen binaria (blanco y negro) aplicando un umbral fijo
    @param {HTMLCanvasElement} canvas - Canvas a binarizar
    @returns {HTMLCanvasElement} - Canvas binarizado (copia del original)
*/
export const binarizeCanvas = (canvas) => {
    // Crear una copia del canvas original
    const copyCanvas = document.createElement("canvas");
    copyCanvas.width = canvas.width;
    copyCanvas.height = canvas.height;
    const copyCtx = copyCanvas.getContext("2d");
    copyCtx.drawImage(canvas, 0, 0);

    const ctx = copyCanvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, copyCanvas.width, copyCanvas.height);
    const data = imageData.data;

    // Umbral fijo (ajústalo según tus imágenes, entre 0 y 255)
    const threshold = 128;

    for (let i = 0; i < data.length; i += 4) {
        // Convertir a escala de grises usando la fórmula de luminancia
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        // Aplicar umbral: blanco (255) o negro (0)
        const value = gray > threshold ? 255 : 0;
        data[i] = value;     // Rojo
        data[i + 1] = value; // Verde
        data[i + 2] = value; // Azul
        // El canal alfa (data[i + 3]) se mantiene intacto
    }

    ctx.putImageData(imageData, 0, 0);
    return copyCanvas;
};

/**
    Escala una imagen manteniendo su relación de aspecto
    @param {HTMLCanvasElement} canvas - Canvas con la imagen original
    @param {number} scaleFactor - Factor de escalado (ej. 2 para duplicar tamaño)
    @returns {string} - Imagen escalada en formato base64
    @throws {Error} - Si la imagen base64 generada no es válida
*/
export const upscaleImage = (canvas, scaleFactor) => {
    const newCanvas = document.createElement("canvas");
    const ctx = newCanvas.getContext("2d");
    newCanvas.width = canvas.width * scaleFactor;
    newCanvas.height = canvas.height * scaleFactor;

    // Habilitar suavizado para interpolación bicúbica
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high'; // Opciones: 'low', 'medium', 'high'

    ctx.drawImage(canvas, 0, 0, newCanvas.width, newCanvas.height);

    const base64Image = newCanvas.toDataURL("image/png");
    if (!isValidBase64Image(base64Image)) {
        throw new Error("Imagen base64 generada no es válida después del upscaling");
    }
    return base64Image;
};

/**
    Escala un array de imágenes recortadas aplicando binarización para una versión y manteniendo la original para otra,
    y retorna los factores de escala usados.
    @param {Array<Array<Object>>} croppedImages - Array de arrays de objetos con imágenes
    @returns {Object} - Objeto con las imágenes escaladas (binarizadas y originales)
    @returns {Array<Array<Object>>} return.ocrImages - Array de arrays con imágenes binarizadas escaladas
    @returns {Array<Array<Object>>} return.originalImages - Array de arrays con imágenes originales escaladas
*/
export const upscaleCroppedImages = (croppedImages) => {
    const ocrImages = [];
    const originalImages = [];

    croppedImages.forEach((canvasImages) => {
        if (!canvasImages.length) {
            ocrImages.push([]);
            originalImages.push([]);
            return;
        }

        const ocrGroup = [];
        const originalGroup = [];

        canvasImages.forEach((imageData) => {
            const {ocrCanvas, ...rest } = imageData;
            try {
                ocrGroup.push({
                    ...rest,
                    canvas: ocrCanvas,
                    image: ocrCanvas.toDataURL("image/png"),
                });

                originalGroup.push({ocrCanvas, ...rest});
            } catch (error) {
                console.error(`Error al hacer upscaling de la imagen ${imageData.id}:`, error);
                ocrGroup.push({
                    ...rest,
                    canvas: ocrCanvas,
                    image: ocrCanvas.toDataURL("image/png"),
                });
                originalGroup.push({ocrCanvas, ...rest});
            }
        });

        ocrImages.push(ocrGroup);
        originalImages.push(originalGroup);
    });

    return {
        ocrImages,
        originalImages,
    };
};

