import { useEffect } from 'react';
const useUpdateDimensions = (setDimensions, dimensionImages, activeImageIndex) => {
    useEffect(() => {
        setDimensions(dimensionImages[activeImageIndex]);
      }, [activeImageIndex, dimensionImages]);
}

export default useUpdateDimensions;