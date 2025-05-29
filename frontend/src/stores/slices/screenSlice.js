import enumFloatingMenus from "../../components/editor/floating-menus/handlers/enumFloatingMenus"
export const createScreenSlice = (set, get) => ({
    headerHeight: "75px",
    setHeaderHeight: (height) => set((state) => {
        state.headerHeight = height;
    }),

    toolbarWidth: 50,
    setToolbarWidth: (width) => set((state) => {
        state.toolbarWidth = width;
    }),

    floatingMenusSizes: {}, // Solo almacena dimensiones
    setFloatingMenuSize: (menuType, size) => set(state => ({
        floatingMenusSizes: {
            ...state.floatingMenusSizes,
            [menuType]: size
        }
    })),
    isLayerCarouselVisible: true,

    setLayerCarouselVisible: (isVisible) =>
        set({ isLayerCarouselVisible: isVisible }),

    isZoomControlsVisible: true,

    setZoomControlsVisible: (isVisible) =>
        set({ isZoomControlsVisible: isVisible }),

    isUndoRedoMenuVisible: true,

    setUndoRedoMenuVisible: (isVisible) =>
        set({ isUndoRedoMenuVisible: isVisible }),

});
