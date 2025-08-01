export const createCanvasSlice = (set, get) => ({
  canvasInstances: [],
  setCanvasInstance: (index, instance) =>
    set((state) => {
      state.canvasInstances[index] = instance;
    }),
  getCanvasInstance: (index) =>
    get().canvasInstances[index],

  resetCanvasInstances: () =>
    set((state) => {
      state.canvasInstances = [];
    }),

  getAllCanvasInstances: () => get().canvasInstances,

  canvasObjectStatus: [],
  setCanvasObjectStatus: (index, status) =>
    set((state) => {
      state.canvasObjectStatus[index] = status;
    }),
  setAllCanvasObjectStatus: (status) =>
    set((state) => {
      state.canvasObjectStatus = status;
    }),
  getCanvasObjectStatus: (index) => get().canvasObjectStatus[index],
  getAllCanvasObjectStatus: () => get().canvasObjectStatus,
});
