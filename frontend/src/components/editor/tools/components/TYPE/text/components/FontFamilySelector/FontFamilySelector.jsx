import React, { useState, useEffect } from 'react';
import { FaFont } from 'react-icons/fa';
import Select from 'react-select';
import { handleFontChange } from '../../handlers/textSettingsHandlers';
import { fetchFontList, fetchFontFile } from '../../../../../../../../hooks/fontApi';
import {
  saveFontList,
  getFontList,
  saveFontFile,
  getFontFile,
  updateFontFile,
  checkFontVersion,
  deleteFontList,
  cleanupOldFonts
} from '../../../../../../../../lib/localDB/fontDB';
import { useEditorStore } from '../../../../../../../../stores/editorStore';
import useLayerHistory from '../../../../../../floating-menus/components/UndoRedoMenu/handlers/fabricHistoryManager';

const FontFamilySelector = ({ fontFamily, setFontFamily, textObject, fabricCanvas }) => {
  const [fontOptions, setFontOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { saveState } = useLayerHistory();
  const { canvasInstances, setAllCanvasObjectStatus } = useEditorStore();

  useEffect(() => {
    const loadFonts = async () => {
      try {
        setLoading(true);
        let fonts = await getFontList();
        if (!fonts) {
          fonts = await fetchFontList();
          await saveFontList(fonts);
        }
        const options = fonts
          .map(font => ({
            value: font.id,
            label: font.name,
            fontName: font.name,
            version: font.version || '1.0'
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
        setFontOptions(options);
      } catch (error) {
        console.error('Error loading font list:', error);
      } finally {
        setLoading(false);
      }
    };

    const cleanup = async () => {
      try {
        const deleted = await cleanupOldFonts();
        if (deleted > 0) {
          console.log(`Cleaned up ${deleted} old fonts`);
        }
      } catch (error) {
        console.error('Error during font cleanup:', error);
      }
    };

    loadFonts();
    cleanup();
  }, []);

  const escapeFontName = (name) => {
    if (/[\s!"#$%&'()*+,.\/:;<=>?@\[\]\\^`{|}~]/.test(name)) {
      return `'${name.replace(/'/g, "\\'")}'`;
    }
    return name;
  };

  // Función para convertir blob a base64 data URL con MIME correcto
  const blobToBase64 = async (blob) => {
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const binaryString = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('');
    const base64 = btoa(binaryString);
    return `data:font/woff2;base64,${base64}`;
  };

  const loadFontFromBlob = async (fontName, fontBlob) => {
    const escapedFontName = escapeFontName(fontName);

    try {
      // Verificar si la fuente ya está cargada en el DOM
      const existingFont = Array.from(document.fonts).find(font =>
        font.family === escapedFontName || font.family === fontName
      );

      if (existingFont && existingFont.status === 'loaded') {
        console.log('Font already loaded in DOM:', fontName);
        return escapedFontName;
      }

      // Asegurarse de que el blob tenga el MIME type correcto
      const fontBlobWithType = new Blob([fontBlob], { type: 'font/woff2' });
      const blobUrl = URL.createObjectURL(fontBlobWithType);

      try {
        // Crear FontFace con el formato especificado
        const fontFace = new FontFace(
          escapedFontName,
          `url(${blobUrl})`,
          {
            display: 'swap', // Mejora la carga
            weight: 'normal',
            style: 'normal'
          }
        );

        // Agregar y cargar la fuente
        document.fonts.add(fontFace);
        await fontFace.load();

        console.log('Font loaded successfully from local storage:', fontName);

        // NO revocar el blob URL inmediatamente - esperar a que se use
        // URL.revokeObjectURL(blobUrl); // ← Comentar esta línea

        return escapedFontName;

      } catch (fontFaceError) {
        // Si falla con Blob URL, intentar con base64 como fallback
        console.warn('Blob URL failed, trying base64:', fontFaceError);
        URL.revokeObjectURL(blobUrl);

        const base64Data = await blobToBase64(fontBlobWithType);
        const fontFace = new FontFace(
          escapedFontName,
          `url(${base64Data})`,
          { display: 'swap' }
        );

        document.fonts.add(fontFace);
        await fontFace.load();

        return escapedFontName;
      }

    } catch (error) {
      console.error('Error loading font from blob:', error);
      throw error;
    }
  };

  const updateCanvasObjectStatus = () => {
    const currentObjectStatus = canvasInstances.map(canvas =>
      canvas.getObjects().some(object => object.type === 'textbox')
    );
    setAllCanvasObjectStatus(currentObjectStatus);
    return currentObjectStatus;
  };

  const handleChange = async (selectedOption) => {
    if (!selectedOption || !textObject) return;

    const fontName = selectedOption.fontName;
    const requiredVersion = selectedOption.version || '1.0';

    console.log('Loading font:', fontName, 'version:', requiredVersion);

    try {
      setLoading(true);

      // Paso 1: Verificar si existe localmente y si la versión es correcta
      const versionCheck = await checkFontVersion(fontName, requiredVersion);

      let fontBlob;
      let finalFontName;

      if (versionCheck.exists && !versionCheck.needsUpdate) {
        // La fuente existe localmente y está actualizada
        console.log('Using cached font:', fontName);
        const localFont = await getFontFile(fontName);
        fontBlob = localFont.blob;
      } else {
        // Necesitamos descargar la fuente
        console.log('Fetching font from server:', fontName);
        const fetchedBlob = await fetchFontFile(fontName);

        // Guardar o actualizar en la base de datos local
        if (versionCheck.exists) {
          await updateFontFile(fontName, fetchedBlob, requiredVersion);
        } else {
          await saveFontFile(fontName, fetchedBlob, requiredVersion);
        }

        fontBlob = fetchedBlob;
      }

      // Paso 2: Cargar la fuente en el DOM
      finalFontName = await loadFontFromBlob(fontName, fontBlob);

      const canvasObjectStatus = await updateCanvasObjectStatus();
      // Paso 3: Aplicar la fuente al objeto de texto
      await handleFontChange(finalFontName, textObject, fabricCanvas, setFontFamily, saveState, canvasInstances, canvasObjectStatus);

      // Paso 4: Actualizar el estado
      setFontFamily(fontName);

      console.log('Font change completed successfully:', fontName);

    } catch (error) {
      console.error('Error in font change process:', error);

      // Fallback: intentar usar la fuente sin cargarla
      try {
        const fallbackFontName = escapeFontName(fontName);
        await handleFontChange(fallbackFontName, textObject, fabricCanvas, setFontFamily, saveState);
        setFontFamily(fontName);
        console.log('Applied font as fallback:', fallbackFontName);
      } catch (fallbackError) {
        console.error('Fallback font application also failed:', fallbackError);
        // En caso de error total, mantener la fuente anterior
      }
    } finally {
      setLoading(false);
    }
  };

  // Limpiar fuentes DOM no utilizadas (opcional, para optimización de memoria)
  const cleanupDOMFonts = () => {
    const loadedFonts = Array.from(document.fonts);
    loadedFonts.forEach(font => {
      // Solo eliminar fuentes que nunca se cargaron exitosamente
      if (font.status === 'unloaded' || font.status === 'error') {
        document.fonts.delete(font);
      }
    });
  };

  // Limpiar fuentes DOM cada minuto
  useEffect(() => {
    const cleanup = setInterval(cleanupDOMFonts, 60000);
    return () => clearInterval(cleanup);
  }, []);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      '--primary': 'none',
      backgroundColor: '#2a2a2a',
      borderColor: 'rgba(255,255,255,0.1)',
      padding: '2px',
      borderRadius: '0.375rem',
      outline: state.isFocused ? 'none' : 'none',
      border: state.isFocused ? 0 : 0,
      boxShadow: 'none',
      '&:hover': {
        borderColor: 'rgba(255,255,255,0.2)'
      }
    }),
    input: (provided) => ({
      ...provided,
      color: 'white',
      fontSize: '0.875rem'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'white',
      fontSize: '0.875rem'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'rgba(255,255,255,0.5)',
      fontSize: '0.875rem'
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#2a2a2a',
      borderRadius: '0.375rem',
      marginTop: '4px'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3a3a3a' : '#2a2a2a',
      color: 'white',
      fontSize: '0.875rem',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#3a3a3a'
      }
    }),
    menuList: (provided) => ({
      ...provided,
      backgroundColor: '#2a2a2a',
      borderRadius: '0.375rem'
    })
  };

  const normalizeFontName = (name) => {
    if (!name) return '';
    return name.replace(/^['"]|['"]$/g, '').trim();
  };

  const selectedOption = fontOptions.find(option =>
    normalizeFontName(option.fontName) === normalizeFontName(fontFamily)
  ) || null;

  return (
    <div className="flex items-center w-full gap-1 sm:gap-2 min-w-0" title="Font Family">
      <style>
        {`
          .font-selector__input input::selection,
          .font-selector__single-value::selection {
            background: rgba(255, 255, 255, 0.2);
            color: white;
          }
          .font-selector__single-value {
            color: white !important;
          }
        `}
      </style>
      <FaFont className="text-gray-400 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
      <Select
        options={fontOptions}
        value={selectedOption}
        onChange={handleChange}
        styles={customStyles}
        isLoading={loading}
        placeholder="Select font..."
        className="flex-1 min-w-0 text-xs sm:text-sm"
        classNamePrefix="font-selector"
        isSearchable={true}
        components={{
          DropdownIndicator: null
        }}
        menuPortalTarget={document.body}
      />
    </div>
  );
};

export default FontFamilySelector;