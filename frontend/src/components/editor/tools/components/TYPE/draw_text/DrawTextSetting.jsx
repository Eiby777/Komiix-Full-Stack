import React, { useRef, useState } from 'react';
import CanvasInitializer from './components/CanvasInitializer';
import LanguageSelector from './components/LanguageSelector';
import OcrToggle from './components/OcrToggle';
import TextDisplay from './components/TextDisplay';
import { useDrawingHandlers } from './components/handlers/drawingHandlers';
import { useEditorStore } from '../../../../../../stores/editorStore';

/**
 * @file DrawTextSettings.jsx
 * @description Main component for text drawing and OCR settings in the editor
 * @returns {JSX.Element} The DrawTextSettings component
 */

export default function DrawTextSettings() {
  const { getCanvasInstance, activeImageIndex, dimensionImages, images } = useEditorStore();
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const [language, setLanguage] = useState('eng');
  const [isOcrActive, setIsOcrActive] = useState(false);
  const [predictedText, setPredictedText] = useState('');

  useDrawingHandlers({
    fabricCanvasRef,
    isOcrActive,
    getCanvasInstance,
    activeImageIndex,
    dimensionImages,
    images,
    language,
    setPredictedText
  });

  return (
    <div className="p-4 text-gray-300 rounded-lg shadow-md h-full flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <LanguageSelector language={language} setLanguage={setLanguage} />
        <OcrToggle isOcrActive={isOcrActive} setIsOcrActive={setIsOcrActive} />
      </div>

      <div className="flex-grow">
        <CanvasInitializer
          canvasRef={canvasRef}
          fabricCanvasRef={fabricCanvasRef}
        />
      </div>

      <TextDisplay 
      predictedText={predictedText} 
      setPredictedText={setPredictedText}
      fabricCanvasRef={fabricCanvasRef}
       />
    </div>
  );
}