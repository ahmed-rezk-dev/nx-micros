import NxWelcome from './nx-welcome';
import '../styles.css';
import { Button } from '@nx-micros/ui';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@nx-micros/ui';
import { Input } from '@nx-micros/ui';

export function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-md mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Authentication</CardTitle>
            <CardDescription>Sign in to access your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button className="flex-1">Sign In</Button>
              <Button variant="outline" className="flex-1">
                Sign Up
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-sm text-muted-foreground">
              <p>This is the Authentication microfrontend</p>
              <p className="mt-2">
                Built with shared UI components from the design system
              </p>
            </div>
          </CardContent>
        </Card>

        <NxWelcome title="auth" />
      </div>
    </div>
  );
}

export default App;
