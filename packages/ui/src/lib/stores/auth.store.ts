import { create } from 'zustand';
import { useEffect } from 'react';

// Browser environment types
declare const window: any;
declare const localStorage: any;

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'student' | 'instructor' | 'admin';
  avatarUrl?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  refreshToken: (newToken: string) => void;
  initialize: () => void;
}

const AUTH_STORAGE_KEY = 'auth-storage';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: (user: User, token: string) => {
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          user,
          token,
          isAuthenticated: true,
        }),
      );
    }
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    // Clear from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  },

  updateUser: (updates: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      set({ user: updatedUser });
      // Update localStorage
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          localStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify({
              ...parsed,
              user: updatedUser,
            }),
          );
        }
      }
    }
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  refreshToken: (newToken: string) => {
    set({ token: newToken });
    // Update localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({
            ...parsed,
            token: newToken,
          }),
        );
      }
    }
  },

  initialize: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          set({
            user: parsed.user,
            token: parsed.token,
            isAuthenticated: parsed.isAuthenticated,
          });
        } catch (error) {
          console.error('Failed to parse auth storage:', error);
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }
    }
  },
}));

// Custom hook for safe auth store usage
export const useAuth = () => {
  // Initialize on first use in browser environment
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      useAuthStore.getState().initialize();
    }
  }, []);

  return useAuthStore();
};

// Store initialization is now handled lazily in the hook
// No global initialization to avoid SSR/module federation issues
