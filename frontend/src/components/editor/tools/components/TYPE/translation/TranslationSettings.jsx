import React, { useEffect, useRef, useState } from 'react';
import FilterControls from './components/FilterControls';
import TranslationRow from './components/TranslationRow';
import EditPanel from './components/EditPanel/EditPanel';
import ColorTypeSelector from './components/ColorTypeSelector';
import { useEditorStore } from '../../../../../../stores/editorStore';
import { generateUniqueId } from './handlers/generateUniqueId';
import { detectTextboxes } from './handlers/detectTextboxes';
import { setupCanvasListeners } from './handlers/setupCanvasListeners';
import { toggleRow } from './handlers/toggleRow';
import { toggleUsed } from './handlers/toggleUsed';
import { updateTextboxType } from './handlers/updateTextboxType';
import { debounce } from './handlers/debounce';
import { debouncedDetectAndTranslate } from './handlers/debouncedDetectAndTranslate';
import { selectRow } from './handlers/selectRow';

const TextboxSettings = ({ index = 0 }) => {
  const { canvasInstances, activeImageIndex, textData, setTextData, getConfigTypeTexts, getCanvasInstance, setConfigTypeTexts } = useEditorStore();
  const canvasRef = useRef(null);

  const colorToTypeMap = {
    gray: 'Ninguno',
    '#4a90e2': 'normal',
    '#ff6b6b': 'scream',
    '#9775fa': 'touched',
    '#69db7c': 'think',
    '#ffa94d': 'sentence',
  };

  const [filterText, setFilterText] = useState('');
  const [expandedRows, setExpandedRows] = useState({});
  const [filterByIndex, setFilterByIndex] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [originalText, setOriginalText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTrackingChanges, setIsTrackingChanges] = useState(false);
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [alternatives, setAlternatives] = useState([]);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const [selectedColor, setSelectedColor] = useState('gray');

  const detectTextboxesHandler = detectTextboxes(generateUniqueId);
  const setupCanvasListenersHandler = setupCanvasListeners(detectTextboxesHandler, setTextData);
  const toggleRowHandler = toggleRow(setExpandedRows);
  const toggleUsedHandler = toggleUsed(index, setTextData, canvasRef);
  const updateTextboxTypeHandler = updateTextboxType(index, setTextData, canvasRef);
  const debouncedDetectAndTranslateHandler = debouncedDetectAndTranslate(
    debounce,
    sourceLang,
    setTranslatedText,
    setAlternatives,
    isTrackingChanges,
    targetLang
  );
  const selectRowHandler = selectRow(
    selectedId,
    setSelectedId,
    setOriginalText,
    setTranslatedText,
    setSourceLang,
    setAlternatives,
    setTextData,
    index,
    canvasRef
  );

  

  useEffect(() => {
    if (isTrackingChanges && selectedId && translatedText) {
      setTextData((currentTextData) => {
        const newData = currentTextData.map((innerArray, i) => {
          if (i === index) {
            return innerArray.map((item) => {
              if (item.id === selectedId) {
                return { ...item, translatedText: translatedText };
              }
              return item;
            });
          }
          return innerArray;
        });
        return newData;
      });

      const canvas = canvasRef.current;
      const activeObj = canvas?.getActiveObject();
      if (activeObj && activeObj.type === 'textbox') {
        activeObj.set('text', translatedText);
        canvas.requestRenderAll();
      }
    }
  }, [translatedText, isTrackingChanges, selectedId, index, setTextData]);

  useEffect(() => {
    if (isTrackingChanges && originalText) {
      debouncedDetectAndTranslateHandler(originalText);
    }

    const canvas = canvasRef.current;
    const activeObj = canvas?.getActiveObject();
    if (activeObj && activeObj.type === 'textbox') {
      activeObj.set({
        cursorWidth: isTextareaFocused ? 0 : 2,
        cursorDelay: isTextareaFocused ? 999999 : 300,
        physics: 300,
        cursorDuration: isTextareaFocused ? 0 : 600,
      });
      canvas.requestRenderAll();
    }
  }, [isTextareaFocused, originalText, isTrackingChanges, debouncedDetectAndTranslateHandler]);

  const filteredData = (textData[index] || []).filter((item) => {
    const translatedText = item.translatedText || '';
    return filterText === '' || translatedText.toLowerCase().includes(filterText.toLowerCase());
  }).sort((a, b) => {
    const selectedType = colorToTypeMap[selectedColor];
    if (!filterText && selectedColor !== 'gray') {
      if (a.typeText === selectedType && b.typeText !== selectedType) return -1;
      if (a.typeText !== selectedType && b.typeText === selectedType) return 1;
      return a.used === b.used ? 0 : a.used ? 1 : -1;
    }
    return a.used === b.used ? 0 : a.used ? 1 : -1;
  });

  return (
    <div className="space-y-2 w-full max-h-full text-white rounded-lg bg-[#1a1a1a] p-2">
      <ColorTypeSelector selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
      <FilterControls
        filterText={filterText}
        setFilterText={setFilterText}
        filterByIndex={filterByIndex}
        setFilterByIndex={setFilterByIndex}
      />
      <div className="space-y-1 w-[98%] mx-auto">
        {filteredData.map((item) => (
          <div key={item.id} style={{ maxWidth: '100%' }}>
            <TranslationRow
              item={item}
              selectedId={selectedId}
              toggleUsed={toggleUsedHandler}
              toggleRow={toggleRowHandler}
              selectRow={selectRowHandler}
              expandedRows={expandedRows}
              selectedColor={selectedColor}
              updateTextboxType={updateTextboxTypeHandler}
              getConfigTypeTexts={getConfigTypeTexts}
              getCanvasInstance={getCanvasInstance}
              activeImageIndex={activeImageIndex}
              setConfigTypeTexts={setConfigTypeTexts}
            />
            {selectedId === item.id && (
              <EditPanel
                originalText={originalText}
                setOriginalText={setOriginalText}
                translatedText={translatedText}
                setTranslatedText={setTranslatedText}
                isTrackingChanges={isTrackingChanges}
                setIsTrackingChanges={setIsTrackingChanges}
                sourceLang={sourceLang}
                setSourceLang={setSourceLang}
                targetLang={targetLang}
                setTargetLang={setTargetLang}
                alternatives={alternatives}
                setAlternatives={setAlternatives}
                canvasRef={canvasRef}
                setIsTextareaFocused={setIsTextareaFocused}
                setTextData={setTextData}
                selectedId={selectedId}
                index={index}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextboxSettings;