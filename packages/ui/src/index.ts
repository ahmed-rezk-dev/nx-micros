import './globals.css';

// shadCN/ui Components
export { Badge } from './components/ui/badge';
export { Separator } from './components/ui/separator';
export { Skeleton } from './components/ui/skeleton';
export { Avatar, AvatarImage, AvatarFallback } from './components/ui/avatar';
export { Progress } from './components/ui/progress';
export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from './components/ui/dialog';
export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuShortcut,
} from './components/ui/dropdown-menu';
export { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './components/ui/tooltip';
export {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './components/ui/popover';
export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './components/ui/command';
export {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from './components/ui/hover-card';

// Legacy components (keeping for backwards compatibility)
export { Button } from './components/atoms/button';
export { Input } from './components/atoms/input';
export { Loading } from './components/atoms/loading';

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

export { default as ErrorBoundary } from './components/organisms/ErrorBoundary';
export { ToastProvider, useToast } from './components/organisms/ToastProvider';
export { ToastContainer } from './components/organisms/ToastContainer';

export {
  PaymentDialog,
  SubscriptionPlans,
  type SubscriptionPlan,
  type PaymentDialogProps,
  type SubscriptionPlansProps,
} from './components/molecules/payment';

// Utils
export * from './lib/utils';
