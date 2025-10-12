import React, { useState, useEffect } from 'react';
import { FaFont } from 'react-icons/fa';
import Select from 'react-select';
import { handleFontChange } from '../../handlers/textSettingsHandlers';
import { fetchFontList, getFontUrl } from '../../../../../../../../hooks/fontApi';
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
        // Fetch font list directly from API, no local caching
        const fonts = await fetchFontList();
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

    loadFonts();
  }, []);

  const escapeFontName = (name) => {
    if (/[\s!"#$%&'()*+,.\/:;<=>?@\[\]\\^`{|}~]/.test(name)) {
      return `'${name.replace(/'/g, "\\'")}'`;
    }
    return name;
  };

  const loadFontFromUrl = async (fontName, fontUrl) => {
    const escapedFontName = escapeFontName(fontName);

    try {
      // Check if font already loaded in DOM
      const existingFont = Array.from(document.fonts).find(font =>
        font.family === escapedFontName || font.family === fontName
      );

      if (existingFont && existingFont.status === 'loaded') {
        console.log('Font already loaded in DOM:', fontName);
        return escapedFontName;
      }

      // Create FontFace with backend URL
      const fontFace = new FontFace(
        escapedFontName,
        `url(${fontUrl})`,
        {
          display: 'swap',
          weight: 'normal',
          style: 'normal'
        }
      );

      // Add and load the font
      document.fonts.add(fontFace);
      await fontFace.load();

      console.log('Font loaded successfully from URL:', fontName);
      return escapedFontName;

    } catch (error) {
      console.error('Error loading font from URL:', error);
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

    console.log('Loading font:', fontName);

    try {
      setLoading(true);

      // Get font URL from backend
      const fontUrl = await getFontUrl(fontName);
      
      // Load font via CSS @font-face
      const finalFontName = await loadFontFromUrl(fontName, fontUrl);

      const canvasObjectStatus = await updateCanvasObjectStatus();
      // Apply font to canvas object
      await handleFontChange(finalFontName, textObject, fabricCanvas, setFontFamily, saveState, canvasInstances, canvasObjectStatus);

      // Update state
      setFontFamily(fontName);

      console.log('Font change completed successfully:', fontName);

    } catch (error) {
      console.error('Error in font change process:', error);

      // Fallback: try to use the font without loading it
      try {
        const fallbackFontName = escapeFontName(fontName);
        await handleFontChange(fallbackFontName, textObject, fabricCanvas, setFontFamily, saveState);
        setFontFamily(fontName);
        console.log('Applied font as fallback:', fallbackFontName);
      } catch (fallbackError) {
        console.error('Fallback font application also failed:', fallbackError);
        // In case of total error, keep the previous font
      }
    } finally {
      setLoading(false);
    }
  };

  // Clean up unused DOM fonts (optional, for memory optimization)
  const cleanupDOMFonts = () => {
    const loadedFonts = Array.from(document.fonts);
    loadedFonts.forEach(font => {
      // Only remove fonts that never loaded successfully
      if (font.status === 'unloaded' || font.status === 'error') {
        document.fonts.delete(font);
      }
    });
  };

  // Clean up DOM fonts every minute
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