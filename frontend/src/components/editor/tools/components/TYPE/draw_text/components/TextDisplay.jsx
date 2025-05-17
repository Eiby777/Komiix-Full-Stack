import React, { useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import { useCanvasHandlers } from './handlers/canvasHandlers';

/**
 * @file TextDisplay.jsx
 * @description Component for displaying and editing OCR detected text with auto-adjusting height
 * @param {Object} props
 * @param {string} props.predictedText - Text detected by OCR
 * @param {function} props.setPredictedText - Function to update the detected text
 * @returns {JSX.Element} Text display area with reset button
 */

export default function TextDisplay({ predictedText, setPredictedText }) {
  const { resetCanvas } = useCanvasHandlers();
  const textareaRef = useRef(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(textarea.scrollHeight, 80)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [predictedText]);

  const handleTextChange = (e) => {
    setPredictedText(e.target.value);
  };

  return (
    <div className="flex items-center gap-2">
      <textarea
        ref={textareaRef}
        value={predictedText}
        onChange={handleTextChange}
        placeholder="Texto detectado..."
        className="w-full p-1.5 rounded-md bg-[#2a2a2a] text-white border border-white/10 focus:outline-none focus:border-white/30 text-sm transition-all duration-200 ease-in-out resize-none"
        style={{ minHeight: '80px' }}
      />
      <button
        onClick={resetCanvas}
        className="p-1.5 rounded-md bg-[#2a2a2a] hover:bg-red-600 text-white transition-all duration-200 ease-in-out flex-shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}