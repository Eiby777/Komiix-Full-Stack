import { useEffect } from 'react';

const useInitialicePreviewWidth = (setPreviewWidth) => {
    useEffect(() => {
        const preview = document.getElementById('image-preview-container');
        const width = preview.clientWidth;
        setPreviewWidth(width);
    }, []);
};

export default useInitialicePreviewWidth;