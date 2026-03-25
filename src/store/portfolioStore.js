import { create } from "zustand";

const usePortfolioStore = create((set) => ({
  // Navigation
  activeSection: "#hero",
  setActiveSection: (section) => set({ activeSection: section }),

  // Theme (dark by default)
  isDark: true,
  toggleTheme: () => set((state) => ({ isDark: !state.isDark })),

  // Contact form state
  formStatus: "idle", // 'idle' | 'submitting' | 'success' | 'error' | 'rate-limited'
  setFormStatus: (status) => set({ formStatus: status }),
  formError: null,
  setFormError: (error) => set({ formError: error }),

  // Projects filter
  activeFilter: "All",
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Mobile nav
  mobileNavOpen: false,
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  toggleMobileNav: () =>
    set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),
}));

export default usePortfolioStore;
