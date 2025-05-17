const arrayBufferToBase64 = (buffer) => {
    try {
        if (!(buffer instanceof ArrayBuffer) && !(buffer instanceof Uint8Array)) {
            throw new Error("Expected ArrayBuffer or Uint8Array");
        }
        const uint8Array = new Uint8Array(buffer);
        const chunkSize = 8192;
        let binary = "";
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
            const chunk = uint8Array.subarray(i, i + chunkSize);
            binary += String.fromCharCode.apply(null, chunk);
        }
        return btoa(binary);
    } catch (error) {
        console.error(
            "Oops! Something went wrong converting the image data. Please try again or contact support if this keeps happening.",
            error
        );
        return "";
    }
};

export { arrayBufferToBase64 }