import * as React from 'react';
import { Link, Route, Routes, Navigate } from 'react-router-dom';
import { Button } from '@nx-micros/ui';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@nx-micros/ui';
import { ErrorBoundary, ToastProvider, ToastContainer } from '@nx-micros/ui';
import { useAuth } from '../stores';

const Admin = React.lazy(() => import('admin/Module'));

const Account = React.lazy(() => import('account/Module'));

const Instructor = React.lazy(() => import('instructor/Module'));

const Learning = React.lazy(() => import('learning/Module'));

const Courses = React.lazy(() => import('courses/Module'));

const Dashboard = React.lazy(() => import('dashboard/Module'));

const Auth = React.lazy(() => import('auth/Module'));

const SubscriptionPage = React.lazy(
  () => import('./components/SubscriptionPage'),
);

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
}

// Public Route component (redirects authenticated users)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/dashboard" replace />
  );
}

export function App() {
  const { isAuthenticated, user, logout } = useAuth();

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
                  <nav className="flex-col gap-4 items-center">
                    <div className="flex gap-2">
                      <Button asChild variant="ghost">
                        <Link to="/">Home</Link>
                      </Button>
                      <Button asChild variant="ghost">
                        <Link to="/admin">Admin</Link>
                      </Button>
                    </div>

                    {isAuthenticated ? (
                      <>
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
                          <Link to="/subscription">Subscription</Link>
                        </Button>

                        <div className="flex items-center gap-2 ml-4 pl-4 border-l">
                          <span className="text-sm text-gray-600">
                            Welcome, {user?.firstName || user?.email}
                          </span>
                          <Button variant="outline" size="sm" onClick={logout}>
                            Logout
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Button asChild variant="ghost">
                        <Link to="/auth">Sign In</Link>
                      </Button>
                    )}
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
                    <div className="flex flex-col gap-12">
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
                    </div>
                  }
                />
                <Route path="/admin" element={<Admin />} />
                <Route
                  path="/auth"
                  element={
                    <PublicRoute>
                      <Auth />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses"
                  element={
                    <ProtectedRoute>
                      <Courses />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/learning"
                  element={
                    <ProtectedRoute>
                      <Learning />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/instructor"
                  element={
                    <ProtectedRoute>
                      <Instructor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/account"
                  element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/subscription"
                  element={
                    <ProtectedRoute>
                      <SubscriptionPage />
                    </ProtectedRoute>
                  }
                />
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
