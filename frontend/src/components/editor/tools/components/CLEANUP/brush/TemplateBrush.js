import fabric from "../../../../../../constants/fabricInstance";
import lzString from 'lz-string';

export const createImageObject = (properties, layer, compressed = false) => {
  return new Promise((resolve, reject) => {
    const imgElement = document.createElement("img");
    const decompressedSrc = compressed ? lzString.decompress(properties.src) : properties.src;
    imgElement.src = decompressedSrc;
  

    imgElement.onload = () => {
      const fabricImage = new fabric.FabricImage(imgElement);
      fabricImage.set({
        layer: layer,
        id: properties.id,
        left: properties.left,
        opacity: 1,
        top: properties.top,
        src: decompressedSrc,
        width: properties.width,
        height: properties.height,
        selectable: false,
        originX: "left",
        originY: "top",
        scaleX: 1,
        scaleY: 1,
      });
      resolve(fabricImage);
    };

    imgElement.onerror = (err) => {
      reject(err);
    };
  });
};

