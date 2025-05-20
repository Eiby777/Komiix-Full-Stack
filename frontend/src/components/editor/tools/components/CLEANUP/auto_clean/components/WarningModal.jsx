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
 * @param {string} props.selectedImageOption - Opción seleccionada para imágenes
 * @param {Function} props.setSelectedImageOption - Función para actualizar la opción de imágenes
 * @param {boolean} props.languageError - Indica si hay error de idioma no seleccionado
 * @param {Function} props.setLanguageError - Función para actualizar el estado de error
 * @param {Function} props.onAccept - Callback al aceptar el modal
 * @param {Function} props.onCancel - Callback al cancelar el modal
 * @returns {JSX.Element} Modal de advertencia con selector de idioma e imágenes
 */
const WarningModal = ({
  selectedLanguage,
  setSelectedLanguage,
  selectAllImages,
  setSelectAllImages,
  languageError,
  setLanguageError,
  onAccept,
  onCancel
}) => {
  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold text-white/90 mb-4">Advertencia</h3>
      <div className="space-y-4">
        <p className="text-white/75 text-sm">
          Esta herramienta tomará como referencia las anotaciones de la capa anterior.
        </p>
        <div className="space-y-3">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            languageError={languageError}
            setLanguageError={setLanguageError}
            availableLanguages={AVAILABLE_LANGUAGES}
          />
          <div className="mb-6">
            <label className="text-white/75 text-sm block mb-2">Seleccionar imágenes a escanear:</label>
            <select
              value={selectAllImages}
              onChange={(e) => setSelectAllImages(e.target.value === "true")}
              className="w-full p-2 bg-transparent text-white rounded-md border border-gray-700 focus:outline-none focus:border-[#4a90e2]"
            >
              <option value="true">Todas las imágenes</option>
              <option value="false">Imagen actual</option>
            </select>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-center space-x-4">
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
