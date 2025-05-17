export async function decodeBase64Image(base64String) {
  return new Promise((resolve, reject) => {
    const cleanBase64 = base64String.startsWith("data:image/png;base64,")
      ? base64String.split(",")[1]
      : base64String;

    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Invalid image data"));
    img.src = `data:image/png;base64,${cleanBase64}`;
  });
}

export async function resizeWithPadding(image, targetSize) {
  const canvas = document.createElement("canvas");
  canvas.width = targetSize;
  canvas.height = targetSize;
  const ctx = canvas.getContext("2d");

  const aspectRatio = image.width / image.height;
  let newWidth, newHeight;
  if (aspectRatio > 1) {
    newWidth = targetSize;
    newHeight = Math.round(targetSize / aspectRatio);
  } else {
    newHeight = targetSize;
    newWidth = Math.round(targetSize * aspectRatio);
  }

  const scaleX = newWidth / image.width;
  const scaleY = newHeight / image.height;
  const xOffset = Math.floor((targetSize - newWidth) / 2);
  const yOffset = Math.floor((targetSize - newHeight) / 2);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, targetSize, targetSize);
  ctx.save();
  ctx.translate(xOffset, yOffset);
  ctx.scale(scaleX, scaleY);
  ctx.drawImage(image, 0, 0);
  ctx.restore();

  const imageData = ctx.getImageData(0, 0, targetSize, targetSize);
  return {
    data: imageData.data,
    width: targetSize,
    height: targetSize,
    scaleX,
    scaleY,
    xOffset,
    yOffset,
    originalWidth: image.width,
    originalHeight: image.height,
    resizedWidth: newWidth,
    resizedHeight: newHeight,
  };
}

export async function cropPatch(imageData, maskData, bounds, targetSize = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = targetSize;
  canvas.height = targetSize;
  const ctx = canvas.getContext("2d");

  const { x, y, width, height } = bounds;

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = imageData.width;
  tempCanvas.height = imageData.height;
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.putImageData(
    new ImageData(
      new Uint8ClampedArray(imageData.data),
      imageData.width,
      imageData.height
    ),
    0,
    0
  );

  ctx.drawImage(tempCanvas, x, y, width, height, 0, 0, width, height);

  const imagePatchData = ctx.getImageData(0, 0, targetSize, targetSize);

  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = targetSize;
  maskCanvas.height = targetSize;
  const maskCtx = maskCanvas.getContext("2d");

  const tempMaskCanvas = document.createElement("canvas");
  tempMaskCanvas.width = maskData.width;
  tempMaskCanvas.height = maskData.height;
  const tempMaskCtx = tempMaskCanvas.getContext("2d");
  tempMaskCtx.putImageData(
    new ImageData(
      new Uint8ClampedArray(maskData.data),
      maskData.width,
      maskData.height
    ),
    0,
    0
  );

  maskCtx.drawImage(tempMaskCanvas, x, y, width, height, 0, 0, width, height);

  const maskPatchData = maskCtx.getImageData(0, 0, targetSize, targetSize);

  return {
    imageBuffer: {
      data: imagePatchData.data,
      width: targetSize,
      height: targetSize,
    },
    maskBuffer: {
      data: maskPatchData.data,
      width: targetSize,
      height: targetSize,
    },
  };
}
