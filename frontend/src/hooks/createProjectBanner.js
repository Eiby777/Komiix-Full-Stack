/**
 * Crea un banner con múltiples recortes de imágenes seleccionadas aleatoriamente.
 * @param {ArrayBuffer[]} imageBuffers Arreglo de imágenes en formato ArrayBuffer
 * @param {number} [bannerWidth=1200] Ancho del banner
 * @param {number} [bannerHeight=300] Alto del banner
 * @param {number} [numSections=8] Número de secciones en el banner
 * @returns {Promise<ArrayBuffer>} Promesa que se resuelve con el banner como ArrayBuffer
 */
async function createArtisticBanner(imageBuffers, bannerWidth = 1200, bannerHeight = 300, numSections = 8) {
    // Crear el canvas usando document.createElement
    const canvas = document.createElement('canvas');
    canvas.width = bannerWidth;
    canvas.height = bannerHeight;
    const ctx = canvas.getContext('2d');

    // Seleccionar imágenes aleatoriamente sin repetir (si es posible)
    const shuffled = [...imageBuffers].sort(() => 0.5 - Math.random());
    const selectedBuffers = shuffled.slice(0, Math.min(numSections, imageBuffers.length));

    // Convertir los ArrayBuffer a imágenes cargables en el canvas
    const imagePromises = selectedBuffers.map(async (buffer) => {
        try {
            const img = new Image();
            const blob = new Blob([buffer], { type: 'image/png' }); // Asumimos que son PNGs, ajusta si es necesario
            const url = URL.createObjectURL(blob);
            return new Promise((resolve, reject) => {
                img.onload = () => {
                    URL.revokeObjectURL(url);
                    resolve(img);
                };
                img.onerror = () => {
                    URL.revokeObjectURL(url);
                    reject(new Error('No se pudo cargar la imagen desde ArrayBuffer'));
                };
                img.src = url;
            });
        } catch (error) {
            throw new Error(`Error procesando la imagen desde ArrayBuffer: ${error.message}`);
        }
    });

    try {
        const loadedImages = await Promise.all(imagePromises);

        ctx.save();

        // Definir puntos de corte diagonales
        const sectionWidth = bannerWidth / numSections;
        const slashPoints = [0];
        for (let i = 1; i < numSections; i++) {
            slashPoints.push(slashPoints[i - 1] + sectionWidth + (Math.random() - 0.5) * sectionWidth * 0.5);
        }
        slashPoints.push(bannerWidth);

        // Dibujar cada sección
        for (let i = 0; i < numSections; i++) {
            const imgIndex = i < loadedImages.length ? i : i % loadedImages.length;
            const img = loadedImages[imgIndex];
            const startX = slashPoints[i];
            const endX = slashPoints[i + 1];
            const sectionWidth = endX - startX;

            // Crear un recorte rectangular completo para la sección
            ctx.beginPath();
            ctx.rect(startX, 0, sectionWidth, bannerHeight);
            ctx.clip();

            // Calcular dimensiones para llenar la sección
            const imgRatio = img.width / img.height;
            let drawWidth = sectionWidth * 2; // Zoom base del 200%
            let drawHeight = drawWidth / imgRatio;
            if (drawHeight < bannerHeight) {
                drawHeight = bannerHeight * 2;
                drawWidth = drawHeight * imgRatio;
            }

            // Elegir una región aleatoria de la imagen original
            const srcWidth = img.width;
            const srcHeight = img.height;
            const maxSrcX = srcWidth - (srcWidth * sectionWidth / drawWidth);
            const maxSrcY = srcHeight - (srcHeight * bannerHeight / drawHeight);
            const srcX = Math.random() * maxSrcX;
            const srcY = Math.random() * maxSrcY;
            const srcDrawWidth = srcWidth * sectionWidth / drawWidth;
            const srcDrawHeight = srcHeight * bannerHeight / drawHeight;

            // Dibujar la región específica de la imagen
            ctx.drawImage(
                img,
                srcX, srcY, srcDrawWidth, srcDrawHeight,
                startX, 0, sectionWidth, bannerHeight
            );

            // Línea decorativa del slash
            ctx.restore();
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(endX, 0);
            ctx.lineTo(endX - bannerHeight * 0.2, bannerHeight);
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
            ctx.save();
        }

        // Convertir el canvas a Blob y luego a ArrayBuffer
        const blob = await new Promise((resolve) => {
            canvas.toBlob(resolve, 'image/png'); // Usamos PNG como formato base
        });
        const arrayBuffer = await blob.arrayBuffer();

        return arrayBuffer;

    } catch (error) {
        console.error('Error al crear el banner:', error);
        return null;
    }
}

/**
 * Implementa el banner y retorna el ArrayBuffer
 * @param {ArrayBuffer[]} imageBuffers Arreglo de imágenes en formato ArrayBuffer
 * @returns {Promise<ArrayBuffer|null>} El banner como ArrayBuffer o null si falla
 */
async function getBanner(imageBuffers) {
    try {
        const bannerArrayBuffer = await createArtisticBanner(imageBuffers, 2400, 600, 8);
        if (bannerArrayBuffer) {
            return bannerArrayBuffer;
        }
    } catch (error) {
        console.error('Error al procesar las imágenes:', error);
        return null;
    }
}

export default getBanner;