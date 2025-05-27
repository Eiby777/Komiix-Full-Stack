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

