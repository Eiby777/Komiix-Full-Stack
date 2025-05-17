import React, { useCallback, useRef } from 'react';
import { LANGUAGE_OPTIONS } from '../TranslationLogic';
import { useAutoResizeTextarea } from '../../handlers/useAutoResizeTextarea';
import { 
  handleOriginalTextChange, 
  handleAlternativeSelect 
} from './handlers/textChanges';

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const EditPanel = ({
  originalText,
  setOriginalText,
  translatedText,
  setTranslatedText,
  isTrackingChanges,
  setIsTrackingChanges,
  detectedLang,
  targetLang,
  setTargetLang,
  alternatives,
  setAlternatives,
  canvasRef,
  setIsTextareaFocused,
  setTextData,
  selectedId,
  index
}) => {
  const debouncedUpdateCanvasOriginal = useRef(null);
  const debouncedUpdateCanvasTranslated = useRef(null);

  const updateCanvasOriginal = useCallback((value) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const textboxes = canvas.getObjects().filter((obj) => obj.type === 'textbox');
      const textbox = textboxes.find((_, i) => i + 1 === selectedId);
      if (textbox) {
        textbox.set({ original: value });
        console.log('Updating original text for textbox:', textbox.original);
        canvas.requestRenderAll();
      }
    }
  }, [canvasRef, selectedId]);

  const updateCanvasTranslated = useCallback((value) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const activeObj = canvas.getObjects().find(obj => obj.id === selectedId);
    if (activeObj && activeObj.type === 'textbox') {
      activeObj.set({ text: value, translatedText: value });
      canvas.requestRenderAll();
    }
  }, [canvasRef, selectedId]);

  if (!debouncedUpdateCanvasOriginal.current) {
    debouncedUpdateCanvasOriginal.current = debounce(updateCanvasOriginal, 500);
  }
  if (!debouncedUpdateCanvasTranslated.current) {
    debouncedUpdateCanvasTranslated.current = debounce(updateCanvasTranslated, 500);
  }

  const handleTranslatedTextChange = useCallback((value) => {
    setTranslatedText(value);
    setTextData((prev) => {
      const newData = prev.map((innerArray) => [...innerArray]);
      const itemIndex = newData[index]?.findIndex((item) => item.id === selectedId) ?? -1;
      if (itemIndex !== -1) {
        newData[index][itemIndex] = {
          ...newData[index][itemIndex],
          translatedText: value,
        };
      }
      return newData;
    });

    debouncedUpdateCanvasTranslated.current(value);
  }, [index, selectedId, setTextData, setTranslatedText]);

  return (
    <div className="mt-2 space-y-3">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <label className="text-white text-xs">Original Text</label>
          <span className="text-white text-xs opacity-70">
            (Detected: {LANGUAGE_OPTIONS.find((opt) => opt.value === detectedLang)?.label || detectedLang})
          </span>
        </div>
        <textarea
          ref={useAutoResizeTextarea(originalText)}
          value={originalText}
          onChange={(e) =>
            handleOriginalTextChange(
              e.target.value,
              index,
              selectedId,
              setTextData,
              setOriginalText,
              debouncedUpdateCanvasOriginal.current
            )
          }
          onFocus={() => setIsTextareaFocused(true)}
          onBlur={() => setIsTextareaFocused(false)}
          className="w-full p-2 rounded-md bg-[#2a2a2a] text-white border border-white/10 focus:outline-none focus:border-white/30 text-sm resize-none overflow-hidden"
        />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <label className="text-white text-xs">Translated Text</label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="p-1 rounded-md bg-[#2a2a2a] text-white border border-white/10 focus:outline-none focus:border-white/30 text-xs min-w-[100px] max-w-[150px] truncate"
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <textarea
          ref={useAutoResizeTextarea(translatedText)}
          value={translatedText}
          onChange={(e) => {
            const { value, selectionStart, selectionEnd } = e.target;
            handleTranslatedTextChange(value);
            setTimeout(() => e.target.setSelectionRange(selectionStart, selectionEnd), 0);
          }}
          onFocus={() => setIsTextareaFocused(true)}
          onBlur={() => setIsTextareaFocused(false)}
          className="w-full p-2 rounded-md bg-[#2a2a2a] text-white border border-white/10 focus:outline-none focus:border-white/30 text-sm resize-none overflow-hidden"
        />
        {isTrackingChanges && alternatives.length > 0 && (
          <div className="mt-2 space-y-2">
            {alternatives.map((alt, altIndex) => (
              <button
                key={altIndex}
                onClick={() =>
                  handleAlternativeSelect(
                    alt,
                    index,
                    selectedId,
                    setTranslatedText,
                    setAlternatives,
                    setTextData,
                    translatedText
                  )
                }
                className="w-full p-2 text-left text-white text-sm bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-md transition-colors duration-200 border border-white/10"
              >
                {alt}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsTrackingChanges((prev) => !prev)}
          className={`relative w-10 h-5 rounded-full transition-all duration-200 ease-in-out ${
            isTrackingChanges ? 'bg-blue-500' : 'bg-gray-600'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${
              isTrackingChanges ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <span className="text-white text-xs">
          {isTrackingChanges ? 'Tracking Changes' : 'Not Tracking'}
        </span>
      </div>
    </div>
  );
};

export default EditPanel;