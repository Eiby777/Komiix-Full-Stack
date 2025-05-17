import React from "react";

const LanguageSelector = ({
  selectedLanguage,
  setSelectedLanguage,
  languageError,
  setLanguageError,
  availableLanguages
}) => {
  return (
    <div className="mb-6">
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
        {availableLanguages.map((lang) => (
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
    </div>
  );
};

export default LanguageSelector;