import './globals.css';
export * from './lib/ui';
export * from './lib/utils';

// Zustand Stores
export { useAuthStore, useAuth } from './lib/stores/auth.store';
export type { User } from './lib/stores/auth.store';

export { useCartStore, useCart } from './lib/stores/cart.store';
export type { Course } from './lib/stores/cart.store';

export { useUIStore, useUI } from './lib/stores/ui.store';

// API Client & Hooks
export { apiClient } from './lib/api';
export { useForm, useController, useFormContext } from 'react-hook-form';
export { zodResolver } from '@hookform/resolvers/zod';

// shadCN/ui Components - Organized by Atomic Design

// Atoms (Basic building blocks)
export { Button } from './components/atoms/button';
export { Input } from './components/atoms/input';

// Molecules (Combinations of atoms)
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './components/molecules/card';

// Organisms (Complex components)
export { default as ErrorBoundary } from './components/organisms/ErrorBoundary';
export { ToastProvider, useToast } from './components/organisms/ToastProvider';
export { ToastContainer } from './components/organisms/ToastContainer';
