import { TOOLS } from "../../constants/tools";

export const createToolSlice = (set, get) => ({
  activeTools: [],
  toggleTool: (toolId) =>
    set((state) => {
      const currentTools = [...state.activeTools];
      const isToolActive = currentTools.includes(toolId);
      
      // Caso especial: Pan tool (exclusivo)
      if (toolId === TOOLS.PAN.id) {
        state.activeTools = isToolActive ? [] : [toolId];
      }
      // Si la herramienta ya está activa, la desactivamos
      else if (isToolActive) {
        state.activeTools = currentTools.filter(t => t !== toolId);
      }
      // Si la herramienta no está activa, la activamos
      else {
        const newToolConfig = Object.values(TOOLS).find(tool => tool.id === toolId);
        
        if (currentTools.length === 0) {
          // No hay herramientas activas, simplemente activar la nueva
          state.activeTools = [toolId];
        } else if (newToolConfig?.compatibleWith?.length > 0) {
          // La nueva herramienta tiene compatibilidades definidas
          state.activeTools = getCompatibleTools(currentTools, toolId, newToolConfig);
        } else {
          // La nueva herramienta no tiene compatibilidades definidas
          state.activeTools = handleNonCompatibleTool(currentTools, toolId);
        }
      }
      
      console.log("activeTools");
      // Manejar propiedades de textbox en canvas según herramientas activas
      handleTextToolsCanvas(state.activeTools, get);
    }),


  isToolActive: (toolId) => get().activeTools.includes(toolId),
  resetActiveTools: () => set({ activeTools: [] }),


  selectedTool: null,
  setSelectedTool: (tool) => set({ selectedTool: tool }),

  selectedRectangleColor: "#4a90e2",

  setRectangleColor: (color) => set({ selectedRectangleColor: color }),

  selectedBrushColor: "#000000",
  setSelectedBrushColor: (color) => set({ selectedBrushColor: color }),

  selectedBrushSize: 10,
  setSelectedBrushSize: (size) => set({ selectedBrushSize: size }),

  selectedBrushHardness: 10,
  setSelectedBrushHardness: (color) => set({ selectedBrushHardness: color }),

  selectedEraserSize: 10,
  setSelectedEraserSize: (size) => set({ selectedEraserSize: size }),

  selectedCloneSize: 10,
  setSelectedCloneSize: (size) => set({ selectedCloneSize: size }),

  selectedCloneHardness: 10,
  setSelectedCloneHardness: (size) => set({ selectedCloneHardness: size }),

  selectedRedrawSize: 10,
  setSelectedRedrawSize: (size) => set({ selectedRedrawSize: size }),

  selectedTextboxFontSize: 16,
  setSelectedTextboxFontSize: (size) => set({ selectedTextboxFontSize: size }),

  selectedTextboxFontFamily: 'Arial',
  setSelectedTextboxFontFamily: (font) => set({ selectedTextboxFontFamily: font }),

  shouldRedraw: false,
  setShouldRedraw: (value) => set({ shouldRedraw: value }),
  shouldRedrawCurrent: false,
  setShouldRedrawCurrent: (value) => set({ shouldRedrawCurrent: value }),

  // Nuevo estado para almacenar alturas de herramientas
  toolsHeights: {},
  setToolsHeights: (toolIds, heights) =>
    set((state) => {
      const key = toolIds.slice().sort().join('-');
      return {
        ...state,
        toolsHeights: {
          ...state.toolsHeights,
          [key]: heights
        }
      };
    }),
  getToolsHeights: (toolIds) => {
    const key = toolIds.slice().sort().join('-');
    return get().toolsHeights[key] || null;
  },

  selectedTextColor: "#000000",
  setTextColor: (color) => set({ selectedTextColor: color }),
});

// Funciones auxiliares para mayor claridad
function getCompatibleTools(currentTools, newToolId, newToolConfig) {
  // Mantener solo las herramientas compatibles con la nueva
  const compatibleTools = currentTools.filter(toolId => 
    newToolConfig.compatibleWith.includes(toolId)
  );
  
  // Agregar la nueva herramienta
  return [...compatibleTools, newToolId];
}

function handleNonCompatibleTool(currentTools, newToolId) {
  // Verificar si alguna herramienta activa es compatible con la nueva
  const isCompatibleWithExisting = currentTools.some(activeToolId => {
    const activeToolConfig = Object.values(TOOLS).find(tool => tool.id === activeToolId);
    return activeToolConfig?.compatibleWith?.includes(newToolId);
  });
  
  if (isCompatibleWithExisting) {
    // Es compatible con alguna existente, agregarla
    return [...currentTools, newToolId];
  } else {
    // No es compatible con ninguna, reemplazar todas
    return [newToolId];
  }
}
// Función para manejar canvas en herramientas de texto específicas
function handleTextToolsCanvas(newActiveTools, get) {
  const currentState = get();
  const activeImageIndex = currentState.activeImageIndex || 0;
  const canvasInstance = currentState.getCanvasInstance?.(activeImageIndex);
  
  if (!canvasInstance) {
    console.warn(`No se pudo obtener el canvas en el índice ${activeImageIndex}`);
    return;
  }

  const textTools = [TOOLS.TEXT.id, TOOLS.TEXT_BOX.id, TOOLS.ADJUST_TEXT.id];
  
  // Usar las nuevas herramientas activas que se pasan como parámetro
  const hasActiveTextTool = textTools.some(tool => newActiveTools.includes(tool));
  
  console.log('Herramientas activas:', newActiveTools);
  console.log('Tiene herramienta de texto activa:', hasActiveTextTool);
  
  // Iterar sobre todos los objetos del canvas
  canvasInstance.getObjects().forEach(obj => {
    // Verificar si el objeto es un textbox
    if (obj.type === 'textbox' || obj.type === 'i-text' || obj.type === 'text') {
      console.log('Objeto encontrado:', obj.text);
      console.log('Configurando evented/selectable a:', hasActiveTextTool);
      
      obj.set({
        evented: hasActiveTextTool,
        selectable: hasActiveTextTool
      });
      obj.setCoords();
    }
  });
  
  canvasInstance.discardActiveObject();
  canvasInstance.renderAll();
}