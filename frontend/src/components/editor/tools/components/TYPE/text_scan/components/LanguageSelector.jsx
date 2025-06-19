import React from "react";

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
  selectedLanguage,
  setSelectedLanguage,
  languageError,
  setLanguageError,
  selectedTargetLanguage,
  setSelectedTargetLanguage,
  targetLanguageError,
  setTargetLanguageError,
}) => {

  const AVAILABLE_LANGUAGES = [
    { id: "spa", name: "Español" },
    { id: "eng", name: "Inglés" },
    { id: "jpn", name: "Japonés" },
    { id: "chi_sim", name: "Chino" },
    { id: "kor", name: "Coreano" },
  ];

  // Filter out the selected target language from source language options
  const sourceLanguageOptions = AVAILABLE_LANGUAGES.filter(
    (lang) => !selectedTargetLanguage || lang.id !== selectedTargetLanguage
  );

  // Filter out the selected source language from target language options
  const targetLanguageOptions = AVAILABLE_LANGUAGES.filter(
    (lang) => !selectedLanguage || lang.id !== selectedLanguage
  );

  return (
    <div className="mb-6">
      {/* Selector de idioma para detección */}
      <label htmlFor="language-select" className="text-white/75 text-sm block mb-2">
        Selecciona un idioma para detectar el texto:
      </label>
      <select
        id="language-select"
        value={selectedLanguage}
        onChange={(e) => {
          setSelectedLanguage(e.target.value);
          setLanguageError(false);
        }}
        className="w-full p-2 bg-transparent text-white rounded-md border border-gray-700 focus:outline-none focus:border-[#4a90e2]"
      >
        <option value="">-- Selecciona un idioma --</option>
        {sourceLanguageOptions.map((lang) => (
          <option key={lang.id} value={lang.id}>
            {lang.name}
          </option>
        ))}
      </select>
      {languageError && (
        <p className="text-red-500 text-xs mt-2">
          Por favor, selecciona un idioma para continuar.
        </p>
      )}

      {/* Selector de idioma para traducción */}
      <label htmlFor="target-language-select" className="text-white/75 text-sm block mb-2 mt-4">
        Idioma a traducir:
      </label>
      <select
        id="target-language-select"
        value={selectedTargetLanguage}
        onChange={(e) => {
          setSelectedTargetLanguage(e.target.value);
          setTargetLanguageError(false);
        }}
        className="w-full p-2 bg-transparent text-white rounded-md border border-gray-700 focus:outline-none focus:border-[#4a90e2]"
      >
        <option value="">-- Selecciona un idioma --</option>
        {targetLanguageOptions.map((lang) => (
          <option key={lang.id} value={lang.id}>
            {lang.name}
          </option>
        ))}
      </select>
      {targetLanguageError && (
        <p className="text-red-500 text-xs mt-2">
          Por favor, selecciona un idioma de destino para continuar.
        </p>
      )}
    </div>
  );
};

export default LanguageSelector;
