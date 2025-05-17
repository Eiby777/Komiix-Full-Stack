
export const getCanvasMaskData = (canvasIndex, canvasInstances) => {
    const canvas = canvasInstances[canvasIndex];
    if (!canvas) {
      console.error("[Mask Data] Canvas not found for canvasIndex:", canvasIndex);
      return null;
    }
  
    const bgObj = canvas.getObjects().find((obj) => obj.backgroundImage);
    if (!bgObj) {
      console.error("[Mask Data] Background object not found");
      return null;
    }
  
    const imgWidth = Math.round(bgObj.width * bgObj.scaleX);
    const imgHeight = Math.round(bgObj.height * bgObj.scaleY);
  
    const bgLeft = canvas.width / 2 - imgWidth / 2;
    const bgTop = canvas.height / 2 - imgHeight / 2;
  
    const offCanvas = document.createElement("canvas");
    offCanvas.width = imgWidth;
    offCanvas.height = imgHeight;
    const ctx = offCanvas.getContext("2d");
  
    const maskObjects = canvas
      .getObjects()
      .filter((obj) => obj.layer === "mask");
    if (maskObjects.length === 0) {
      console.warn("[Mask Data] No mask objects found, returning empty mask");
      return { mask64: null, width: imgWidth, height: imgHeight, positions: [] };
    }

    const positions = [];
  
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, imgWidth, imgHeight);
  
    maskObjects.forEach((obj) => {
      const relativeLeft = obj.left - bgLeft;
      const relativeTop = obj.top - bgTop;
      const width = obj.width * (obj.scaleX || 1);
      const height = obj.height * (obj.scaleY || 1);
      positions.push({ 
        x: relativeLeft, 
        y: relativeTop,
        width,
        height
      });
      const objScaleX = obj.scaleX || 1;
      const objScaleY = obj.scaleY || 1;
  
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = imgWidth;
      tempCanvas.height = imgHeight;
      const tempCtx = tempCanvas.getContext("2d");
  
      tempCtx.fillStyle = "white";
      tempCtx.strokeStyle = "white";
      tempCtx.lineWidth = obj.strokeWidth || 1;
      tempCtx.globalCompositeOperation = "copy";
  
      tempCtx.save();
      tempCtx.translate(relativeLeft, relativeTop);
      tempCtx.scale(objScaleX, objScaleY);
  
      if (obj.type === "image" && obj.getElement) {
        const imgElement = obj.getElement();
        tempCtx.drawImage(imgElement, 0, 0, obj.width, obj.height);
      } else {
        obj._render(tempCtx);
      }
  
      tempCtx.restore();
  
      const finalImageData = ctx.getImageData(0, 0, imgWidth, imgHeight);
      const finalData = finalImageData.data;
      for (let i = 0; i < finalData.length; i += 4) {
        const avg = (finalData[i] + finalData[i + 1] + finalData[i + 2]) / 3;
        const value = avg > 128 ? 255 : 0;
        finalData[i] = value;
        finalData[i + 1] = value;
        finalData[i + 2] = value;
        finalData[i + 3] = 255;
      }
      ctx.putImageData(finalImageData, 0, 0);
  
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(tempCanvas, 0, 0);
    });
  
    const finalImageData = ctx.getImageData(0, 0, imgWidth, imgHeight);
    const finalData = finalImageData.data;
    for (let i = 0; i < finalData.length; i += 4) {
      finalData[i] = finalData[i] > 128 ? 255 : 0;
      finalData[i + 1] = finalData[i + 1] > 128 ? 255 : 0;
      finalData[i + 2] = finalData[i + 2] > 128 ? 255 : 0;
    }
    ctx.putImageData(finalImageData, 0, 0);
  
    const mask64 = offCanvas.toDataURL();
    return { mask64, width: imgWidth, height: imgHeight, positions };
  };
