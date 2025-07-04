import fabric from "../../constants/fabricInstance";
import { LAYERS } from "../../constants/layers";

export const createLayerSlice = (set, get) => ({
  activeLayer: LAYERS.ORIGINAL.id,
  layerStates: {
    [LAYERS.ORIGINAL.id]: [],
    [LAYERS.ANNOTATION.id]: [],
    [LAYERS.CLEANUP.id]: [],
    [LAYERS.TEXT.id]: [],
    [LAYERS.OUTPUT.id]: [],
  },
  layerRedoStates: {
    [LAYERS.ORIGINAL.id]: [],
    [LAYERS.ANNOTATION.id]: [],
    [LAYERS.CLEANUP.id]: [],
    [LAYERS.TEXT.id]: [],
    [LAYERS.OUTPUT.id]: [],
  },
  layersToInitialize: [LAYERS.ANNOTATION.id, LAYERS.CLEANUP.id, LAYERS.TEXT.id],
  getLayerStateHistory: (
    activeImageIndex = get().activeImageIndex,
    activeLayer = get().activeLayer
  ) => {
    return get().layerStates[activeLayer]?.[activeImageIndex] || [];
  },
  getLayerStateRedoHistory: (
    activeImageIndex = get().activeImageIndex,
    activeLayer = get().activeLayer
  ) => {
    return get().layerRedoStates[activeLayer]?.[activeImageIndex] || [];
  },

  getMaskStateHistory: (
    activeImageIndex = get().activeImageIndex,
    activeLayer = get().activeLayer
  ) => {
    return get().maskLayerStates[activeLayer]?.[activeImageIndex] || [];
  },

  getMaskStateRedoHistory: (
    activeImageIndex = get().activeImageIndex,
    activeLayer = get().activeLayer
  ) => {
    return get().maskLayerRedoStates[activeLayer]?.[activeImageIndex] || [];
  },

  maskLayerStates: {
    [LAYERS.ORIGINAL.id]: [],
    [LAYERS.ANNOTATION.id]: [],
    [LAYERS.CLEANUP.id]: [],
    [LAYERS.TEXT.id]: [],
    [LAYERS.OUTPUT.id]: [],
  },
  maskLayerRedoStates: {
    [LAYERS.ORIGINAL.id]: [],
    [LAYERS.ANNOTATION.id]: [],
    [LAYERS.CLEANUP.id]: [],
    [LAYERS.TEXT.id]: [],
    [LAYERS.OUTPUT.id]: [],
  },

  setMaskLayerState: (layer, index, newHistory) =>
    set((state) => {
      if (!state.maskLayerStates[layer]) {
        state.maskLayerStates[layer] = [];
      }
      while (state.maskLayerStates[layer].length <= index) {
        state.maskLayerStates[layer].push([]);
      }
      state.maskLayerStates[layer][index] = newHistory;
    }),
  
  setMaskLayerRedoState: (layer, index, newHistory) =>
    set((state) => {
      if (!state.maskLayerRedoStates[layer]) {
        state.maskLayerRedoStates[layer] = [];
      }
      while (state.maskLayerRedoStates[layer].length <= index) {
        state.maskLayerRedoStates[layer].push([]);
      }
      state.maskLayerRedoStates[layer][index] = newHistory;
    }),
  
  
  MASK: {
    id: "mask",
    label: "Mask",
    description: "Mask for redraw",
    editable: true,
    visible: true,
    opacity: 1.0,
  },
  
  setLayerOpacity: (layerState) => {
    const canvasWithObjects = get().getAllCanvasObjectStatus();
    get().canvasInstances.forEach((canvas, index) => {
      if (!canvasWithObjects[index]) {
        return;
      }
      const activeObject = canvas.getActiveObject();
      canvas.getObjects().forEach((object) => {
        if (!(object instanceof fabric.FabricObject)) return;

        // Obtener el estado de la capa correspondiente al objeto
        const state = layerState[object.layer];

        if (!state) return; // Si no hay estado definido para la capa, ignorar

        // Aplicar el estado general de la capa
        object.set("opacity", state.opacity);
        object.set("selectable", state.selectable);
        object.set("evented", state.evented);

        if (object.layer === LAYERS.TEXT.id) {
          canvas.bringObjectToFront(object);
        }


        // Desactivar selección si el objeto está activo y no es seleccionable
        if (object === activeObject && !state.selectable) {
          canvas.discardActiveObject();
        }
      });
      canvas.renderAll();
    });
  },
  // Función auxiliar para crear el estado de las capas basado en la capa activa
  createLayerState: (activeLayer) => ({
    [LAYERS.ANNOTATION.id]: {
      visible: activeLayer === LAYERS.ANNOTATION.id,
      opacity: activeLayer === LAYERS.ANNOTATION.id ? 1 : 0,
      selectable: activeLayer === LAYERS.ANNOTATION.id,
      evented: activeLayer === LAYERS.ANNOTATION.id,
    },
    [LAYERS.CLEANUP.id]: {
      visible: activeLayer === LAYERS.CLEANUP.id || activeLayer === LAYERS.TEXT.id || activeLayer === LAYERS.OUTPUT.id,
      opacity: activeLayer === LAYERS.CLEANUP.id || activeLayer === LAYERS.TEXT.id || activeLayer === LAYERS.OUTPUT.id ? 1 : 0,
      selectable: false,
      evented: false,
    },
    [LAYERS.TEXT.id]: {
      visible: activeLayer === LAYERS.TEXT.id || activeLayer === LAYERS.OUTPUT.id,
      opacity: activeLayer === LAYERS.TEXT.id || activeLayer === LAYERS.OUTPUT.id ? 1 : 0,
      selectable: activeLayer === LAYERS.TEXT.id,
      evented: activeLayer === LAYERS.TEXT.id,
    },
    [LAYERS.OUTPUT.id]: {
      visible: activeLayer === LAYERS.CLEANUP.id || activeLayer === LAYERS.TEXT.id,
      opacity: activeLayer === LAYERS.CLEANUP.id || activeLayer === LAYERS.TEXT.id ? 1 : 0,
      selectable: false,
      evented: false,
    },

  }),
  setActiveLayer: (layer) => {
    set((state) => {
      state.activeLayer = layer;
    });

    set((state) => {
      state.activeTools = [];
    });

    document.body.style.cursor = 'default';
    get().setLayerOpacity(get().createLayerState(layer));
    
  },

  updateLayerState: (layer, objects) =>
    set((state) => {
      state.layerStates[layer] = objects;
    }),

  

  setLayerState: (layer, index, newHistory) =>
    set((state) => {
      state.layerStates[layer][index] = newHistory;
    }),
  
  setLayerRedoState: (layer, index, newHistory) =>
    set((state) => {
      state.layerRedoStates[layer][index] = newHistory;
    }),
});
