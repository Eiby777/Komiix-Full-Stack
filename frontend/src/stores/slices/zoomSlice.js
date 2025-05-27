export const createZoomSlice = (set, get) => ({
  zoomLevel: [],
  minZoom: [], // Cambiado a un arreglo
  maxZoom: 8,
  zoomStep: 0.05,

  setZoomLevel: (index, level) =>
    set((state) => {
      // Asegurarse de que minZoom[index] exista
      const minZoomValue =
        state.minZoom[index] !== undefined ? state.minZoom[index] : 0.25;
      const newZoom = Math.min(Math.max(level, minZoomValue), state.maxZoom);
      state.zoomLevel[index] = newZoom;
    }),

  setMinZoom: (index, value) =>
    set((state) => {
      state.minZoom[index] = value;
    }),

  initializeMinZoom: (init) =>
    set((state) => {
      state.minZoom = init;
    }),

  zoomIn: (index) =>
    set((state) => {
      // Asegurarse de que minZoom[index] exista
      const minZoomValue =
        state.minZoom[index] !== undefined ? state.minZoom[index] : 0.25;
      const newZoom = Math.min(
        state.zoomLevel[index] + state.zoomStep,
        state.maxZoom
      );
      state.zoomLevel[index] = newZoom;
    }),

  zoomOut: (index) =>
    set((state) => {
      // Asegurarse de que minZoom[index] exista
      const minZoomValue =
        state.minZoom[index] !== undefined ? state.minZoom[index] : 0.25;
      const newZoom = Math.max(
        state.zoomLevel[index] - state.zoomStep,
        minZoomValue
      );
      state.zoomLevel[index] = newZoom;
    }),

  initializeZoomLevel: (init) =>
    set((state) => {
      state.zoomLevel = init;
    }),

  getZoomLevels: () => get().zoomLevel,
  getZoomLevel: (index) => get().zoomLevel[index],
  getMinZoom: (index) => get().minZoom[index] !== undefined ? get().minZoom[index] : 0.25,

  headerHeight: "75px",
  setHeaderHeight: (height) => set((state) => {
    state.headerHeight = height;
  })
});
