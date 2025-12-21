import './globals.css';
export * from './lib/ui';
export * from './lib/utils';

// Zustand Stores are now provided by the shell remote

// API Client & Hooks are now provided by the shell remote

// shadCN/ui Components - Organized by Atomic Design

// Atoms (Basic building blocks)
export { Button } from './components/atoms/button';
export { Input } from './components/atoms/input';
export { Loading } from './components/atoms/loading';

// Molecules (Combinations of atoms)
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './components/molecules/card';

export {
  Alert,
  AlertTitle,
  AlertDescription,
} from './components/molecules/alert';

// Organisms (Complex components)
export { default as ErrorBoundary } from './components/organisms/ErrorBoundary';
export { ToastProvider, useToast } from './components/organisms/ToastProvider';
export { ToastContainer } from './components/organisms/ToastContainer';
