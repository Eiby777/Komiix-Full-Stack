import { handleUppercase, handleLowercase } from '../handlers/textSettingsHandlers';
import useLayerHistory from '../../../../../floating-menus/components/UndoRedoMenu/handlers/fabricHistoryManager';

const UppercaseLowercaseControls = ({
    uppercase, setUppercase, lowercase, setLowercase, textObject, fabricCanvas, buttonBaseStyle, buttonInactiveStyle, buttonActiveStyle
}) => {
    const { saveState } = useLayerHistory();
    return (
        <div className="flex justify-center space-x-2">
            <button
                onClick={() => handleUppercase(
                    textObject,
                    fabricCanvas,
                    setUppercase,
                    setLowercase,
                    uppercase,
                    saveState
                )}
                className={`${buttonBaseStyle} ${uppercase ? buttonActiveStyle : buttonInactiveStyle}`}
                title="Uppercase"
            >
                AA
            </button>
            <button
                onClick={() => handleLowercase(
                    textObject,
                    fabricCanvas,
                    setLowercase,
                    setUppercase,
                    lowercase,
                    saveState
                )}
                className={`${buttonBaseStyle} ${lowercase ? buttonActiveStyle : buttonInactiveStyle}`}
                title="Lowercase"
            >
                aa
            </button>
        </div>
    );
};

export default UppercaseLowercaseControls;
