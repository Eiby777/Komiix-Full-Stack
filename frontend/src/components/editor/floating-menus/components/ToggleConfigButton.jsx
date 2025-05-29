import { FaCog } from 'react-icons/fa';
import { useRef, useState, useEffect } from 'react';

export default function ToggleConfigButton() {
    const settingsButtonRef = useRef(null);

    const toggleSettingsPanel = () => {
        console.log('Toggle settings panel');
    };
    
    const calculateButtonSize = () => {
        const baseSize = 34; // Size at 952px height
        const minSize = 30;
        const maxSize = 34;
        const scaleFactor = Math.max(0.7, Math.min(1, window.innerHeight / 952));
        const calculatedSize = baseSize * scaleFactor;
        return Math.max(minSize, Math.min(maxSize, calculatedSize));
    };

    const [settingsButtonSize, setSettingsButtonSize] = useState(calculateButtonSize());

    useEffect(() => {
        const updateSize = () => {
            setSettingsButtonSize(calculateButtonSize());
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

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