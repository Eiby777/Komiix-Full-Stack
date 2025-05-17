import { useState, useEffect } from 'react';
import { Undo as UndoIcon, Redo as RedoIcon, X } from 'lucide-react';
import { useEditorStore } from '../../../../stores/editorStore';
import useInitializeLayerStates from './handlers/useInitializeLayerStates'
import useLayerHistory from './handlers/fabricHistoryManager';

export default function UndoRedoMenu() {
  const [isVisible, setIsVisible] = useState(true);
  const { isLayerCarouselVisible, configIconsPositions, setConfigIconsPositions, isSettingsVisible } = useEditorStore();
  useInitializeLayerStates();
  
  const { undo, redo } = useLayerHistory();

  useEffect(() => {
    setConfigIconsPositions('undoRedoIcon', 
      { ...configIconsPositions.undoRedoIcon, active: !isVisible })
  }, [isVisible])

  return (
    <>
      {!isVisible ? (
        <button
          onClick={() => setIsVisible(true)}
          id="show-undo-redo"
          style={{
            position: 'fixed',
            top: isLayerCarouselVisible ? configIconsPositions.undoRedoIcon.top : '12rem',
            right: isSettingsVisible ? configIconsPositions.undoRedoIcon.right : '10%',
            zIndex: 50,
            padding: '0.557rem',
            backgroundColor: '#2a2a2a',
            borderRadius: '0.5rem',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            transition: 'background-color 0.2s ease-in-out',
            ':hover': {
              backgroundColor: '#357abd',
            },
          }}

          title="Show undo/redo controls"
        >
          <UndoIcon className="w-4 h-4" />
        </button>
      ) : (
        <div
          id="undo-redo-menu"
          style={{
            position: 'fixed',
            right: isSettingsVisible ? configIconsPositions.undoRedoIcon.right : '10%',
            zIndex: 50,
            backgroundColor: '#2a2a2a',
            borderRadius: '0.5rem',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            padding: '0.5rem',
            top: isLayerCarouselVisible ? configIconsPositions.undoRedoIcon.top : '12rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <button
            onClick={undo}
            className="p-1.5 rounded-md text-white hover:bg-gray-700/50 transition-all"
            title="Undo"
          >
            <UndoIcon className="w-5 h-5" />
          </button>

          <button
            onClick={redo}
            className="p-1.5 rounded-md text-white hover:bg-gray-700/50 transition-all"
            title="Redo"
          >
            <RedoIcon className="w-5 h-5" />
          </button>

          <div className="border-l border-gray-700/50 ml-2 pl-2">
            <button
              onClick={() => setIsVisible(false)}
              className="p-1.5 rounded-md hover:bg-gray-700/50 transition-colors duration-200"
              title="Close controls"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
