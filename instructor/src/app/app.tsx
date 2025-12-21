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
            <CardTitle className="text-2xl">Instructor Dashboard</CardTitle>
            <CardDescription>
              Create and manage your courses, track student progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Instructor tools and course management features will be
              implemented here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
