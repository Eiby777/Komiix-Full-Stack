import { useCallback } from 'react';

export const debouncedDetectAndTranslate = (debounce, fetchTranslation, setDetectedLang, setTranslatedText, setAlternatives, isTrackingChanges, targetLang) =>
  useCallback(
    debounce(async (text) => {
      if (text && isTrackingChanges) {
        const { translatedText, alternatives, detectedLang } = await fetchTranslation(text, targetLang);
        setDetectedLang(detectedLang);
        setTranslatedText(translatedText);
        setAlternatives(alternatives);
      }
    }, 1000),
    [debounce, fetchTranslation, setDetectedLang, setTranslatedText, setAlternatives, isTrackingChanges, targetLang]
  );