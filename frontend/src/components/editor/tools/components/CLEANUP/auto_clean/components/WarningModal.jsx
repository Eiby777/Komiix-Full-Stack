import React from "react";
import LanguageSelector from "./LanguageSelector";

/**
 * Lista de idiomas disponibles para el OCR
 * @constant
 * @type {Array<{id: string, name: string}>}
 */
const AVAILABLE_LANGUAGES = [
  { id: "spa", name: "Español" },
  { id: "eng", name: "Inglés" },
  { id: "jpn", name: "Japonés" },
  { id: "chi_sim", name: "Chino Simplificado" },
  { id: "kor", name: "Coreano" },
];

/**
 * Modal de advertencia para la limpieza automática
 * 
 * @component
 * @param {Object} props - Props del componente
 * @param {string} props.selectedLanguage - Idioma seleccionado actualmente
 * @param {Function} props.setSelectedLanguage - Función para actualizar el idioma seleccionado
 * @param {boolean} props.languageError - Indica si hay error de idioma no seleccionado
 * @param {Function} props.setLanguageError - Función para actualizar el estado de error
 * @param {Function} props.onAccept - Callback al aceptar el modal
 * @param {Function} props.onCancel - Callback al cancelar el modal
 * @returns {JSX.Element} Modal de advertencia con selector de idioma
 */
const WarningModal = ({
  selectedLanguage,
  setSelectedLanguage,
  languageError,
  setLanguageError,
  onAccept,
  onCancel
}) => {
  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold text-white/90 mb-4">Advertencia</h3>
      <p className="text-white/75 text-sm mb-4">
        Esta herramienta tomará como referencia las anotaciones de la capa anterior.
      </p>
      <LanguageSelector
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        languageError={languageError}
        setLanguageError={setLanguageError}
        availableLanguages={AVAILABLE_LANGUAGES}
      />
      <div className="flex justify-center space-x-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700/50 text-white rounded-md hover:bg-gray-600 active:bg-gray-500 transition-all duration-200"
        >
          Cancelar
        </button>
        <button
          onClick={onAccept}
          disabled={!selectedLanguage}
          className={`px-4 py-2 text-white rounded-md transition-all duration-200 ${
            selectedLanguage
              ? "bg-[#4a90e2] hover:bg-[#357abd] active:bg-[#2d6aa6]"
              : "bg-gray-500 cursor-not-allowed"
          }`}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default WarningModal;
