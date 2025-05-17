import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProgressBar({
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

  return (
    <div className="flex items-center">
      <button
        onClick={handlePrevious}
        disabled={activeImageIndex === 0 || isLoadingImage}
        className={`mr-4 p-2 rounded-full
          ${activeImageIndex === 0
            ? 'bg-gray-700/50 cursor-not-allowed'
            : 'bg-[#4a90e2] hover:bg-[#357abd] active:bg-[#2d6aa6]'
          }
          transition-all duration-200 ease-in-out`}
        aria-label="Previous"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <div className="flex-1">
        <div className="flex items-center justify-between w-[300px] mb-2">
          <span className="text-white/90 text-sm font-medium">
            Image {activeImageIndex + 1} of {totalItems}
          </span>
          <span className="text-white/75 text-sm">
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
        className={`mx-4 p-2 rounded-full
          ${activeImageIndex === totalItems - 1
            ? 'bg-gray-700/50 cursor-not-allowed'
            : 'bg-[#4a90e2] hover:bg-[#357abd] active:bg-[#2d6aa6]'
          }
          transition-all duration-200 ease-in-out`}
        aria-label="Next"
      >
        <ChevronRight className="w-6 h-6 text-white" />
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
        className="w-16 px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-md text-white text-sm focus:border-[#4a90e2] focus:outline-none"
        aria-label="Go to image number"
      />
    </div>
  );
}