// Export Zustand stores from shell app
export { useAuthStore, useAuth } from './auth.store';
export type { User } from './auth.store';

export { useCartStore, useCart } from './cart.store';
export type { Course } from './cart.store';

export { useUIStore, useUI } from './ui.store';

// Export API client
export { apiClient } from '../api';
