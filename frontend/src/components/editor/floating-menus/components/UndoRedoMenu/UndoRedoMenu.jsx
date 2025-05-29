import { useState, useRef } from 'react';
import useInitializeLayerStates from './handlers/useInitializeLayerStates';
import useLayerHistory from './handlers/fabricHistoryManager';
import enumFloatingMenus from '../../handlers/enumFloatingMenus';
import useMeasureFloatingMenu from '../useMeasureFloatingMenu';

export default function UndoRedoMenu() {
    const [isVisible, setIsVisible] = useState(true);
    useInitializeLayerStates();
    
    const { undo, redo } = useLayerHistory();
    const scaleFactor = Math.max(0.75, Math.min(1, window.innerHeight / 952));
    const scaledPadding = Math.max(4, 8 * scaleFactor);
    const scaledButtonSize = Math.max(20, 32 * scaleFactor);
    const scaledCloseButtonSize = Math.max(20, 28 * scaleFactor);
    const scaledIconSize = scaledButtonSize * 0.9;
    const scaledHiddenButtonSize = Math.min(34, Math.max(30, 34 * scaleFactor));

    const buttonRef = useRef(null);
    const menuRef = useRef(null);
    
    useMeasureFloatingMenu(
        isVisible ? menuRef : buttonRef, 
        enumFloatingMenus.UndoRedoMenu
    );

    return (
        <>
            {!isVisible ? (
                <button
                    ref={buttonRef}
                    onClick={() => setIsVisible(true)}
                    id="show-undo-redo"
                    style={{
                        /* REMOVIDO: top */
                        zIndex: 50,
                        width: `${scaledHiddenButtonSize}px`,
                        height: `${scaledHiddenButtonSize}px`,
                        backgroundColor: '#2a2a2a',
                        borderRadius: '6px',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        transition: 'background-color 0.2s ease-in-out',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#357abd')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2a2a2a')}
                    title="Show undo/redo controls"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        style={{ width: `16px`, height: `16px`, display: 'block' }}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M3 7v6h6"></path>
                        <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
                    </svg>
                </button>
            ) : (
                <div
                    ref={menuRef}
                    id="undo-redo-menu"
                    style={{
                        /* REMOVIDO: top */
                        zIndex: 50,
                        backgroundColor: '#2a2a2a',
                        borderRadius: '6px',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        padding: `${scaledPadding}px`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: `${scaledPadding}px`,
                    }}
                >
                    <button
                        onClick={undo}
                        style={{
                            padding: `${scaledPadding - 2}px`,
                            width: `${scaledButtonSize}px`,
                            height: `${scaledButtonSize}px`,
                            borderRadius: '4px',
                            transition: 'background-color 200ms',
                            backgroundColor: 'transparent',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.5)')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        title="Undo"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            style={{ width: `${scaledIconSize}px`, height: `${scaledIconSize}px` }}
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M3 7v6h6"></path>
                            <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
                        </svg>
                    </button>

                    <button
                        onClick={redo}
                        style={{
                            padding: `${scaledPadding - 2}px`,
                            width: `${scaledButtonSize}px`,
                            height: `${scaledButtonSize}px`,
                            borderRadius: '4px',
                            transition: 'background-color 200ms',
                            backgroundColor: 'transparent',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.5)')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        title="Redo"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            style={{ width: `${scaledIconSize}px`, height: `${scaledIconSize}px` }}
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 7v6h-6"></path>
                            <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"></path>
                        </svg>
                    </button>

                    <div style={{ borderLeft: '1px solid rgba(55, 65, 81, 0.5)', marginLeft: `${scaledPadding}px`, paddingLeft: `${scaledPadding}px` }}>
                        <button
                            onClick={() => setIsVisible(false)}
                            style={{
                                padding: `${scaledPadding - 2}px`,
                                width: `${scaledCloseButtonSize}px`,
                                height: `${scaledCloseButtonSize}px`,
                                borderRadius: '4px',
                                transition: 'background-color 200ms',
                                backgroundColor: 'transparent',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.5)')}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            title="Close controls"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                style={{ width: `${scaledCloseButtonSize * 0.9}px`, height: `${scaledCloseButtonSize * 0.9}px` }}
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}