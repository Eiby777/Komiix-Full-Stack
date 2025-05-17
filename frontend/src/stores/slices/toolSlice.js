import { TOOLS } from "../../constants/tools";

export const createToolSlice = (set, get) => ({
  activeTools: [],
  toggleTool: (toolId) =>
    set((state) => {
      let currentTools = [...state.activeTools];
      const toolIndex = currentTools.indexOf(toolId);
      
      if (toolId === TOOLS.PAN.id) {
        // Toggle Pan (exclusivo)
        state.activeTools = currentTools.includes("pan") ? [] : ["pan"];
      } else {
        if (toolIndex !== -1) {
          // Desactivar herramienta si está activa
          currentTools.splice(toolIndex, 1);
        } else {
          // Activar nueva herramienta
          const newToolConfig = Object.values(TOOLS).find(tool => tool.id === toolId);
          
          if (newToolConfig?.compatibleWith?.length > 0) {
            // Filtrar herramientas actuales: mantener solo las compatibles con la nueva
            currentTools = currentTools.filter(t => 
              newToolConfig.compatibleWith.includes(t)
            );
            // Agregar la nueva herramienta
            currentTools.push(toolId);
          } else if (currentTools.length > 0) {
            // Si la nueva herramienta no tiene compatibilidades definidas pero hay herramientas activas,
            // verificar si alguna herramienta activa la incluye en su compatibleWith
            const isCompatibleWithExisting = currentTools.some(t => {
              const toolConfig = Object.values(TOOLS).find(tool => tool.id === t);
              return toolConfig?.compatibleWith?.includes(toolId);
            });
            
            if (isCompatibleWithExisting) {
              currentTools.push(toolId);
            } else {
              // Si no es compatible con ninguna existente, reemplazar todo
              currentTools = [toolId];
            }
          } else {
            // Si no hay herramientas activas, simplemente activar la nueva
            currentTools = [toolId];
          }
        }
        state.activeTools = currentTools;
      }
  
      
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
