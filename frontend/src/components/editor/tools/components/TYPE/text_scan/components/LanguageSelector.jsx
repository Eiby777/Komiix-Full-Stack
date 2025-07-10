import React, { useEffect } from "react";
import { OCR_LANGUAGE_OPTIONS, TRANSLATION_LANGUAGE_OPTIONS } from "../../../../../../../hooks/languageOptions";

/**
 * LanguageSelector component - Provides dropdown selectors for source and target languages
 * @param {Object} props - Component props
 * @param {string} props.selectedLanguage - Currently selected source language ID
 * @param {Function} props.setSelectedLanguage - Function to update selected source language
 * @param {boolean} props.languageError - Flag indicating if source language selection is invalid
 * @param {Function} props.setLanguageError - Function to update source language error state
 * @param {string} props.selectedTargetLanguage - Currently selected target language ID
 * @param {Function} props.setSelectedTargetLanguage - Function to update selected target language
 * @param {boolean} props.targetLanguageError - Flag indicating if target language selection is invalid
 * @param {Function} props.setTargetLanguageError - Function to update target language error state
 * @returns {JSX.Element} Language selection UI with two dropdowns
 */
const LanguageSelector = ({
  originalOCRLanguage,
  setOriginalOCRLanguage,
  ocrlanguageError,
  setOCRLanguageError,
  selectedOCRTargetLanguage,
  setOriginalOCRTargetLanguage,
  ocrtargetLanguageError,
  setOCRTargetLanguageError,
  setSelectedTranslationLanguage,
  setOriginalTranslationLanguage
}) => {
  // Map OCR language values to Translation language values
  const ocrToTranslationMap = {
    'en': 'en',
    'es': 'es',
    'chi': 'zh-Hans',
    'jpn': 'ja',
    'ko': 'ko'
  };

  // When OCR language changes, update the Translation language if possible
  const handleOCRLanguageChange = (ocrValue) => {
    setOriginalOCRLanguage(ocrValue);
    setOCRLanguageError(false);
    
    // Find the corresponding translation language
    const translationValue = ocrToTranslationMap[ocrValue];
    if (translationValue) {
      setSelectedTranslationLanguage(translationValue);
      setOriginalTranslationLanguage(translationValue);
    }
  };

  // Filter out the selected target language from source language options
  const sourceLanguageOptions = OCR_LANGUAGE_OPTIONS.filter(
    (lang) => !selectedOCRTargetLanguage || lang.value !== selectedOCRTargetLanguage
  );

  // Filter out the selected source language from target language options
  const targetLanguageOptions = TRANSLATION_LANGUAGE_OPTIONS.filter(
    (lang) => !originalOCRLanguage || 
             lang.value !== ocrToTranslationMap[originalOCRLanguage]
  );

  return (
    <div className="mb-6">
      {/* Selector de idioma para detección */}
      <label htmlFor="language-select" className="text-white/75 text-sm block mb-2">
        Selecciona un idioma para detectar el texto:
      </label>
      <select
        id="language-select"
        value={originalOCRLanguage || ''}
        onChange={(e) => handleOCRLanguageChange(e.target.value)}
        className="w-full p-2 bg-transparent text-white rounded-md border border-gray-700 focus:outline-none focus:border-[#4a90e2]"
      >
        <option value="">-- Selecciona un idioma --</option>
        {sourceLanguageOptions.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
      {ocrlanguageError && (
        <p className="text-red-500 text-xs mt-2">
          Por favor, selecciona un idioma para continuar.
        </p>
      )}

      {/* Selector de idioma para traducción */}
      <label htmlFor="target-language-select" className="text-white/75 text-sm block mb-2 mt-4">
        Idioma a traducir (se actualizará automáticamente con el idioma de detección):
      </label>
      <select
        id="target-language-select"
        value={selectedOCRTargetLanguage || ''}
        onChange={(e) => {
          setOriginalOCRTargetLanguage(e.target.value);
          setSelectedTranslationLanguage(e.target.value);
          setOCRTargetLanguageError(false);
        }}
        className="w-full p-2 bg-transparent text-white rounded-md border border-gray-700 focus:outline-none focus:border-[#4a90e2]"
      >
        <option value="">-- Selecciona un idioma --</option>
        {targetLanguageOptions.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
      {ocrtargetLanguageError && (
        <p className="text-red-500 text-xs mt-2">
          Por favor, selecciona un idioma de destino para continuar.
        </p>
      )}
    </div>
  );
};

export default LanguageSelector;
