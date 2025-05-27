/**
 * Prepares recorte groups and mapping for OCR processing
 * @param {Array} scaledBinarizedImages - Array of scaled binarized image crops
 * @param {Array<number>} counts - Array of rectangle counts per canvas
 * @param {number} groupSize - Size of each recorte group
 * @returns {Object} Object containing recorteGroups, recorteMapping, and totalRecortes
 */
export const prepareRecorteGroups = (scaledBinarizedImages, counts, groupSize) => {
    const recorteGroups = [];
    const recorteMapping = [];
    let flatRecortes = [];

    scaledBinarizedImages.forEach((canvasCrops, canvasIndex) => {
        if (counts[canvasIndex] === 0) {
            return;
        }
        canvasCrops.forEach((crop, cropIndex) => {
            flatRecortes.push({
                image: crop.image,
                id: crop.id,
                coords: crop.coords,
                color: crop.color,
                canvasIndex,
                cropIndex,
            });
            recorteMapping.push({ canvasIndex, cropIndex });
        });
    });

    for (let i = 0; i < flatRecortes.length; i += groupSize) {
        recorteGroups.push(flatRecortes.slice(i, i + groupSize));
    }

    const totalRecortes = counts.reduce((sum, count) => sum + count, 0);

    return { recorteGroups, recorteMapping, totalRecortes };
};

/**
 * Processes OCR results and maps them to canvas and crop indices
 * @param {Array} tesseractResultsFlat - Flat array of OCR results
 * @param {Array} recorteMapping - Mapping of flat indices to canvas and crop indices
 * @param {Array} scaledBinarizedImages - Array of scaled binarized image crops
 * @param {number} groupSize - Size of each recorte group
 * @returns {Array} Array of downscaled OCR results organized by canvas
 */
export const processOCRResults = (tesseractResultsFlat, recorteMapping, scaledBinarizedImages, groupSize) => {
    const tesseractResults = Array(scaledBinarizedImages.length).fill().map(() => []);
    const downscaledResults = Array(scaledBinarizedImages.length).fill().map(() => []);

    tesseractResultsFlat.forEach((group, groupIndex) => {
        group.forEach((result, resultIndex) => {
            const flatIndex = groupIndex * groupSize + resultIndex;
            const { canvasIndex, cropIndex } = recorteMapping[flatIndex] || {};
            if (canvasIndex !== undefined && cropIndex !== undefined) {
                tesseractResults[canvasIndex][cropIndex] = result;
                downscaledResults[canvasIndex][cropIndex] = {
                    ...result,
                    boundingBoxes: result.boundingBoxes,
                };
            }
        });
    });

    return downscaledResults;
};


/**
 * Identifies rectangles with non-solid backgrounds
 * @param {Array} cleanedImages - Array of cleaned image crops
 * @param {Array<number>} counts - Array of rectangle counts per canvas
 * @returns {Array} Array of rectangles with non-solid backgrounds
 */
export const identifyNonSolidBackgrounds = (cleanedImages, counts) => {
    const nonSolidBackgroundRects = [];

    for (let canvasIndex = 0; canvasIndex < cleanedImages.length; canvasIndex++) {
        if (counts[canvasIndex] === 0) continue;
        const canvasCrops = cleanedImages[canvasIndex];
        for (let cropIndex = 0; cropIndex < canvasCrops.length; cropIndex++) {
            const crop = canvasCrops[cropIndex];
            if (crop.isSolidBackground === false || !crop.isSolidBackground) {
                nonSolidBackgroundRects.push({
                    left: crop.coords.left,
                    top: crop.coords.top,
                    width: crop.coords.width,
                    height: crop.coords.height,
                    canvasIndex,
                    type: crop.isSolidBackground === false ? "non-solid" : "inpainting",
                });
            }
        }
    }

    return nonSolidBackgroundRects;
};