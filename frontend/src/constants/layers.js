export const LAYERS = {
  ORIGINAL: {
    id: 'original',
    label: 'Original',
    icon: 'InboxIcon',
    description: 'Base manga image layer',
    backgroundColor: 'transparent', 
    editable: false,
    visible: true,
    opacity: 1.0
  },
  ANNOTATION: {
    id: 'annotation',
    label: 'Anotación',
    icon: 'AnnotationIcon',
    description: 'Speech bubble and panel annotations',
    editable: true,
    visible: true,
    opacity: 1.0
  },
  CLEANUP: {
    id: 'cleanup',
    label: 'Limpieza',
    icon: 'BanIcon',
    description: 'Image cleanup and retouching',
    editable: true,
    visible: true,
    opacity: 1.0
  },
  TEXT: {
    id: 'text',
    label: 'Traducción',
    icon: 'TranslateIcon',
    description: 'Translated text placement',
    editable: true,
    visible: true,
    opacity: 1.0
  },
  OUTPUT: {
    id: 'output',
    label: 'Salida',
    icon: 'ExternalLinkIcon',
    description: 'Final composition preview',
    editable: false,
    visible: true,
    opacity: 1.0
  }
}

export const LAYER_ORDER = [
  LAYERS.ORIGINAL.id,
  LAYERS.ANNOTATION.id,
  LAYERS.CLEANUP.id,
  LAYERS.TEXT.id,
  LAYERS.OUTPUT.id
]

export const DEFAULT_LAYER_STATES = {
  [LAYERS.ORIGINAL.id]: {
    visible: true,
    opacity: 1.0
  },
  [LAYERS.ANNOTATION.id]: {
    visible: true,
    opacity: 1.0
  },
  [LAYERS.CLEANUP.id]: {
    visible: true,
    opacity: 1.0
  },
  [LAYERS.TEXT.id]: {
    visible: true,
    opacity: 1.0
  },
  [LAYERS.OUTPUT.id]: {
    visible: true,
    opacity: 1.0
  }
}
