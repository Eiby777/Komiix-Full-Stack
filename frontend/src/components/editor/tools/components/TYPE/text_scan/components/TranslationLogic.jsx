import { supabase } from "../../../../../../../lib/supabaseClient";
import domain from "../../../../../../../hooks/domain";
// TranslationLogic.jsx
/**
 * Traduce un texto o un arreglo de textos
 * @param {string|Array<string>} text - Texto o arreglo de textos a traducir
 * @param {string} fromLang - Idioma fuente (ej: 'en')
 * @param {string} toLang - Idioma destino (ej: 'es')
 * @returns {Promise<Object>} - Objeto con el texto traducido y alternativas
 */
export const translateText = async (text, fromLang, toLang, setIsLoading) => {
  try {
    const isArray = Array.isArray(text);

    // Validate input
    if (!text || (isArray && text.length === 0)) {
      return { translatedText: isArray ? [] : '', alternatives: [] };
    }
    if (isArray && text.some(t => !t || typeof t !== 'string')) {
      console.warn('Invalid texts in translateText:', text);
      return { translatedText: text, alternatives: isArray ? text.map(() => []) : [] };
    }

    // For Japanese translations, ensure text is always sent as an array
    const requestText = fromLang === 'ja' ? (isArray ? text : [text]) : text;

    const { data: { session } } = await supabase.auth.getSession();
    const accesToken = session.access_token;
    const response = await fetch(domain + '/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accesToken}`
      },
      body: JSON.stringify({
        q: requestText,
        source: fromLang,
        target: toLang,
        format: 'text',
        alternatives: 0
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Translate API error: ${response.status} ${errorData}`);
    }

    const data = await response.json();

    if (!data.translatedText) {
      throw new Error('No translatedText in response: ' + JSON.stringify(data));
    }

    // Handle Japanese translation response (always returns array)
    if (fromLang === 'ja') {
      const translatedResult = {
        translatedText: data.translatedText,
        alternatives: data.alternatives || []
      };
      return translatedResult;
    }

    // Handle other languages (LibreTranslate response)
    const translatedResult = {
      translatedText: isArray ? data.translatedText : data.translatedText,
      alternatives: isArray ? data.alternatives || [] : data.alternatives || []
    }

    if (!translatedResult) {
      console.warn("Hubo un problema traduciendo el texto");
      setIsLoading(false);
      return;
    }

    return translatedResult;
  } catch (error) {
    console.error('Translation error:', error);
    const fallback = Array.isArray(text) ? text : [text];
    return {
      translatedText: fallback,
      alternatives: []
    };
  }
};



/**
 * Obtiene traducciones para un texto o arreglo de textos
 * @param {string|Array<string>} text - Texto o arreglo de textos a traducir
 * @param {string} sourceLang - Idioma fuente
 * @param {string} targetLang - Idioma destino
 * @returns {Promise<Object>} - Resultado con textos traducidos y alternativas
 */
export const fetchTranslation = async (text, sourceLang, targetLang) => {
  if (!text || (Array.isArray(text) && text.length === 0)) {
    return { translatedText: Array.isArray(text) ? [] : '', alternatives: [] };
  }

  const isArray = Array.isArray(text);
  
  // For Japanese translations, ensure we always send an array
  if (sourceLang === 'ja') {
    const requestText = isArray ? text : [text];
    const result = await translateText(requestText, sourceLang, targetLang);
    
    return {
      translatedText: result.translatedText || requestText,
      alternatives: result.alternatives || [],
    };
  }

  // For other languages, use existing logic
  const result = await translateText(text, sourceLang, targetLang);

  return {
    translatedText: result.translatedText || (isArray ? text : text),
    alternatives: result.alternatives || (isArray ? text.map(() => []) : []),
  };
};

export default fetchTranslation