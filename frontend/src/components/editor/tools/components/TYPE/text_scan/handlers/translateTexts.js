import fetchTranslation from "../components/TranslationLogic";
import { cleanText as handleCleanText } from "../../../../handlers/calculateTextCoordinates";

/**
 * Translates texts detected in the canvas using the given language settings.
 * @param {Array<Array<Object>>} result - Result of text detection, grouped by canvas.
 * @param {string} selectedLanguage - Selected source language.
 * @param {string} selectedTargetLanguage - Selected target language.
 * @returns {Promise<Array<Array<Object>>>} - Modified result with translated texts.
 */
const translateTexts = async (result, selectedLanguage, selectedTargetLanguage) => {
    const textsToTranslate = [];
    const textMappings = [];

    result.forEach((canvasResults, canvasIndex) => {
        canvasResults.forEach((item, itemIndex) => {
            const text = item.reorderedText === "same" ? item.originalText : item.reorderedText;
            if (text) {
                const cleanedText = handleCleanText(text);
                //const capitalizedText = cleanedText.charAt(0).toUpperCase() + cleanedText.slice(1).toLowerCase();
                textsToTranslate.push(cleanedText);
                textMappings.push({ canvasIndex, itemIndex });
            }
        });
    });

    if (textsToTranslate.length > 0) {
        const sourceLang = selectedLanguage;
        const targetLang = selectedTargetLanguage;

        const translationResult = await fetchTranslation(textsToTranslate, sourceLang, targetLang);

        if (translationResult.translatedText.length === textsToTranslate.length) {
            translationResult.translatedText.forEach((translated, idx) => {
                const { canvasIndex, itemIndex } = textMappings[idx];
                result[canvasIndex][itemIndex].translatedText = translated;
            });
        } else {
            console.warn('Translation result length mismatch, using original texts');
            textsToTranslate.forEach((text, idx) => {
                const { canvasIndex, itemIndex } = textMappings[idx];
                result[canvasIndex][itemIndex].translatedText = text;
            });
        }
    } else {
        console.warn("No texts to translate");
    }

    return result;
}

export default translateTexts