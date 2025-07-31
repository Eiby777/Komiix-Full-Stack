import React, { useState, useEffect } from 'react';
import { FaFont } from 'react-icons/fa';
import Select from 'react-select';
import { handleFontChange } from '../../handlers/textSettingsHandlers';
import { fetchFontList, fetchFontFile } from '../../../../../../../../hooks/fontApi';
import { saveFonts, getFontList } from '../../../../../../../../lib/localDB/fontDB';
import useLayerHistory from '../../../../../../floating-menus/components/UndoRedoMenu/handlers/fabricHistoryManager';

const FontFamilySelector = ({ fontFamily, setFontFamily, textObject, fabricCanvas }) => {
  const [fontOptions, setFontOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { saveState } = useLayerHistory();

  useEffect(() => {
    const loadFonts = async () => {
      try {
        setLoading(true);
        let fonts = await getFontList();
        if (!fonts) {
          fonts = await fetchFontList();
          await saveFonts(fonts);
        }
        const options = fonts
          .map(font => ({
            value: font.id,
            label: font.name,
            fontName: font.name
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
    // If the font name contains any of these characters, wrap it in quotes
    if (/[\s!"#$%&'()*+,.\/:;<=>?@\[\]\\^`{|}~]/.test(name)) {
      return `'${name.replace(/'/g, "\\'")}'`;
    }
    return name;
  };

  const handleChange = async (selectedOption) => {
    if (!selectedOption || !textObject) return;
    
    const fontName = selectedOption.fontName;
    const escapedFontName = escapeFontName(fontName);
    console.log('Loading font:', fontName, 'Escaped as:', escapedFontName);
    
    try {
      setLoading(true);
      
      // Load the font file
      const fontData = await fetchFontFile(fontName);
      const fontBlob = new Blob([fontData], { type: 'font/woff2' });
      const fontUrl = URL.createObjectURL(fontBlob);
      
      // Create a new FontFace instance with escaped font name
      const fontFace = new FontFace(escapedFontName, `url(${fontUrl})`);
      
      // Add it to the document.fonts
      document.fonts.add(fontFace);
      
      // Wait for the font to load
      await fontFace.load();

      fabricCanvas.renderAll();
      
      // Now apply the font to the text object using the escaped font name
      await handleFontChange(escapedFontName, textObject, fabricCanvas, setFontFamily, saveState);

      fabricCanvas.renderAll();
      
      // Update the font family state after successful load
      setFontFamily(fontName);
      
    } catch (error) {
      console.error('Error loading font:', error);
    } finally {
      setLoading(false);
    }
  };

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

  // Normalize font names by removing quotes for comparison
  const normalizeFontName = (name) => {
    if (!name) return '';
    // Remove single or double quotes from the beginning and end
    return name.replace(/^['"]|['"]$/g, '').trim();
  };

  // Find the current selected option based on fontFamily
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