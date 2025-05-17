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
    Calcula el factor de escala óptimo para una imagen, de modo que la altura estimada del texto
    esté en el rango ideal para Tesseract (30-50 píxeles).
    @param {HTMLCanvasElement} canvas - Canvas con la imagen recortada
    @param {number} minTextHeight - Altura mínima deseada del texto en píxeles (default: 30)
    @param {number} maxTextHeight - Altura máxima deseada del texto en píxeles (default: 50)
    @param {number} textHeightRatio - Proporción estimada del alto del canvas que ocupa el texto (default: 0.4)
    @returns {number} - Factor de escala óptimo
*/
export const calculateOptimalScaleFactor = (
    canvas,
    minTextHeight = 30,
    maxTextHeight = 50,
    textHeightRatio = 0.4
) => {
    // Validar que el canvas sea válido
    if (!(canvas instanceof HTMLCanvasElement) || canvas.width === 0 || canvas.height === 0) {
        return 1; // Factor por defecto si el canvas no es válido
    }

    // Estimar la altura del texto como una proporción del alto del canvas
    const estimatedTextHeight = canvas.height * textHeightRatio;

    // Si la altura estimada ya está dentro del rango ideal, no necesitamos escalar
    if (estimatedTextHeight >= minTextHeight && estimatedTextHeight <= maxTextHeight) {
        return 1;
    }

    // Calcular el factor de escala necesario para que la altura del texto esté dentro del rango
    let scaleFactor;
    if (estimatedTextHeight < minTextHeight) {
        // Si el texto es demasiado pequeño, escalar hacia arriba
        scaleFactor = minTextHeight / estimatedTextHeight;
    } else {
        // Si el texto es demasiado grande, escalar hacia abajo
        scaleFactor = maxTextHeight / estimatedTextHeight;
    }

    // Asegurar que el factor de escala no sea menor que 1 (no queremos reducir demasiado)
    return Math.max(1, scaleFactor);
};

/**
    Escala un array de imágenes recortadas aplicando binarización para una versión y manteniendo la original para otra,
    y retorna los factores de escala usados.
    @param {Array<Array<Object>>} croppedImages - Array de arrays de objetos con imágenes
    @param {number} [defaultScaleFactor=3] - Factor de escalado por defecto (usado si no se calcula uno óptimo)
    @returns {Object} - Objeto con las imágenes escaladas (binarizadas y originales) y los factores de escala
    @returns {Array<Array<Object>>} return.scaledBinarizedImages - Array de arrays con imágenes binarizadas escaladas
    @returns {Array<Array<Object>>} return.scaledOriginalImages - Array de arrays con imágenes originales escaladas
    @returns {Array<Array<number>>} return.scaleFactors - Array de arrays con los factores de escala usados
*/
export const upscaleCroppedImages = (croppedImages, defaultScaleFactor = 3) => {
    // Array para almacenar los factores de escala de cada imagen
    const scaleFactors = [];

    const scaledBinarizedImages = [];
    const scaledOriginalImages = [];

    croppedImages.forEach((canvasImages) => {
        if (!canvasImages.length) {
            scaleFactors.push([]);
            scaledBinarizedImages.push([]);
            scaledOriginalImages.push([]);
            return;
        }

        // Arrays para los factores de escala y las imágenes de este grupo
        const groupScaleFactors = [];
        const binarizedGroup = [];
        const originalGroup = [];

        canvasImages.forEach((imageData) => {
            const { canvas, ...rest } = imageData;
            try {
                // Calcular el factor de escala óptimo para esta imagen
                const scaleFactor = calculateOptimalScaleFactor(canvas) || defaultScaleFactor;
                groupScaleFactors.push(scaleFactor);

                // Procesar versión binarizada
                const binarizedCanvas = binarizeCanvas(canvas);
                const upscaledBinarizedImage = upscaleImage(binarizedCanvas, scaleFactor);

                // Procesar versión original
                const upscaledOriginalImage = upscaleImage(canvas, scaleFactor);

                binarizedGroup.push({
                    ...rest,
                    canvas: binarizedCanvas,
                    image: upscaledBinarizedImage,
                });

                originalGroup.push({
                    ...rest,
                    canvas: canvas,
                    image: upscaledOriginalImage,
                });
            } catch (error) {
                console.error(`Error al hacer upscaling de la imagen ${imageData.id}:`, error);
                groupScaleFactors.push(1);
                binarizedGroup.push({
                    ...rest,
                    canvas: canvas,
                    image: imageData.image,
                });
                originalGroup.push({
                    ...rest,
                    canvas: canvas,
                    image: imageData.image,
                });
            }
        });

        scaleFactors.push(groupScaleFactors);
        scaledBinarizedImages.push(binarizedGroup);
        scaledOriginalImages.push(originalGroup);
    });

    return {
        scaledBinarizedImages,
        scaledOriginalImages,
        scaleFactors,
    };
};

/**
    Reduce el tamaño de las bounding boxes dividiendo por el factor de escala
    @param {Array<Object>} boundingBoxes - Array de objetos con bounding boxes
    @param {number} scaleFactor - Factor por el cual dividir las coordenadas
    @returns {Array<Object>} - Array de bounding boxes con coordenadas reducidas
*/
export const downScaleBoundingBoxes = (boundingBoxes, scaleFactor) => {
    if (scaleFactor === 1) return boundingBoxes;
    return boundingBoxes.map((boundingBox) => ({
        ...boundingBox,
        bbox: {
            x0: boundingBox.bbox.x0 / scaleFactor,
            x1: boundingBox.bbox.x1 / scaleFactor,
            y0: boundingBox.bbox.y0 / scaleFactor,
            y1: boundingBox.bbox.y1 / scaleFactor,
        },
    }));
};