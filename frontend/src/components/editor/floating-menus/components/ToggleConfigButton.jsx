import { FaCog } from 'react-icons/fa';
import { useRef, useState, useEffect } from 'react';
import { useMeasureFloatingMenu } from './useMeasureFloatingMenu';
import enumFloatingMenus from '../handlers/enumFloatingMenus';
import { useEditorStore } from '../../../../stores/editorStore';

export default function ToggleConfigButton() {
    const settingsButtonRef = useRef(null);
    const [settingsButtonSize, setSettingsButtonSize] = useState(34);
    const { isSettingsVisible, setIsSettingsVisible } = useEditorStore();

    useMeasureFloatingMenu(
        settingsButtonRef,
        enumFloatingMenus.ToggleConfigButton
    );

    const calculateButtonSize = () => {
        const baseSize = 34;
        const minSize = 30;
        const scaleFactor = Math.max(0.7, Math.min(1, window.innerHeight / 952));
        return Math.max(minSize, baseSize * scaleFactor);
    };

    useEffect(() => {
        const updateSize = () => setSettingsButtonSize(calculateButtonSize());
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const toggleSettingsPanel = () => {
        setIsSettingsVisible(!isSettingsVisible);
    }

    return (

        <button
            ref={settingsButtonRef}
            onClick={toggleSettingsPanel}
            style={{
                position: 'fixed',
                zIndex: 50,
                width: `${settingsButtonSize}px`,
                height: `${settingsButtonSize}px`,
                backgroundColor: '#2a2a2a',
                borderRadius: '0.375rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid rgba(55, 65, 81, 0.5)',
                color: 'white',
                transition: 'background-color 600ms',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            className="hover:bg-[#357abd]"
            title="Toggle settings panel"
        >
            <FaCog className="w-[16px] h-[16px]" />
        </button>
    )
}