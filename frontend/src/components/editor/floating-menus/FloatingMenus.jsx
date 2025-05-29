import React, { useMemo } from "react";
import UndoRedoMenu from "./components/UndoRedoMenu/UndoRedoMenu";
import Layers from "./components/Layers";
import ZoomControls from "./components/ZoomControls";
import ToggleConfigButton from "./components/ToggleConfigButton";
import { useCanvasZoom } from "../canvas/handlers/useCanvasZoom";
import { useEditorStore } from "../../../stores/editorStore";
import { useState, useEffect, useCallback } from "react";
import enumFloatingMenus from "./handlers/enumFloatingMenus";

const FloatingMenus = () => {
    const zoomControls = useCanvasZoom();
    const [toolbarWidth, setToolbarWidth] = useState(50);
    const [canvasWidth, setCanvasWidth] = useState(window.innerWidth - toolbarWidth);
    const { headerHeight, floatingMenusSizes } = useEditorStore();
    
    // Estado para rastrear altura del header
    const [headerHeightValue, setHeaderHeightValue] = useState(80);
    
    const menuList = useMemo(() => [
        { id: enumFloatingMenus.UndoRedoMenu, Component: UndoRedoMenu },
        { id: enumFloatingMenus.Layers, Component: Layers },
        { id: enumFloatingMenus.ZoomControls, 
            Component: ({ top }) => <ZoomControls {...zoomControls} /> 
        },
        { id: enumFloatingMenus.ToggleConfigButton, Component: ToggleConfigButton }
    ], []);

    // Calcular posiciones verticales
    const positions = useMemo(() => {
        const gap = 5;
        let top = 5;
        const newPositions = {};
        
        for (const { id } of menuList) {
            const size = floatingMenusSizes[id] || { height: 0 };
            newPositions[id] = top;
            top += size.height + gap;
        }

        return newPositions;
    }, [floatingMenusSizes, menuList]);

    // Manejar resize usando ResizeObserver para mayor precisión
    useEffect(() => {
        const handleResize = () => {
            const toolbar = document.getElementById('toolbar');
            const editor = document.getElementById('div_editor');
            if (toolbar && editor) {
                setToolbarWidth(toolbar.offsetWidth);
                setCanvasWidth(editor.offsetWidth);
            }
        };

        handleResize();
        const resizeObserver = new ResizeObserver(handleResize);
        
        const toolbar = document.getElementById('toolbar');
        const editor = document.getElementById('div_editor');
        if (toolbar) resizeObserver.observe(toolbar);
        if (editor) resizeObserver.observe(editor);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    // Observador para header height
    useEffect(() => {
        const header = document.getElementById('alturaHeader');
        if (!header) return;

        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                setHeaderHeightValue(entry.contentRect.height);
            }
        });

        observer.observe(header);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            className="fixed"
            style={{
                top: `${headerHeightValue + 5}px`,
                left: `${canvasWidth + toolbarWidth}px`,
                zIndex: 50,
            }}
        >
            {menuList.map(({ id, Component }) => (
                <div
                    key={id}
                    style={{
                        position: 'absolute',
                        right: 5,
                        top: `${positions[id] || 0}px`,
                        transition: 'top 0.2s ease-in-out', 
                    }}
                    className="flex justify-end"
                    
                >
                    <Component />
                </div>
            ))}
        </div>
    );
};

export default FloatingMenus;
