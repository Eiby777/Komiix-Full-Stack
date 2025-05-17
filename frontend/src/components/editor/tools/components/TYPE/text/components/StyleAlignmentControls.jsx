import React from 'react';
import {
  FaBold, FaItalic, FaUnderline, FaStrikethrough,
  FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify
} from 'react-icons/fa';

const StyleAlignmentControls = ({
  fontStyles, alignment, handleFontStyleToggle, handleAlignmentSelect, shouldStack, buttonBaseStyle,
  buttonInactiveStyle, buttonActiveStyle
}) => (
  <div className={`w-full flex ${shouldStack ? 'flex-col items-center' : 'flex-row'} justify-center gap-4`}>
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          onClick={() => handleFontStyleToggle('bold')}
          className={`${buttonBaseStyle} ${fontStyles.bold ? buttonActiveStyle : buttonInactiveStyle}`}
          title="Bold"
        >
          <FaBold />
        </button>
        <button
          onClick={() => handleFontStyleToggle('italic')}
          className={`${buttonBaseStyle} ${fontStyles.italic ? buttonActiveStyle : buttonInactiveStyle}`}
          title="Italic"
        >
          <FaItalic />
        </button>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => handleFontStyleToggle('underline')}
          className={`${buttonBaseStyle} ${fontStyles.underline ? buttonActiveStyle : buttonInactiveStyle}`}
          title="Underline"
        >
          <FaUnderline />
        </button>
        <button
          onClick={() => handleFontStyleToggle('strikethrough')}
          className={`${buttonBaseStyle} ${fontStyles.strikethrough ? buttonActiveStyle : buttonInactiveStyle}`}
          title="Strikethrough"
        >
          <FaStrikethrough />
        </button>
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          onClick={() => handleAlignmentSelect('left')}
          className={`${buttonBaseStyle} ${alignment === 'left' ? buttonActiveStyle : buttonInactiveStyle}`}
          title="Align Left"
        >
          <FaAlignLeft />
        </button>
        <button
          onClick={() => handleAlignmentSelect('center')}
          className={`${buttonBaseStyle} ${alignment === 'center' ? buttonActiveStyle : buttonInactiveStyle}`}
          title="Align Center"
        >
          <FaAlignCenter />
        </button>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => handleAlignmentSelect('right')}
          className={`${buttonBaseStyle} ${alignment === 'right' ? buttonActiveStyle : buttonInactiveStyle}`}
          title="Align Right"
        >
          <FaAlignRight />
        </button>
        <button
          onClick={() => handleAlignmentSelect('justify')}
          className={`${buttonBaseStyle} ${alignment === 'justify' ? buttonActiveStyle : buttonInactiveStyle}`}
          title="Justify"
        >
          <FaAlignJustify />
        </button>
      </div>
    </div>
  </div>
);

export default StyleAlignmentControls;