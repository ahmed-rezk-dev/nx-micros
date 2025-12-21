import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@nx-micros/ui';

export function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Account Settings</CardTitle>
            <CardDescription>
              Manage your account preferences and profile information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Account management features will be implemented here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
