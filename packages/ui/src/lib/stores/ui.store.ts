import { create } from 'zustand';
import { useEffect } from 'react';

// Browser environment types
declare const window: any;
declare const localStorage: any;

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  loadingStates: Record<string, boolean>;
  modalOpen: boolean;
  modalContent: React.ReactNode | null;

  // Actions
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setLoading: (key: string, loading: boolean) => void;
  clearLoading: (key: string) => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
  isLoading: (key?: string) => boolean;
}

export const useUIStore = create<UIState>((set, get) => ({
  theme: 'light',
  sidebarOpen: false,
  loadingStates: {},
  modalOpen: false,
  modalContent: null,

  setTheme: (theme: 'light' | 'dark') => {
    set({ theme });
    // Persist theme preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('ui-theme', theme);
    }
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  setLoading: (key: string, loading: boolean) => {
    set((state) => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: loading,
      },
    }));
  },

  clearLoading: (key: string) => {
    set((state) => {
      const newLoadingStates = { ...state.loadingStates };
      delete newLoadingStates[key];
      return { loadingStates: newLoadingStates };
    });
  },

  openModal: (content: React.ReactNode) => {
    set({
      modalOpen: true,
      modalContent: content,
    });
  },

  closeModal: () => {
    set({
      modalOpen: false,
      modalContent: null,
    });
  },

  isLoading: (key?: string) => {
    const loadingStates = get().loadingStates;
    if (key) {
      return loadingStates[key] || false;
    }
    return Object.values(loadingStates).some((loading) => loading);
  },
}));

// Custom hook for safe UI store usage
export const useUI = () => {
  // Initialize theme on first use
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('ui-theme') as 'light' | 'dark';
      if (savedTheme && savedTheme !== useUIStore.getState().theme) {
        useUIStore.getState().setTheme(savedTheme);
      }
    }
  }, []);

  return useUIStore();
};
