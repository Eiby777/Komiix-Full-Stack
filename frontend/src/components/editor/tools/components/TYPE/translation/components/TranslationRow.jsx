import React from 'react';
import { ChevronUp, Eye, EyeOff } from 'lucide-react';
import { useEditorStore } from '../../../../../../../stores/editorStore';

const TranslationRow = ({
  item,
  selectedId,
  toggleUsed,
  toggleRow,
  selectRow,
  expandedRows,
  selectedColor,
  updateTextboxType,
  getConfigTypeTexts,
  getCanvasInstance,
  setConfigTypeTexts,
  activeImageIndex,
}) => {
  const { colorToTypeTextMap } = useEditorStore();
  
  const typeToColorMap = Object.fromEntries(
    Object.entries(colorToTypeTextMap).map(([color, type]) => [type, color])
  );

  const isColorSelected = selectedColor !== 'gray';
  const isChecked = !!item.typeText && item.typeText === colorToTypeTextMap[selectedColor];
  const backgroundColor = item.typeText ? typeToColorMap[item.typeText] : 'gray';

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    const newTypeText = checked ? colorToTypeTextMap[selectedColor] : null;
    updateTextboxType(item.id, newTypeText);

    if (checked) {
      const configTypeTexts = getConfigTypeTexts();
      const typeConfig = configTypeTexts[newTypeText];

      const canvas = getCanvasInstance(activeImageIndex);
      if (!canvas) {
        return;
      }

      const textboxes = canvas.getObjects().filter((obj) => obj.type === 'textbox');
      const textbox = textboxes.find((obj) => obj.id === item.id);
      if (!textbox) {
        return;
      }

      const propertiesToApply = [
        'fontSize',
        'fontFamily',
        'lineHeight',
        'fill',
        'stroke',
        'textAlign',
        'underline',
        'strikethrough',
        'italic',
        'bold',
        'strokeWidth',
        'uppercase',
        'lowercase',
      ];
      
      const isTypeConfigEmpty = !typeConfig || Object.keys(typeConfig).length === 0;

      if (isTypeConfigEmpty) {
        const updatedConfig = {};
        propertiesToApply.forEach((prop) => {
          let value;
          if (prop === 'bold') {
            value = textbox.fontWeight === 'bold';
          } else if (prop === 'italic') {
            value = textbox.fontStyle === 'italic';
          } else if (prop === 'strikethrough') {
            value = textbox.linethrough;
          } else if (prop === 'uppercase') {
            value = textbox.text && textbox.text === textbox.text.toUpperCase() && textbox.text !== textbox.text.toLowerCase();
          } else if (prop === 'lowercase') {
            value = textbox.text && textbox.text === textbox.text.toLowerCase() && textbox.text !== textbox.text.toUpperCase();
          } else {
            value = textbox[prop];
          }
          if (value !== undefined && value !== null) {
            updatedConfig[prop] = value;
          }
        });

        setConfigTypeTexts((draft) => {
          draft[newTypeText] = updatedConfig;
        });

        propertiesToApply.forEach((prop) => {
          if (updatedConfig[prop] !== undefined && updatedConfig[prop] !== null) {
            if (prop === 'bold') {
              textbox.set('fontWeight', updatedConfig[prop] ? 'bold' : 'normal');
            } else if (prop === 'italic') {
              textbox.set('fontStyle', updatedConfig[prop] ? 'italic' : 'normal');
            } else if (prop === 'strikethrough') {
              textbox.set('linethrough', updatedConfig[prop]);
            } else if (prop === 'uppercase') {
              textbox.set('text', updatedConfig[prop] ? textbox.text.toUpperCase() : textbox.text);
            } else if (prop === 'lowercase') {
              textbox.set('text', updatedConfig[prop] ? textbox.text.toLowerCase() : textbox.text);
            } else {
              textbox.set(prop, updatedConfig[prop]);
            }
          }
        });
      } else {
        propertiesToApply.forEach((prop) => {
          if (typeConfig[prop] !== undefined && typeConfig[prop] !== null) {
            if (prop === 'bold') {
              textbox.set('fontWeight', typeConfig[prop] ? 'bold' : 'normal');
            } else if (prop === 'italic') {
              textbox.set('fontStyle', typeConfig[prop] ? 'italic' : 'normal');
            } else if (prop === 'strikethrough') {
              textbox.set('linethrough', typeConfig[prop]);
            } else if (prop === 'uppercase') {
              textbox.set('text', typeConfig[prop] ? textbox.text.toUpperCase() : textbox.text);
            } else if (prop === 'lowercase') {
              textbox.set('text', typeConfig[prop] ? textbox.text.toLowerCase() : textbox.text);
            } else {
              textbox.set(prop, typeConfig[prop]);
            }
          }
        });
      }

      textbox.setCoords();
      if (canvas.getActiveObject() === textbox) {
        canvas.setActiveObject(textbox);
      }
      canvas.requestRenderAll();
      canvas.renderAll();
    }

    e.stopPropagation();
  };

  const handleRowClick = (e) => {
    if (!e.target.closest('button') && e.target.type !== 'checkbox') {
      selectRow(item.id);
    }
  };

  return (
    <div className="flex items-center w-full" onClick={handleRowClick}>
      <div
        className="grid grid-cols-[1fr_auto] items-center p-2 rounded-md flex-grow cursor-pointer"
        style={{
          backgroundColor: backgroundColor,
          color: '#ffffff',
          opacity: item.used ? 1 : 0.5,
          transition: 'background-color 0.3s ease-in-out, opacity 0.3s ease-in-out',
          outline: selectedId === item.id ? '2px solid white' : 'none',
        }}
      >
        <div
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          <span className="text-xs">{item.translatedText}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleUsed(item.id)}
            className="p-1 hover:bg-white/20 rounded-full transition-all duration-200 ease-in-out"
          >
            {item.used ? (
              <Eye className="w-4 h-4 transition-transform duration-200 ease-in-out hover:scale-110" />
            ) : (
              <EyeOff className="w-4 h-4 transition-transform duration-200 ease-in-out hover:scale-110" />
            )}
          </button>
          <button
            onClick={() => toggleRow(item.id)}
            className="p-1 hover:bg-white/20 rounded-full transition-all duration-200 ease-in-out"
          >
            <ChevronUp
              className={`w-4 h-4 transform transition-transform duration-200 ease-in-out ${
                expandedRows[item.id] || selectedId === item.id ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>
      {isColorSelected && (
        <div className="ml-2 flex items-center">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-white bg-gray-100 border-gray-300 rounded focus:ring-white"
          />
        </div>
      )}
    </div>
  );
};

export default TranslationRow;