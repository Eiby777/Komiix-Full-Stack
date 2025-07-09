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

