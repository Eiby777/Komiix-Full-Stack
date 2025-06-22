import { useCallback, useRef } from 'react';
import { fetchTranslation } from '../components/TranslationLogic';

export const debouncedDetectAndTranslate = (debounce, sourceLang, setTranslatedText, setAlternatives, isTrackingChanges, targetLang) => {
  const lastProcessedText = useRef('');
  
  return useCallback(
    debounce(async (text) => {
      if (text && isTrackingChanges && text !== lastProcessedText.current) {
        lastProcessedText.current = text;
        try {
          const { translatedText, alternatives } = await fetchTranslation(text, sourceLang, targetLang);
          setTranslatedText(translatedText);
          setAlternatives(alternatives);
        } catch (error) {
          console.error('Translation error:', error);
        }
      }
    }, 1000),
    [debounce, setTranslatedText, setAlternatives, isTrackingChanges, targetLang, sourceLang]
  );
};