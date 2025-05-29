import React, { useState, useEffect } from 'react';
import { FaFont } from 'react-icons/fa';
import Select from 'react-select';
import { handleFontChange } from '../../handlers/textSettingsHandlers';
import { fetchFontList, fetchFontFile } from '../../../../../../../../hooks/fontApi';
import { saveFonts, getFontList } from '../../../../../../../../lib/localDB/fontDB';
import useLayerHistory from '../../../../../../floating-menus/UndoRedoMenu/handlers/fabricHistoryManager';

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
        const options = fonts.map(font => ({
          value: font.id,
          label: font.name,
          fontName: font.name
        }));
        setFontOptions(options);
      } catch (error) {
        console.error('Error loading font list:', error);
      } finally {
        setLoading(false);
      }
    };
    loadFonts();
  }, []);

  const handleChange = async (selectedOption) => {
    const fontName = selectedOption.fontName;
    setFontFamily(fontName);
    
    try {
      setLoading(true);
      const fontData = await fetchFontFile(fontName);
      
      // Create a Blob from the font data
      const fontBlob = new Blob([fontData], { type: 'font/woff2' });
      const fontUrl = URL.createObjectURL(fontBlob);
      
      // Create dynamic @font-face rule
      const fontFace = `
        @font-face {
          font-family: "${fontName}";
          src: url(${fontUrl}) format('woff2');
        }
      `;
      
      // Add the font-face to the document
      const styleSheet = document.createElement('style');
      styleSheet.textContent = fontFace;
      document.head.appendChild(styleSheet);
      
      // Wait for the font to load before applying it
      await document.fonts.load(`16px "${fontName}"`);
      
      // Apply the font to the text object
      handleFontChange(fontName, textObject, fabricCanvas, setFontFamily, saveState);
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

  return (
    <div className="flex items-center w-full gap-1 sm:gap-2 min-w-0" title="Font Family">
  <style>
    {`
      .font-selector__input input::selection,
      .font-selector__single-value::selection {
        background: rgba(255, 255, 255, 0.2);
        color: white;
      }
    `}
  </style>
  <FaFont className="text-gray-400 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
  <Select
    options={fontOptions}
    value={fontOptions.find(option => option.fontName === fontFamily) || null}
    onChange={handleChange}
    styles={customStyles}
    isLoading={loading}
    placeholder="Select font..."
    className="flex-1 min-w-0 text-xs sm:text-sm"
    classNamePrefix="font-selector"
  />
</div>
  );
};

export default FontFamilySelector;