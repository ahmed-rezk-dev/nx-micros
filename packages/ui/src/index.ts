import './globals.css';
export * from './lib/ui';
export * from './lib/utils';

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
