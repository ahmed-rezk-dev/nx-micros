import * as React from 'react';
import NxWelcome from './nx-welcome';
import { Link, Route, Routes } from 'react-router-dom';
import { Button } from '@nx-micros/ui';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@nx-micros/ui';
import { ErrorBoundary, ToastProvider, ToastContainer } from '@nx-micros/ui';

const Account = React.lazy(() => import('account/Module'));

const Instructor = React.lazy(() => import('instructor/Module'));

const Learning = React.lazy(() => import('learning/Module'));

const Courses = React.lazy(() => import('courses/Module'));

const Dashboard = React.lazy(() => import('dashboard/Module'));

const Auth = React.lazy(() => import('auth/Module'));

export function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="min-h-screen bg-background">
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen">
                Loading...
              </div>
            }
          >
            {/* Navigation Header */}
            <header className="border-b bg-card">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-primary">
                    Nx Microfrontends
                  </h1>
                  <nav className="flex gap-4">
                    <Button asChild variant="ghost">
                      <Link to="/">Home</Link>
                    </Button>
                    <Button asChild variant="ghost">
                      <Link to="/dashboard">Dashboard</Link>
                    </Button>
                    <Button asChild variant="ghost">
                      <Link to="/courses">Courses</Link>
                    </Button>
                    <Button asChild variant="ghost">
                      <Link to="/learning">Learning</Link>
                    </Button>
                    <Button asChild variant="ghost">
                      <Link to="/instructor">Instructor</Link>
                    </Button>
                    <Button asChild variant="ghost">
                      <Link to="/account">Account</Link>
                    </Button>
                    <Button asChild variant="ghost">
                      <Link to="/auth">Authentication</Link>
                    </Button>
                  </nav>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route
                  path="/"
                  element={
                    <div className="space-y-8">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-3xl">
                            Welcome to Nx Microfrontends
                          </CardTitle>
                          <CardDescription>
                            A modern microfrontends architecture built with
                            React, Module Federation, and shadCN/ui components.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <Card>
                              <CardHeader>
                                <CardTitle>🏗️ Architecture</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground">
                                  Built with Nx workspace, Module Federation,
                                  and Atomic Design principles.
                                </p>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader>
                                <CardTitle>🎨 UI Components</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground">
                                  Shared component library using shadCN/ui with
                                  Tailwind CSS v4.
                                </p>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader>
                                <CardTitle>⚡ Performance</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground">
                                  Optimized builds with Rspack and Vite for fast
                                  development and production.
                                </p>
                              </CardContent>
                            </Card>
                          </div>
                        </CardContent>
                      </Card>
                      <NxWelcome title="shell" />
                    </div>
                  }
                />
                <Route path="/account" element={<Account />} />
                <Route path="/instructor" element={<Instructor />} />
                <Route path="/learning" element={<Learning />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/auth" element={<Auth />} />
              </Routes>
            </main>
          </React.Suspense>
          <ToastContainer />
        </div>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
