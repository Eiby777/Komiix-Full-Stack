import { useEffect } from 'react';

const useResizeHandler = (
    previewWidth,
    marks,
    setMarks,
    setPreviewWidth,
    previewRef
) => {

    const debounce = (func, wait) => {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    useEffect(() => {
        const handleResize = debounce(() => {
            const preview = document.getElementById('image-preview-container') || previewRef.current;
            const width = preview.clientWidth;
            if (previewWidth) {
                const scale = width / previewWidth;
                setMarks(prev => prev.map(mark => ({ ...mark, y: mark.y * scale })));
            }
            setPreviewWidth(width);
        }, 200);

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [previewWidth, marks, setMarks, setPreviewWidth, previewRef]);
};

export default useResizeHandler;