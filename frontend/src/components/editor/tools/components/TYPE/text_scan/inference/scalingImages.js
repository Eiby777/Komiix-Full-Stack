
/**
 * Valida si una cadena es una imagen base64 válida
 * @param {string} base64String - Cadena base64 a validar
 * @returns {boolean} - True si es una imagen base64 válida, false en caso contrario
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
 * Convierte un canvas a imagen binaria (blanco y negro) aplicando un umbral fijo
 * @param {HTMLCanvasElement} canvas - Canvas a binarizar
 * @returns {HTMLCanvasElement} - Canvas binarizado
 */
export const binarizeCanvas = (canvas) => {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
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
    return canvas;
};

/**
 * Escala una imagen manteniendo su relación de aspecto
 * @param {HTMLCanvasElement} canvas - Canvas con la imagen original
 * @param {number} scaleFactor - Factor de escalado (ej. 2 para duplicar tamaño)
 * @returns {string} - Imagen escalada en formato base64
 * @throws {Error} - Si la imagen base64 generada no es válida
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
 * Calcula el factor de escala óptimo para una imagen, de modo que la altura estimada del texto
 * esté en el rango ideal para Tesseract (30-50 píxeles).
 * @param {HTMLCanvasElement} canvas - Canvas con la imagen recortada
 * @param {number} minTextHeight - Altura mínima deseada del texto en píxeles (default: 30)
 * @param {number} maxTextHeight - Altura máxima deseada del texto en píxeles (default: 50)
 * @param {number} textHeightRatio - Proporción estimada del alto del canvas que ocupa el texto (default: 0.4)
 * @returns {number} - Factor de escala óptimo
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
 * Escala un array de imágenes recortadas aplicando binarización previa y retorna los factores de escala usados.
 * @param {Array<Array<Object>>} croppedImages - Array de arrays de objetos con imágenes
 * @param {number} [defaultScaleFactor=3] - Factor de escalado por defecto (usado si no se calcula uno óptimo)
 * @returns {Object} - Objeto con las imágenes escaladas y los factores de escala
 * @returns {Array<Array<Object>>} return.scaledImages - Array de arrays con imágenes escaladas
 * @returns {Array<Array<number>>} return.scaleFactors - Array de arrays con los factores de escala usados
 */
export const upscaleCroppedImages = (croppedImages, defaultScaleFactor = 3) => {
    // Array para almacenar los factores de escala de cada imagen
    const scaleFactors = [];

    const scaledImages = croppedImages.map((canvasImages) => {
        if (!canvasImages.length) {
            scaleFactors.push([]); // Añadir un array vacío para mantener la estructura
            return canvasImages;
        }

        // Array para los factores de escala de este grupo de imágenes
        const groupScaleFactors = [];

        const scaledGroup = canvasImages.map((imageData) => {
            const { canvas, ...rest } = imageData;
            try {
                // Calcular el factor de escala óptimo para esta imagen
                const scaleFactor = calculateOptimalScaleFactor(canvas) || defaultScaleFactor;
                // Almacenar el factor de escala
                groupScaleFactors.push(scaleFactor);

                const binarizedCanvas = binarizeCanvas(canvas);
                const upscaledImage = upscaleImage(binarizedCanvas, scaleFactor);

                return {
                    ...rest,
                    canvas: binarizedCanvas,
                    image: upscaledImage,
                };
            } catch (error) {
                console.error(`Error al hacer upscaling de la imagen ${imageData.id}:`, error);
                // En caso de error, usar un factor de escala de 1 (sin cambios)
                groupScaleFactors.push(1);
                return {
                    ...rest,
                    canvas: canvas,
                    image: imageData.image,
                };
            }
        });

        // Añadir los factores de escala de este grupo al array general
        scaleFactors.push(groupScaleFactors);
        return scaledGroup;
    });

    return {
        scaledImages,
        scaleFactors,
    };
};


