import NxWelcome from './nx-welcome';

export function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Course Catalog
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover and enroll in our comprehensive course collection
          </p>
        </div>

        {/* Simple course grid with mock data */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">React Fundamentals</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Learn the basics of React development
            </p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">$49.99</span>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium">
                Enroll Now
              </button>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-2xl">🐍</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Python for Data Science
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Master Python for data analysis and ML
            </p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">$79.99</span>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium">
                Enroll Now
              </button>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Mobile App Development
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Build cross-platform mobile apps
            </p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">$119.99</span>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium">
                Enroll Now
              </button>
            </div>
          </div>
        </div>

        <NxWelcome title="Courses Microfrontend" />
      </div>
    </div>
  );
}

export default App;
