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
