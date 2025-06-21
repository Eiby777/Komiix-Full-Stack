import React, { useCallback, useMemo } from 'react';
import { TRANSLATION_LANGUAGE_OPTIONS } from '../../../../../../../../hooks/languageOptions';
import { useAutoResizeTextarea } from '../../handlers/useAutoResizeTextarea';

// --- Utility Functions ---
// Encapsulating the debounce logic
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// --- Custom Hooks (OOP Principles: Encapsulation, Reusability) ---

/**
 * Custom hook to manage canvas text updates.
 * Encapsulates the logic for finding and updating textboxes on the canvas.
 */
const useCanvasTextUpdater = (canvasRef, selectedId) => {
  const updateCanvasText = useCallback((value, type) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const textboxes = canvas.getObjects().filter((obj) => obj.type === 'textbox' && obj.id === selectedId);
    const textbox = textboxes[0];
    if (textbox) {
      if (type === 'original') {
        textbox.set({ originalText: value });
      } else if (type === 'translated') {
        textbox.set({ text: value, translatedText: value });
      }
      canvas.requestRenderAll();
    }
  }, [canvasRef, selectedId]);

  // Debounce the update function to prevent excessive canvas re-renders
  const debouncedUpdateCanvasOriginal = useMemo(() => debounce((value) => updateCanvasText(value, 'original'), 500), [updateCanvasText]);
  const debouncedUpdateCanvasTranslated = useMemo(() => debounce((value) => updateCanvasText(value, 'translated'), 500), [updateCanvasText]);

  return { debouncedUpdateCanvasOriginal, debouncedUpdateCanvasTranslated };
};

/**
 * Custom hook to handle changes for original text.
 * Encapsulates the state update and canvas synchronization for original text.
 */
const useOriginalTextHandler = (setOriginalText, setTextData, index, selectedId, debouncedUpdateCanvasOriginal) => {
  const handleOriginalTextChange = useCallback((value) => {
    setOriginalText(value);
    setTextData((prev) => {
      const newData = prev.map((innerArray) => [...innerArray]);
      const itemIndex = newData[index]?.findIndex((item) => item.id === selectedId) ?? -1;
      if (itemIndex !== -1) {
        newData[index][itemIndex] = {
          ...newData[index][itemIndex],
          original: value, // Update original text in main data structure
        };
      }
      return newData;
    });
    debouncedUpdateCanvasOriginal(value);
  }, [setOriginalText, setTextData, index, selectedId, debouncedUpdateCanvasOriginal]);

  return handleOriginalTextChange;
};

/**
 * Custom hook to handle changes for translated text.
 * Encapsulates the state update and canvas synchronization for translated text,
 * including alternative selections.
 */
const useTranslatedTextHandler = (setTranslatedText, setAlternatives, setTextData, index, selectedId, debouncedUpdateCanvasTranslated) => {
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
    console.log('Translated text changed:', value);
    debouncedUpdateCanvasTranslated(value);
  }, [index, selectedId, setTextData, setTranslatedText, debouncedUpdateCanvasTranslated]);

  const handleAlternativeSelect = useCallback((alt) => {
    handleTranslatedTextChange(alt); // Use the same logic as direct text change
    setAlternatives([]); // Clear alternatives after selection
  }, [handleTranslatedTextChange, setAlternatives]);

  return { handleTranslatedTextChange, handleAlternativeSelect };
};

// --- React Component ---

const EditPanel = ({
  originalText,
  setOriginalText,
  translatedText,
  setTranslatedText,
  isTrackingChanges,
  setIsTrackingChanges,
  detectedLang,
  setDetectedLang,
  targetLang,
  setTargetLang,
  alternatives,
  setAlternatives,
  canvasRef,
  setIsTextareaFocused,
  setTextData,
  selectedId,
  index,
}) => {
  // Use custom hooks to encapsulate logic
  const { debouncedUpdateCanvasOriginal, debouncedUpdateCanvasTranslated } = useCanvasTextUpdater(canvasRef, selectedId);

  const handleOriginalTextChange = useOriginalTextHandler(
    setOriginalText,
    setTextData,
    index,
    selectedId,
    debouncedUpdateCanvasOriginal
  );

  const { handleTranslatedTextChange, handleAlternativeSelect } = useTranslatedTextHandler(
    setTranslatedText,
    setAlternatives,
    setTextData,
    index,
    selectedId,
    debouncedUpdateCanvasTranslated
  );

  return (
    <div className="mt-2 space-y-3">
      {/* Original Text Section */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <label className="text-white text-xs">Original Text</label>
          <label className="text-white text-xs">Detected:</label>
          <select
            value={detectedLang}
            onChange={(e) => setDetectedLang(e.target.value)}
            className="p-1 rounded-md bg-[#2a2a2a] text-white border border-white/10 focus:outline-none focus:border-white/30 text-xs min-w-[100px] max-w-[150px] truncate"
          >
            {TRANSLATION_LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <textarea
          ref={useAutoResizeTextarea(originalText)}
          value={originalText}
          onChange={(e) => handleOriginalTextChange(e.target.value)}
          onFocus={() => setIsTextareaFocused(true)}
          onBlur={() => setIsTextareaFocused(false)}
          className="w-full p-2 rounded-md bg-[#2a2a2a] text-white border border-white/10 focus:outline-none focus:border-white/30 text-sm resize-none overflow-hidden"
        />
      </div>

      {/* Translated Text Section */}
      <div>
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <label className="text-white text-xs">Translated Text</label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="p-1 rounded-md bg-[#2a2a2a] text-white border border-white/10 focus:outline-none focus:border-white/30 text-xs min-w-[100px] max-w-[150px] truncate"
          >
            {TRANSLATION_LANGUAGE_OPTIONS.map((option) => (
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
            // Restore cursor position after state update
            setTimeout(() => e.target.setSelectionRange(selectionStart, selectionEnd), 0);
          }}
          onFocus={() => setIsTextareaFocused(true)}
          onBlur={() => setIsTextareaFocused(false)}
          className="w-full p-2 rounded-md bg-[#2a2a2a] text-white border border-white/10 focus:outline-none focus:border-white/30 text-sm resize-none overflow-hidden"
        />

        {/* Alternatives Display */}
        {isTrackingChanges && alternatives.length > 0 && (
          <div className="mt-2 space-y-2">
            {alternatives.map((alt, altIndex) => (
              <button
                key={altIndex}
                onClick={() => handleAlternativeSelect(alt)}
                className="w-full p-2 text-left text-white text-sm bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-md transition-colors duration-200 border border-white/10"
              >
                {alt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tracking Changes Toggle */}
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