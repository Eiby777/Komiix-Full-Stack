import { FaCog } from 'react-icons/fa';

export default function ToggleConfigButton({
    settingsButtonRef,
    toggleSettingsPanel,
    topPositionIcons,
    configIconsPositions,
    settingsButtonSize
}) {
    return (
        <button
            ref={settingsButtonRef}
            onClick={toggleSettingsPanel}
            style={{
                position: 'fixed',
                top: topPositionIcons,
                right: configIconsPositions.settingsIcon.right,
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