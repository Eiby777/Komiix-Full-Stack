export const handleOriginalTextChange = (
  value,
  index,
  selectedId,
  setTextData,
  setOriginalText,
  debouncedUpdateCanvasOriginal
) => {
  setOriginalText(value);
  setTextData((prev) => {
    const newData = prev.map((innerArray) => [...innerArray]);
    const itemIndex = newData[index]?.findIndex((item) => item.id === selectedId) ?? -1;
    if (itemIndex !== -1) {
      newData[index][itemIndex] = {
        ...newData[index][itemIndex],
        original: value,
      };
    }
    return newData;
  });

  // Actualizar canvas con debounce
  debouncedUpdateCanvasOriginal(value);
};

export const handleAlternativeSelect = (
  alternative,
  index,
  selectedId,
  setTranslatedText,
  setAlternatives,
  setTextData,
  translatedText
) => {
  setTranslatedText(alternative);
  setAlternatives((prev) =>
    prev.map((alt) => (alt === alternative ? translatedText : alt))
  );
  setTextData((currentTextData) => {
    const newData = currentTextData.map((innerArray, i) => {
      if (i === index) {
        return innerArray.map((item) => {
          if (item.id === selectedId) {
            return { ...item, translation: alternative };
          }
          return item;
        });
      }
      return innerArray;
    });
    return newData;
  });
};