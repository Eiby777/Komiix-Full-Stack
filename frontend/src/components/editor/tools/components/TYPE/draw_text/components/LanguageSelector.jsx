import React from 'react';

/**
 * @file LanguageSelector.jsx
 * @description Component for selecting OCR language
 * @param {Object} props
 * @param {string} props.language - Current selected language
 * @param {function} props.setLanguage - Function to update the selected language
 * @returns {JSX.Element} Language selection dropdown
 */

export default function LanguageSelector({ language, setLanguage }) {
  const languageOptions = [
    { value: 'eng', label: 'Inglés' },
    { value: 'spa', label: 'Español' },
    { value: 'jpn', label: 'Japonés' },
    { value: 'chi_sim', label: 'Chino Simp' },
    { value: 'kor', label: 'Coreano' },
  ];

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="p-1.5 rounded-md bg-[#2a2a2a] text-white border border-white/10 focus:outline-none focus:border-white/30 text-sm transition-all duration-200 ease-in-out flex-grow"
    >
      {languageOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}