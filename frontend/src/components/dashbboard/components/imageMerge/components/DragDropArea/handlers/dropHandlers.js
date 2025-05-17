export const handleDropImages = (
    e, 
    images, 
    setImages, 
    setAlertMessage, 
    setAlertType, 
    setShowAlert, 
    setProgress
) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || e.target.files);

    Promise.all(files.map(file => {
        return new Promise(resolve => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => resolve({
                width: img.width,
                height: img.height,
                file,
                url: URL.createObjectURL(file)
            });
        });
    })).then(imagesWithDimensions => {
        // Check if all new images have same width
        if (imagesWithDimensions.length > 1) {
            const firstWidth = imagesWithDimensions[0].width;
            const allSameWidth = imagesWithDimensions.every(img => img.width === firstWidth);

            if (!allSameWidth) {
                setAlertMessage('Todas las imágenes deben tener el mismo ancho');
                setAlertType('error');
                setShowAlert(true);
                setProgress(100);

                const interval = setInterval(() => {
                    setProgress(prev => {
                        if (prev <= 0) {
                            clearInterval(interval);
                            setShowAlert(false);
                            return 0;
                        }
                        return prev - (100 / 60);
                    });
                }, 50);
                return;
            }
        }

        // Check for duplicates
        const duplicates = imagesWithDimensions.filter(newImg =>
            images.some(existingImg =>
                existingImg.file.name === newImg.file.name &&
                existingImg.width === newImg.width &&
                existingImg.height === newImg.height
            )
        );

        if (duplicates.length > 0) {
            setAlertMessage(`Imagen duplicada detectada: ${duplicates[0].file.name}. Cambie el nombre para subirla.`);
            setAlertType('warning');
            setShowAlert(true);
            setProgress(100);

            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev <= 0) {
                        clearInterval(interval);
                        setShowAlert(false);
                        return 0;
                    }
                    return prev - (100 / 60);
                });
            }, 50);
            return;
        }

        // Check if all images have same width
        if (images.length > 0) {
            const firstWidth = images[0].width;
            const allSameWidth = imagesWithDimensions.every(img => img.width === firstWidth);

            if (!allSameWidth) {
                setAlertMessage('Todas las imágenes deben tener el mismo ancho');
                setAlertType('error');
                setShowAlert(true);
                setProgress(100);

                const interval = setInterval(() => {
                    setProgress(prev => {
                        if (prev <= 0) {
                            clearInterval(interval);
                            setShowAlert(false);
                            return 0;
                        }
                        return prev - (100 / 60);
                    });
                }, 50);
                return;
            }
        }

        const newImages = imagesWithDimensions.map(img => ({
            id: Math.random().toString(36).substring(2, 9),
            file: img.file,
            url: img.url,
            width: img.width,
            height: img.height
        }));

        setImages(prev => [...prev, ...newImages]);
    });
};
