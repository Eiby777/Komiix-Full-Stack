const checkInvalidMarks = (marks) => {
    const container = document.getElementById('image-preview-container');
    if (!container) return marks;

    const containerHeight = container.clientHeight;
    return marks.filter(mark => mark <= containerHeight);
};
export const deleteImage = (id, setImages, setMarks) => {
    setImages(prev => prev.filter(img => img.id !== id));
    setMarks(prev => checkInvalidMarks(prev));
};

export const moveImage = (fromIndex, toIndex, images, setImages) => {
    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    setImages(updatedImages);
};