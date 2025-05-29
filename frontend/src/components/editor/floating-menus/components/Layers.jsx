import { useEditorStore } from '../../../../stores/editorStore'
import { LAYERS } from '../../../../constants/layers'
import {
  InboxIcon,
  AnnotationIcon,
  BanIcon,
  TranslateIcon,
  ExternalLinkIcon
} from '@heroicons/react/outline'
import { X, Layers } from 'lucide-react'

const iconMap = {
  InboxIcon: InboxIcon,
  AnnotationIcon: AnnotationIcon,
  BanIcon: BanIcon,
  TranslateIcon: TranslateIcon,
  ExternalLinkIcon: ExternalLinkIcon
}

export default function LayersPanel() {
  const { 
    activeLayer, 
    setActiveLayer, 
    isLayerCarouselVisible, 
    setLayerCarouselVisible, 
    getCanvasInstance, 
    activeImageIndex, 
    setCanvasObjectStatus,
  } = useEditorStore()

  if (!isLayerCarouselVisible) {
    return (
      <button
        onClick={() => setLayerCarouselVisible(true)}
        style={{
          position: 'fixed',
          zIndex: 50,
          padding: '0.5rem',
          backgroundColor: '#2a2a2a',
          borderRadius: '0.375rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(55, 65, 81, 0.5)',
          color: 'white',
          transition: 'background-color 600ms'
        }}
        className="hover:bg-[#357abd]"
        title="Show layer controls"
      >
        <Layers className="w-4 h-4" />
      </button>
    )
  }

  const handleLayerChange = (layerId) => {
    const canvas = getCanvasInstance(activeImageIndex)
    const objects = canvas.getObjects()

    const imageObjects = objects.filter(object => object.type === 'image')
    const rectObjects = objects.filter(object => object.type === 'rect')
    const textObjects = objects.filter(object => object.type === 'textbox')
    if (imageObjects.length > 1 || rectObjects.length > 0 || textObjects.length > 0) {
      setCanvasObjectStatus(activeImageIndex, true)
    }
    else {
      setCanvasObjectStatus(activeImageIndex, false)
    }
    
    setActiveLayer(layerId);
  };
  return (
    <div style={{
      position: 'fixed',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      backgroundColor: '#2a2a2a',
      borderRadius: '0.375rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: '1px solid rgba(55, 65, 81, 0.5)',
      color: 'white',
      transition: 'background-color 600ms'
    }}>
      <div className="flex items-center space-x-2 p-2 bg-[#2a2a2a] rounded-md shadow-lg border border-gray-700/50">
        <div className="flex space-x-2">
          {Object.values(LAYERS).map(layer => {
            const IconComponent = iconMap[layer.icon]
            return (
              <button
                key={layer.id}
                onClick={() => handleLayerChange(layer.id)}
                className={`p-1.5 rounded-md transition-all ${activeLayer === layer.id
                  ? 'bg-[#4a90e2] text-white'
                  : 'text-white hover:bg-gray-700/50'
                  }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <IconComponent className="w-5 h-5" />
                  <span className="text-xs">{layer.label}</span>
                </div>
              </button>
            )
          })}
        </div>

        <div className="border-l border-gray-700/50 ml-2 pl-2">
          <button
            onClick={() => setLayerCarouselVisible(false)}
            className="p-1.5 rounded-md hover:bg-gray-700/50 transition-colors duration-200"
            title="Close layer controls"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
