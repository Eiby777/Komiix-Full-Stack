import JSZip from 'jszip';

export const handleFormatChange = (e, setFormat, setQuality) => {
    const newFormat = e.target.value;
    setFormat(newFormat);
    if (newFormat === 'png') setQuality(100);
};

export const handleExport = async (images, marks, format, quality) => {
    try {
        let MAX_CANVAS_HEIGHT = 16000; // Initial safe height limit
        const MIN_CANVAS_HEIGHT = 4096; // Minimum height to try
        const MAX_RETRIES = 3; // Maximum number of retries
        let retryCount = 0;

        const imgElements = await Promise.all(images.map((img, index) => {
            return new Promise(resolve => {
                const image = new Image();
                image.crossOrigin = 'anonymous'; // Handle cross-origin images
                image.src = img.url;
                image.onload = () => {
                    resolve({ image, width: image.width, height: image.height });
                };
                image.onerror = () => {
                    resolve({ image: null, width: 0, height: 0 });
                };
            });
        }));

        // Filter out failed images
        const validImgElements = imgElements.filter(img => img.image !== null);
        if (validImgElements.length === 0) {
            console.error('No valid images loaded');
            return;
        }

        const maxWidth = Math.max(...validImgElements.map(img => img.width));
        const totalHeight = validImgElements.reduce((sum, img) => sum + img.height, 0);

        // Get preview container
        const preview = document.getElementById('image-preview-container');
        if (!preview) {
            console.error('Preview container not found');
            return;
        }

        const previewHeight = preview.scrollHeight;
        if (previewHeight <= 0) {
            console.error('Invalid preview height:', previewHeight);
            return;
        }

        // Map marks to original coordinates
        const mappedMarks = marks
            .filter(mark => mark.y >= 0 && mark.y <= previewHeight)
            .map(mark => ({
                id: mark.id,
                y: (mark.y / previewHeight) * totalHeight
            }))
            .filter(mark => mark.y >= 0 && mark.y <= totalHeight);

        const sortedMarks = [0, ...mappedMarks.map(mark => mark.y), totalHeight]
            .filter(y => y >= 0 && y <= totalHeight)
            .sort((a, b) => a - b);

        // Test canvas limits
        const testCanvasLimits = (width, height) => {
            try {
                const testCanvas = document.createElement('canvas');
                testCanvas.width = width;
                testCanvas.height = height;
                const ctx = testCanvas.getContext('2d');
                if (!ctx) {
                    throw new Error('Failed to get 2D context for test canvas');
                }
                // Perform a simple operation to ensure canvas is valid
                ctx.fillStyle = 'rgba(0,0,0,0)';
                ctx.fillRect(0, 0, 1, 1);
                return true;
            } catch (error) {
                console.warn(`Canvas test failed for ${width}x${height}:`, error.message);
                return false;
            }
        };

        const processChunks = async () => {
            const zip = new JSZip();
            let chunkIndex = 0;
            let imagesInChunk = [];
            let chunkHeight = 0;
            let currentY = 0; // Tracks the global Y-position

            const processChunk = async (chunkImages, chunkStartY, chunkHeight) => {
                // Test canvas dimensions before creating
                if (!testCanvasLimits(maxWidth, chunkHeight)) {
                    throw new Error(`Canvas height ${chunkHeight} exceeds browser limits`);
                }

                const canvas = document.createElement('canvas');
                canvas.width = maxWidth;
                canvas.height = chunkHeight;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    console.error('Failed to get 2D context for chunk canvas');
                    return;
                }

                // Draw images in the chunk
                let yOffset = 0;
                for (const img of chunkImages) {
                    ctx.drawImage(img.image, 0, yOffset, img.width, img.height);
                    yOffset += img.height;
                }

                // Crop the chunk based on marks
                const chunkEndY = chunkStartY + chunkHeight;
                const chunkMarks = sortedMarks.filter(mark => mark >= chunkStartY && mark <= chunkEndY);

                // Ensure at least one crop if no marks
                if (chunkMarks.length <= 1) {
                    chunkMarks.push(chunkEndY);
                }

                for (let i = 0; i < chunkMarks.length - 1; i++) {
                    const startY = chunkMarks[i];
                    const endY = chunkMarks[i + 1];
                    const cropHeight = endY - startY;
                    if (cropHeight <= 0) {
                        console.warn(`Skipping invalid crop height: ${cropHeight} at mark ${i}`);
                        continue;
                    }

                    const sourceY = startY - chunkStartY;
                    if (sourceY < 0 || sourceY + cropHeight > chunkHeight) {
                        console.warn(`Invalid crop coordinates: sourceY=${sourceY}, cropHeight=${cropHeight}, chunkHeight=${chunkHeight}`);
                        continue;
                    }

                    const cropCanvas = document.createElement('canvas');
                    cropCanvas.width = maxWidth;
                    cropCanvas.height = Math.ceil(cropHeight); // Ensure integer height
                    const cropCtx = cropCanvas.getContext('2d');
                    if (!cropCtx) {
                        console.error('Failed to get 2D context for crop canvas');
                        continue;
                    }

                    cropCtx.drawImage(
                        canvas,
                        0, sourceY, maxWidth, cropHeight,
                        0, 0, maxWidth, cropHeight
                    );

                    const mimeType = format === 'png' ? 'image/png' : format === 'jpg' ? 'image/jpeg' : 'image/webp';
                    const qualityValue = format === 'png' ? 1 : quality / 100;

                    const blob = await new Promise(resolve => {
                        cropCanvas.toBlob(blob => {
                            resolve(blob);
                        }, mimeType, qualityValue);
                    });

                    if (blob) {
                        zip.file(`cropped-image-${chunkIndex}-${i + 1}.${format}`, blob);
                    } else {
                        console.warn(`Failed to generate blob for crop ${i + 1} in chunk ${chunkIndex}`);
                    }
                }
            };

            // Group images into chunks
            for (const img of validImgElements) {
                if (chunkHeight + img.height > MAX_CANVAS_HEIGHT && imagesInChunk.length > 0) {
                    await processChunk(imagesInChunk, currentY, chunkHeight);
                    currentY += chunkHeight; // Update currentY after processing
                    chunkIndex++;
                    imagesInChunk = [];
                    chunkHeight = 0;
                }
                imagesInChunk.push(img);
                chunkHeight += img.height;
            }

            // Process the final chunk
            if (imagesInChunk.length > 0) {
                await processChunk(imagesInChunk, currentY, chunkHeight);
            }

            // Generate and download ZIP
            const content = await zip.generateAsync({ type: 'blob' });
            if (content.size < 100) {
                console.warn('ZIP file is suspiciously small. Likely no files were added.');
            }

            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'cropped-images.zip';
            a.click();
            URL.revokeObjectURL(url);
        };

        // Main loop with retries for canvas height
        while (retryCount <= MAX_RETRIES) {
            try {
                await processChunks();
                break;
            } catch (error) {
                console.error(`Attempt ${retryCount + 1} failed:`, error.message);
                if (error.message.includes('Canvas') || error.message.includes('Invalid') || error.message.includes('exceeds')) {
                    retryCount++;
                    if (retryCount > MAX_RETRIES) {
                        console.error('Max retries reached. Cannot process images with current browser capabilities.');
                        throw new Error('Browser does not support required canvas dimensions');
                    }
                    MAX_CANVAS_HEIGHT = Math.max(MIN_CANVAS_HEIGHT, Math.floor(MAX_CANVAS_HEIGHT * 0.75));
                } else {
                    // Non-canvas-related error, rethrow
                    throw error;
                }
            }
        }
    } catch (error) {
        console.error('Export failed:', error);
    }
};