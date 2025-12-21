import { useEffect, useState } from 'react';
import NxWelcome from './nx-welcome';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from '@nx-micros/ui';
import { useAuthStore, useUIStore } from 'shell/stores';

interface DashboardStats {
  totalCourses: number;
  enrolledCourses: number;
  completedCourses: number;
  totalStudyTime: number;
}

export function App() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { setLoading } = useUIStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadDashboardData();
    }
  }, [isAuthenticated, user]);

  const loadDashboardData = async () => {
    try {
      setLoading('dashboard-stats', true);
      // In a real app, this would call the actual API
      // For now, we'll simulate with mock data
      const mockStats: DashboardStats = {
        totalCourses: 150,
        enrolledCourses: 3,
        completedCourses: 1,
        totalStudyTime: 45, // hours
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading('dashboard-stats', false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Access Required</CardTitle>
              <CardDescription>
                Please log in to view your dashboard.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.firstName || 'Student'}!
            </h1>
            <p className="text-muted-foreground mt-2">
              Here's your learning progress overview
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Courses Available
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCourses}</div>
                <p className="text-xs text-muted-foreground">
                  Courses in our catalog
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Enrolled Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.enrolledCourses}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently enrolled
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.completedCourses}
                </div>
                <p className="text-xs text-muted-foreground">
                  Successfully completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Study Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalStudyTime}h
                </div>
                <p className="text-xs text-muted-foreground">
                  Total time studied
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest learning activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Started "React Fundamentals" course
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Completed "JavaScript Basics" quiz
                  </p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Enrolled in "Advanced Node.js"
                  </p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Jump back into your learning journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button>Browse Courses</Button>
              <Button variant="outline">Continue Learning</Button>
              <Button variant="outline">View Certificates</Button>
            </div>
          </CardContent>
        </Card>

        {/* Microfrontend Info */}
        <NxWelcome title="Dashboard Microfrontend" />
      </div>
    </div>
  );
}

export default App;
