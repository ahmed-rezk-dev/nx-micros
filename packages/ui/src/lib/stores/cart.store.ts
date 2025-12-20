import { create } from 'zustand';

export interface Course {
  id: string;
  title: string;
  description?: string;
  shortDescription?: string;
  price?: number;
  currency?: string;
  instructorId?: string;
  instructor?: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
  thumbnailUrl?: string;
}

interface CartState {
  items: Course[];
  isLoading: boolean;

  // Actions
  addCourse: (course: Course) => void;
  removeCourse: (courseId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  hasCourse: (courseId: string) => boolean;
  setLoading: (loading: boolean) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,

  addCourse: (course: Course) => {
    const currentItems = get().items;
    const existingIndex = currentItems.findIndex(
      (item) => item.id === course.id,
    );

    if (existingIndex === -1) {
      set({ items: [...currentItems, course] });
    }
  },

  removeCourse: (courseId: string) => {
    const currentItems = get().items;
    set({
      items: currentItems.filter((item) => item.id !== courseId),
    });
  },

  clearCart: () => {
    set({ items: [] });
  },

  getTotalPrice: () => {
    const items = get().items;
    return items.reduce((total, course) => {
      return total + (course.price || 0);
    }, 0);
  },

  getTotalItems: () => {
    return get().items.length;
  },

  hasCourse: (courseId: string) => {
    return get().items.some((item) => item.id === courseId);
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
