import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProgressBar({
  headerHeight,
  activeImageIndex,
  totalItems,
  isLoadingImage,
  handlePrevious,
  handleNext,
  inputValue,
  setInputValue,
  handleJump
}) {
  const progress = ((activeImageIndex + 1) / (totalItems || 1)) * 100;

  // Calculate scaling factor based on headerHeight relative to 75px, with a minimum scale of 0.7
  const referenceHeight = 75;
  const scale = Math.max(parseInt(headerHeight) / referenceHeight, 0.7);

  // Base sizes when headerHeight is 75px
  const baseButtonSize = 2; // rem (32px at default font size)
  const baseButtonPadding = 0.5; // rem (8px)
  const baseInputWidth = 4; // rem (64px)
  const baseInputPaddingX = 0.75; // rem (12px)
  const baseInputPaddingY = 0.5; // rem (8px)
  const baseFontSize = 0.875; // rem (14px)
  const baseProgressBarWidth = 18.75; // rem (300px)

  // Scaled sizes
  const buttonSize = `${baseButtonSize * scale}rem`;
  const buttonPadding = `${baseButtonPadding * scale}rem`;
  const inputWidth = `${baseInputWidth * scale}rem`;
  const inputPaddingX = `${baseInputPaddingX * scale}rem`;
  const inputPaddingY = `${baseInputPaddingY * scale}rem`;
  const fontSize = `${baseFontSize * scale}rem`;
  const progressBarWidth = `${baseProgressBarWidth * scale}rem`;
  const iconSize = `${1.5 * scale}rem`; // Base icon size is 1.5rem (24px)

  return (
    <div className="flex items-center">
      <button
        onClick={handlePrevious}
        disabled={activeImageIndex === 0 || isLoadingImage}
        className={`mr-4 rounded-full
          ${activeImageIndex === 0
            ? 'bg-gray-700/50 cursor-not-allowed'
            : 'bg-[#4a90e2] hover:bg-[#357abd] active:bg-[#2d6aa6]'
          }
          transition-all duration-200 ease-in-out flex justify-center items-center`}
        style={{
          width: buttonSize,
          height: buttonSize,
          padding: buttonPadding,
        }}
        aria-label="Previous"
      >
        <ChevronLeft style={{ width: iconSize, height: iconSize }} className="text-white" />
      </button>

      <div className="flex-1">
        <div
          className="flex items-center justify-between mb-2"
          style={{ width: progressBarWidth }}
        >
          <span className="text-white/90 font-medium" style={{ fontSize }}>
            Image {activeImageIndex + 1} of {totalItems}
          </span>
          <span className="text-white/75" style={{ fontSize }}>
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#4a90e2] transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={activeImageIndex === totalItems - 1 || isLoadingImage}
        className={`mx-4 rounded-full
          ${activeImageIndex === totalItems - 1
            ? 'bg-gray-700/50 cursor-not-allowed'
            : 'bg-[#4a90e2] hover:bg-[#357abd] active:bg-[#2d6aa6]'
          }
          transition-all duration-200 ease-in-out flex justify-center items-center`}
        style={{
          width: buttonSize,
          height: buttonSize,
          padding: buttonPadding,
        }}
        aria-label="Next"
      >
        <ChevronRight style={{ width: iconSize, height: iconSize }} className="text-white" />
      </button>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={() => {
          const value = parseInt(inputValue);
          if (!isNaN(value) && value >= 1 && value <= totalItems) {
            handleJump(value - 1);
          } else {
            setInputValue(String(activeImageIndex + 1));
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const value = parseInt(inputValue);
            if (!isNaN(value) && value >= 1 && value <= totalItems) {
              handleJump(value - 1);
            } else {
              setInputValue(String(activeImageIndex + 1));
            }
            e.target.blur();
          }
        }}
        className="px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-md text-white focus:border-[#4a90e2] focus:outline-none"
        style={{
          width: inputWidth,
          paddingLeft: inputPaddingX,
          paddingRight: inputPaddingX,
          paddingTop: inputPaddingY,
          paddingBottom: inputPaddingY,
          fontSize,
        }}
        aria-label="Go to image number"
      />
    </div>
  );
}