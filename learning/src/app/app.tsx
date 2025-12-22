import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  ToastProvider,
  ErrorBoundary,
  Card,
  CardContent,
  Button,
} from '@nx-micros/ui';
import { LoadingSpinner } from './components/LoadingSpinner';

// Lazy load components for better performance
const CoursePlayer = lazy(() => import('./components/CoursePlayer'));
const LessonNavigation = lazy(() => import('./components/LessonNavigation'));
const LearningProgress = lazy(() => import('./components/LearningProgress'));

export function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route
                  path="/"
                  element={
                    <div className="text-center py-12">
                      <Card className="max-w-md mx-auto">
                        <CardContent className="pt-6">
                          <h1 className="text-2xl font-bold text-foreground mb-4">
                            Welcome to Learning
                          </h1>
                          <p className="text-muted-foreground mb-6">
                            Select a course from the dashboard to start
                            learning.
                          </p>
                          <Button onClick={() => window.history.back()}>
                            Go Back to Dashboard
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  }
                />
                <Route
                  path="/course/:courseId"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-3">
                          <CoursePlayer />
                        </div>
                        <div className="lg:col-span-1">
                          <LessonNavigation />
                        </div>
                      </div>
                    </Suspense>
                  }
                />
                <Route
                  path="/course/:courseId/lesson/:lessonId"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-3">
                          <CoursePlayer />
                        </div>
                        <div className="lg:col-span-1">
                          <LessonNavigation />
                        </div>
                      </div>
                    </Suspense>
                  }
                />
                <Route
                  path="/progress"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <LearningProgress />
                    </Suspense>
                  }
                />
              </Routes>
            </div>
          </div>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
