import React, { useEffect, useState } from 'react';
import { useEditorStore } from '../../../../../../stores/editorStore';
import useLayerHistory from '../../../../floating-menus/UndoRedoMenu/handlers/fabricHistoryManager';
import FontFamilySelector from './components/FontFamilySelector/FontFamilySelector';
import SizeLineHeightControls from './components/SizeLineHeightControls';
import ColorControls from './components/ColorControls';
import StyleAlignmentControls from './components/StyleAlignmentControls';
import RotationControls from './components/RotationControls';
import UppercaseLowercaseControls from './components/UppercaseLowercaseControls';
import {
    handleFontStyleChange,
    handleAlignmentChange,
    handleSizeInput,
    handleArrowKeys,
    handleFillColorChange,
    handleStrokeColorChange,
    handleStrokeToggle,
    handleStrokeWidthChange,
    handleFontSizeButtonChange,
    handleLineHeightButtonChange,
    handleStrokeWidthButtonChange,
    handleSizeChange,
    handleLineHeightChange,
} from './handlers/textSettingsHandlers';

const TextSettings = () => {
    const { getCanvasInstance, activeImageIndex } = useEditorStore();
    const [fabricCanvas, setFabricCanvas] = useState(null);
    const [textObject, setTextObject] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const { saveState } = useLayerHistory();
    const [fontFamily, setFontFamily] = useState('Arial');
    const [fontSize, setFontSize] = useState('16');
    const [lineHeight, setLineHeight] = useState('1.0');
    const [strokeWidth, setStrokeWidth] = useState('0');
    const [hasStroke, setHasStroke] = useState(false);
    const [fillColor, setFillColor] = useState('#000000');
    const [strokeColor, setStrokeColor] = useState('#000000');
    const [fontStyles, setFontStyles] = useState({
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false,
    });
    const [uppercase, setUppercase] = useState(false);
    const [lowercase, setLowercase] = useState(false);
    const [alignment, setAlignment] = useState('left');

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const canvas = getCanvasInstance(activeImageIndex);
        setTextObject(canvas.getActiveObject());
        setFabricCanvas(canvas);
        updateSelectedObject();
    }, [activeImageIndex, getCanvasInstance]);

    const updateSelectedObject = () => {
        const canvas = getCanvasInstance(activeImageIndex);
        if (!canvas) return; 
        let activeObject = null;
        if (canvas.getActiveObject()){
            activeObject = canvas.getActiveObject();
        }else if (textObject){
            activeObject = textObject;
        }
        
        if (activeObject && activeObject.type === 'textbox') {
            setTextObject(activeObject);
            setFontFamily(activeObject.fontFamily || 'Arial');
            setFontSize(String(activeObject.fontSize || '16'));
            setLineHeight(String(activeObject.lineHeight || '1.0'));
            setStrokeWidth(String(activeObject.strokeWidth || '0'));
            setHasStroke(!!activeObject.stroke);
            setFillColor(activeObject.fill || '#000000');
            setStrokeColor(activeObject.stroke || '#000000');
            setFontStyles({
                bold: activeObject.fontWeight === 'bold',
                italic: activeObject.fontStyle === 'italic',
                underline: activeObject.underline,
                strikethrough: activeObject.linethrough
            });
            setAlignment(activeObject.textAlign || 'left');
            const text = activeObject.text;
            const isOnlyNumeric = /^\d+$/.test(text);
            const isUppercase = text === text.toUpperCase() && !isOnlyNumeric;
            const isLowercase = text === text.toLowerCase() && !isOnlyNumeric;
            setUppercase(isUppercase);
            setLowercase(isLowercase);
        } else {
            setTextObject(null);
            setFontFamily('Arial');
            setFontSize('16');
            setLineHeight('1.0');
            setStrokeWidth('0');
            setHasStroke(false);
            setUppercase(false);
            setLowercase(false);
            setFillColor('#000000');
            setStrokeColor('#000000');
            setFontStyles({
                bold: false,
                italic: false,
                underline: false,
                strikethrough: false
            });
            setAlignment('left');
        }
    };

    useEffect(() => {
        if (!fabricCanvas) return; 
        fabricCanvas.on('selection:created', updateSelectedObject);
        fabricCanvas.on('selection:updated', updateSelectedObject);
        fabricCanvas.on('selection:cleared', updateSelectedObject);

        return () => {
            fabricCanvas.off('selection:created', updateSelectedObject);
            fabricCanvas.off('selection:updated', updateSelectedObject);
            fabricCanvas.off('selection:cleared', updateSelectedObject);
        };
    }, [fabricCanvas]);

    const handleFontStyleToggle = (style) => {
        const newStyles = {
            ...fontStyles,
            [style]: !fontStyles[style]
        };
        setFontStyles(newStyles);

        if (textObject) {
            switch (style) {
                case 'bold':
                    handleFontStyleChange('bold', newStyles.bold, textObject, fabricCanvas, saveState);
                    break;
                case 'italic':
                    handleFontStyleChange('italic', newStyles.italic, textObject, fabricCanvas, saveState);
                    break;
                case 'underline':
                    handleFontStyleChange('underline', newStyles.underline, textObject, fabricCanvas, saveState);
                    break;
                case 'strikethrough':
                    handleFontStyleChange('strikethrough', newStyles.strikethrough, textObject, fabricCanvas, saveState);
                    break;
                default:
                    break;
            }
        }
    };

    const handleAlignmentSelect = (align) => {
        setAlignment(align);
        if (textObject) {
            handleAlignmentChange(align, textObject, fabricCanvas, saveState);
        }
    };

    const shouldStack = windowWidth < 1300;
    const buttonBaseStyle = "text-white text-sm rounded-md p-2";
    const buttonInactiveStyle = "bg-[#2a2a2a] hover:bg-[#3a3a3a]";
    const buttonActiveStyle = "bg-blue-600 hover:bg-blue-700";

    return (
        <div className="space-y-2 w-full max-h-full text-white rounded-lg bg-[#1a1a1a] p-2">
            <FontFamilySelector
                fontFamily={fontFamily}
                setFontFamily={setFontFamily}
                textObject={textObject}
                fabricCanvas={fabricCanvas}
            />
            <SizeLineHeightControls
                fontSize={fontSize}
                setFontSize={setFontSize}
                lineHeight={lineHeight}
                setLineHeight={setLineHeight}
                textObject={textObject}
                fabricCanvas={fabricCanvas}
                handleSizeInput={(e, handler, setValue) => handleSizeInput(e, handler, setValue, textObject, fabricCanvas)}
                handleArrowKeys={(e, currentValue, setValue, handler, isFontSize) => handleArrowKeys(e, currentValue, setValue, handler, textObject, fabricCanvas, isFontSize)}
                handleFontSizeButtonChange={(isUp, currentValue, setValue, handler) => handleFontSizeButtonChange(isUp, currentValue, setValue, handler, textObject, fabricCanvas, saveState)}
                handleLineHeightButtonChange={(isUp, currentValue, setValue, handler) => handleLineHeightButtonChange(isUp, currentValue, setValue, handler, textObject, fabricCanvas, saveState)}
                handleSizeChange={(value, textObject, fabricCanvas, setValue) => handleSizeChange(value, textObject, fabricCanvas, setValue, saveState)}
                handleLineHeightChange={(value, textObject, fabricCanvas, setValue) => handleLineHeightChange(value, textObject, fabricCanvas, setValue, saveState)}
            />
            <ColorControls
                fillColor={fillColor}
                setFillColor={setFillColor}
                strokeColor={strokeColor}
                setStrokeColor={setStrokeColor}
                strokeWidth={strokeWidth}
                setStrokeWidth={setStrokeWidth}
                hasStroke={hasStroke}
                setHasStroke={setHasStroke}
                textObject={textObject}
                fabricCanvas={fabricCanvas}
                handleSizeInput={(e, handler, setValue) => handleSizeInput(e, handler, setValue, textObject, fabricCanvas)}
                handleArrowKeys={(e, currentValue, setValue, handler, isFontSize) => handleArrowKeys(e, currentValue, setValue, handler, textObject, fabricCanvas, isFontSize)}
                handleFillColorChange={(value) => handleFillColorChange(value, textObject, fabricCanvas, setFillColor, saveState)}
                handleStrokeColorChange={(value) => handleStrokeColorChange(value, textObject, fabricCanvas, setStrokeColor, hasStroke, saveState)}
                handleStrokeToggle={(enabled) => handleStrokeToggle(enabled, textObject, fabricCanvas, setHasStroke, strokeColor, saveState)}
                handleStrokeWidthChange={(value) => handleStrokeWidthChange(value, textObject, fabricCanvas, setStrokeWidth, saveState)}
                handleStrokeWidthButtonChange={(isUp, currentValue, setValue, handler) => handleStrokeWidthButtonChange(isUp, currentValue, setValue, handler, textObject, fabricCanvas, saveState)}
            />
            <StyleAlignmentControls
                fontStyles={fontStyles}
                alignment={alignment}
                handleFontStyleToggle={handleFontStyleToggle}
                handleAlignmentSelect={handleAlignmentSelect}
                shouldStack={shouldStack}
                buttonBaseStyle={buttonBaseStyle}
                buttonInactiveStyle={buttonInactiveStyle}
                buttonActiveStyle={buttonActiveStyle}
            />
            <UppercaseLowercaseControls
                uppercase={uppercase}
                setUppercase={setUppercase}
                lowercase={lowercase}
                setLowercase={setLowercase}
                textObject={textObject}
                fabricCanvas={fabricCanvas}
                buttonBaseStyle={buttonBaseStyle}
                buttonInactiveStyle={buttonInactiveStyle}
                buttonActiveStyle={buttonActiveStyle}
            />
            <RotationControls
                textObject={textObject}
                fabricCanvas={fabricCanvas}
                buttonBaseStyle={buttonBaseStyle}
                buttonInactiveStyle={buttonInactiveStyle}
            />
        </div>
    );
};

export default TextSettings;
