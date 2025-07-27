export const createDashboardSlice = (set, get) => ({
  isSidebarCollapsed: false,
  setIsSidebarCollapsed: (value) => set(() => ({ isSidebarCollapsed: value })),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
});
  