import React from 'react';

/**
 * @file OcrToggle.jsx
 * @description Component for toggling OCR functionality
 * @param {Object} props
 * @param {boolean} props.isOcrActive - Current OCR activation state
 * @param {function} props.setIsOcrActive - Function to toggle OCR state
 * @returns {JSX.Element} OCR toggle switch
 */

export default function OcrToggle({ isOcrActive, setIsOcrActive }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={isOcrActive}
        onChange={(e) => setIsOcrActive(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-500"></div>
      <span className="absolute w-5 h-5 bg-white rounded-full transition-all left-0.5 top-0.5 peer-checked:translate-x-5"></span>
    </label>
  );
}