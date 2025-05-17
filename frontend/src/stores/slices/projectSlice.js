export const createProjectSlice = (set, get) => ({
  currentProject: null,
  isLoadingProject: false,
  imagesWithUrls: [],
  dimensionImages: [],
  canvasElementsReady: false,
  activeImageIndex: 0,
  isLoadingImage: false,
  imagesLoaded: false,
  projectId: null,
  setProjectId: (projectId) => { set({ projectId }) },
  projects: [],
  setProjects: (projects) => { set({ projects }) },
  addProject: (project) => {
    //evitar actualizaciones si los datos son iguales
    const state = get();
    if (state.projects.some(p => p.id === project.id)) return;
    set({ projects: [...state.projects, project] });
  },
  removeProject: (projectId) => {
    const state = get();
    set({ projects: state.projects.filter((project) => project.id !== projectId) });
  },

  setImagesLoaded: (loaded) => set({ imagesLoaded: loaded }),
  setImagesWithUrls: (urls) => set({ imagesWithUrls: urls }),
  setDimensionImages: (dimension) => set({ dimensionImages: dimension }),
  setCanvasElementsReady: (ready) => set({ canvasElementsReady: ready }),

  setActiveImageIndex: (index) => {
    const state = get();
    if (state.isLoadingImage || index === state.activeImageIndex) return;
    set({ isLoadingImage: true });
    setTimeout(() => {
      set(state => {
        state.activeImageIndex = index;
        state.isLoadingImage = false;
      });
    }, 100);
  },

  images: [],
  setImages: (images) => set({ images }),

  configIconsPositions: {
    zoomIcon: {
      right: "20%",
      top: "6rem",
      active: true
    },
    layerIcon: {
      right: "20%",
      top: "9rem",
      active: true
    },
    undoRedoIcon: {
      right: "20%",
      top: "14.2rem",
      active: true
    },
    settingsIcon: {
      right: "20%",
      top: "17.5rem",
      active: true
    }
  },
  setConfigIconsPositions: (icon, positions) => 
    set({ configIconsPositions: { ...get().configIconsPositions, [icon]: positions } }),

  isSettingsVisible: true,
  setIsSettingsVisible: (visible) => set({ isSettingsVisible: visible }),

  previousObject: null,
  getPreviousObject: () => get().previousObject,
  setPreviousObject: (object) => set({ previousObject: object }),
});


