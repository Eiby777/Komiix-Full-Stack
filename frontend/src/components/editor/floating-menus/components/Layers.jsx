import { useRef } from 'react';
import { useEditorStore } from '../../../../stores/editorStore';
import { LAYERS } from '../../../../constants/layers';
import {
  InboxIcon,
  AnnotationIcon,
  BanIcon,
  TranslateIcon,
  ExternalLinkIcon
} from '@heroicons/react/outline';
import enumFloatingMenus from '../handlers/enumFloatingMenus';
import { useMeasureFloatingMenu } from './useMeasureFloatingMenu';

const iconMap = {
  InboxIcon: InboxIcon,
  AnnotationIcon: AnnotationIcon,
  BanIcon: BanIcon,
  TranslateIcon: TranslateIcon,
  ExternalLinkIcon: ExternalLinkIcon
};

export default function LayersPanel() {
  const {
    activeLayer,
    setActiveLayer,
    isLayerCarouselVisible,
    setLayerCarouselVisible,
    getCanvasInstance,
    activeImageIndex,
    setCanvasObjectStatus
  } = useEditorStore();

  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  // Scaling based on window height (standard: 952px)
  const scaleFactor = Math.max(0.75, Math.min(1, window.innerHeight / 952));
  const scaledPadding = Math.max(4, 8 * scaleFactor); // Base: 8px
  const scaledButtonSize = Math.max(39, 52 * scaleFactor); // Base: 52px (height of layer buttons)
  const scaledIconSize = Math.max(15, 20 * scaleFactor); // Base: 20px (layer button icons)
  const scaledTextSize = Math.max(9, 12 * scaleFactor); // Base: 12px (text-xs)
  const scaledCloseButtonSize = Math.max(20, 28 * scaleFactor); // Base: 28px
  const scaledMainButtonSize = Math.max(24, 32 * scaleFactor); // Base: 32px (estimated)
  const scaledMainIconSize = Math.max(12, 16 * scaleFactor); // Base: 16px
  const scaledHiddenButtonSize = Math.min(34, Math.max(30, 34 * scaleFactor));

  useMeasureFloatingMenu(
    isLayerCarouselVisible ? panelRef : buttonRef,
    enumFloatingMenus.Layers
  );

  const handleLayerChange = (layerId) => {
    const canvas = getCanvasInstance(activeImageIndex);
    const objects = canvas.getObjects();

    const imageObjects = objects.filter(object => object.type === 'image');
    const rectObjects = objects.filter(object => object.type === 'rect');
    const textObjects = objects.filter(object => object.type === 'textbox');
    if (imageObjects.length > 1 || rectObjects.length > 0 || textObjects.length > 0) {
      setCanvasObjectStatus(activeImageIndex, true);
    } else {
      setCanvasObjectStatus(activeImageIndex, false);
    }

    setActiveLayer(layerId);
  };

  if (!isLayerCarouselVisible) {
    return (
      <button
        ref={buttonRef}
        onClick={() => setLayerCarouselVisible(true)}
        style={{
          zIndex: 50,
          width: `${scaledHiddenButtonSize}px`,
          height: `${scaledHiddenButtonSize}px`,
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
        title="Show layer controls"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          style={{ width: `16px`, height: `16px` }}
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </button>
    );
  }

  return (
    <div
      ref={panelRef}
      style={{
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: `${scaledPadding}px`,
        backgroundColor: '#2a2a2a',
        borderRadius: '0.375rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(55, 65, 81, 0.5)',
        color: 'white',
        transition: 'background-color 600ms',
        padding: `${scaledPadding}px`,
      }}
    >
      <div className="flex items-center space-x-2 bg-[#2a2a2a] rounded-md border border-gray-700/50">
        <div className="flex" style={{ gap: `${scaledPadding / 2}px` }}>
          {Object.values(LAYERS).map(layer => {
            const IconComponent = iconMap[layer.icon];
            return (
              <button
                key={layer.id}
                onClick={() => handleLayerChange(layer.id)}
                style={{
                  padding: `${scaledPadding / 2}px`,
                  height: `${scaledButtonSize}px`,
                  borderRadius: '0.25rem',
                  transition: 'background-color 200ms',
                }}
                className={`transition-all ${activeLayer === layer.id
                    ? 'bg-[#4a90e2] text-white'
                    : 'text-white hover:bg-gray-700/50'
                  }`}
              >
                <div className="flex flex-col items-center" style={{ gap: `${scaledPadding / 2}px` }}>
                  <IconComponent style={{ width: `${scaledIconSize}px`, height: `${scaledIconSize}px` }} />
                  <span style={{ fontSize: `${scaledTextSize}px` }}>{layer.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ borderLeft: '1px solid rgba(55, 65, 81, 0.5)', marginLeft: `${scaledPadding}px`, paddingLeft: `${scaledPadding}px` }}>
        <button
          onClick={() => setLayerCarouselVisible(false)}
          style={{
            padding: `${scaledPadding / 2}px`,
            width: `${scaledCloseButtonSize}px`,
            height: `${scaledCloseButtonSize}px`,
            borderRadius: '0.25rem',
            transition: 'background-color 200ms',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          className="hover:bg-gray-700/50 transition-colors duration-200"
          title="Close layer controls"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            style={{ width: `16px`, height: `16px` }}
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
  );
}