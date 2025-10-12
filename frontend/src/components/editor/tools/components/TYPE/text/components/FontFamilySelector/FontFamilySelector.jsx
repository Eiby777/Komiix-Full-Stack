import React, { useState, useEffect } from 'react';
import { FaFont } from 'react-icons/fa';
import Select from 'react-select';
import { handleFontChange } from '../../handlers/textSettingsHandlers';
import { fetchFontList, getFontUrl } from '../../../../../../../../hooks/fontApi';
import { useEditorStore } from '../../../../../../../../stores/editorStore';
import useLayerHistory from '../../../../../../floating-menus/components/UndoRedoMenu/handlers/fabricHistoryManager';
import fontManager from '../../../../../../../../lib/fontManager';

const FontFamilySelector = ({ fontFamily, setFontFamily, textObject, fabricCanvas }) => {
  const [fontOptions, setFontOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { saveState } = useLayerHistory();
  const { canvasInstances, setAllCanvasObjectStatus } = useEditorStore();

  useEffect(() => {
    const loadFonts = async () => {
      try {
        setLoading(true);
        // Fetch font list directly from API - IDs only for management
        const fonts = await fetchFontList();
        const options = fonts
          .map(font => ({
            value: font.id,        // ID for management
            label: font.name,      // Name for display only
            fontId: font.id,       // Keep ID reference
            fontName: font.name    // Keep name for compatibility
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

  const loadFontFromCache = async (fontId) => {
    console.info('Loading font from cache:', fontId);

    try {

      const loadedFontId = await fontManager.loadFont(fontId);

      console.log('Font loaded successfully from cache:', fontId);
      return loadedFontId;

    } catch (error) {
      console.error('Error loading font from cache:', fontId, error);
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

    const fontId = selectedOption.value; // ID for management
    const fontName = selectedOption.label; // Name for display only

    console.log('Loading font by ID:', fontId, 'Display name:', fontName);

    try {
      setLoading(true);

      // Load font using FontManager (handles caching automatically)
      const finalFontId = await loadFontFromCache(fontId);

      const canvasObjectStatus = await updateCanvasObjectStatus();
      // Apply font to canvas object using ID as font family
      await handleFontChange(finalFontId, textObject, fabricCanvas, setFontFamily, saveState, canvasInstances, canvasObjectStatus);

      // Store ONLY fontId in the text object - names are unreliable
      textObject.set('fontId', fontId);

      // Update state with display name for UI
      setFontFamily(fontName);

      console.log('Font change completed successfully - ID:', fontId);

    } catch (error) {
      console.error('Error in font change process for ID:', fontId, error);

      // Fallback: try to use the font without loading it
      try {
        await handleFontChange(fontId, textObject, fabricCanvas, setFontFamily, saveState);
        setFontFamily(fontName);
        console.log('Applied font as fallback:', fontId);
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

  // Find selected option by fontId only - names are unreliable
  const selectedOption = textObject && textObject.fontId
    ? fontOptions.find(option => option.value === textObject.fontId) || null
    : null;

  // ID-based selection only - no name comparisons

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