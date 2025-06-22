import { supabase } from "../../../../../../../lib/supabaseClient";
import domain from "../../../../../../../hooks/domain";

export const detectLanguage = async (text) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const accesToken = session.access_token;
    const response = await fetch(domain + '/api/detect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accesToken}`
      },
      body: JSON.stringify({
        q: text
      }),
    });
    
    const data = await response.json();
    return data.language || 'en';
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en';
  }
};

export const translateText = async (text, fromLang, toLang) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const accesToken = session.access_token;
    const response = await fetch(domain + '/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accesToken}`
      },
      body: JSON.stringify({
        q: text,
        source: fromLang,
        target: toLang,
        format: 'text',
        alternatives: 3 // Request up to 3 alternatives
      }),
    });
    
    const data = await response.json();
    return {
      translatedText: data.translatedText,
      alternatives: data.alternatives || []
    };
  } catch (error) {
    console.error('Translation error:', error);
    return { translatedText: text, alternatives: [] };
  }
};

export const fetchTranslation = async (text, sourceLang, targetLang) => {
  if (!text) return { translatedText: '', alternatives: [] };
  const { translatedText, alternatives } = await translateText(text, sourceLang, targetLang);
  return { translatedText, alternatives };
};