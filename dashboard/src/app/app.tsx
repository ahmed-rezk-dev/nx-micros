import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from '@nx-micros/ui';
import { useAuthStore } from 'shell/stores';
import {
  BookOpen,
  GraduationCap,
  Trophy,
  Clock,
  TrendingUp,
  Play,
  Award,
  User,
  LogOut,
  Target,
  Flame,
  CheckCircle,
  ChevronRight,
  Star,
} from 'lucide-react';

interface DashboardStats {
  totalCourses: number;
  enrolledCourses: number;
  completedCourses: number;
  totalStudyTime: number;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'enrolled' | 'completed' | 'started';
}

export function App() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStreak] = useState(5);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadDashboardData();
    }
  }, [isAuthenticated, user]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockStats: DashboardStats = {
        totalCourses: 150,
        enrolledCourses: 3,
        completedCourses: 1,
        totalStudyTime: 45,
      };

      const mockActivities: Activity[] = [
        {
          id: '1',
          title: 'Started "React Fundamentals"',
          description: 'New course in progress',
          timestamp: '2 hours ago',
          type: 'started',
        },
        {
          id: '2',
          title: 'Completed "JavaScript Basics"',
          description: 'Quiz score: 95%',
          timestamp: '1 day ago',
          type: 'completed',
        },
        {
          id: '3',
          title: 'Enrolled in "Advanced Node.js"',
          description: 'New learning path',
          timestamp: '3 days ago',
          type: 'enrolled',
        },
      ];

      setStats(mockStats);
      setActivities(mockActivities);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'started':
        return Play;
      case 'completed':
        return Trophy;
      case 'enrolled':
        return BookOpen;
      default:
        return BookOpen;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'started':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'enrolled':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-8">
        <Card className="w-full max-w-md shadow-2xl border-0 rounded-3xl">
          <CardHeader className="text-center pb-8 pt-10">
            <div className="mx-auto mb-8 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription className="text-lg mt-3">
              Sign in to continue your learning journey
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-10">
            <Button
              className="w-full py-4 text-lg rounded-2xl"
              onClick={() => (window.location.href = '/auth')}
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900/50 px-4 py-2 rounded-full">
                <Flame className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-orange-700 dark:text-orange-300">
                  {currentStreak} day streak
                </span>
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.firstName || 'Student'}!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Continue your learning journey with personalized insights and
              progress tracking
            </p>
          </div>

          {/* Key Stats */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 rounded-3xl">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalCourses.toLocaleString() || 0}
                </CardTitle>
                <CardDescription className="text-base">
                  Available Courses
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 rounded-3xl">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.enrolledCourses || 0}
                </CardTitle>
                <CardDescription className="text-base">
                  Currently Learning
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 rounded-3xl">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.completedCourses || 0}
                </CardTitle>
                <CardDescription className="text-base">
                  Courses Completed
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 rounded-3xl">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalStudyTime || 0}h
                </CardTitle>
                <CardDescription className="text-base">
                  Study Time
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <Card className="bg-white dark:bg-gray-800 shadow-lg border-0 rounded-3xl">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold">
                          Recent Activity
                        </CardTitle>
                        <CardDescription className="text-base">
                          Your learning progress
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700"
                        >
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-xl animate-pulse"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activities.map((activity) => {
                        const IconComponent = getActivityIcon(activity.type);
                        const colorClass = getActivityColor(activity.type);
                        return (
                          <div
                            key={activity.id}
                            className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          >
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}
                            >
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {activity.title}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {activity.description}
                              </p>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {activity.timestamp}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Progress */}
            <div className="space-y-6">
              {/* Weekly Progress */}
              <Card className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-950/50 dark:via-blue-950/50 dark:to-purple-950/50 shadow-lg border-0 rounded-3xl">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold">
                    Weekly Goal
                  </CardTitle>
                  <CardDescription className="text-sm">
                    45 of 60 hours completed
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="w-full bg-white/50 dark:bg-gray-800/50 rounded-full h-3 mb-4">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                      style={{ width: '75%' }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Keep up the great work! 🎯
                  </p>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white dark:bg-gray-800 shadow-lg border-0 rounded-3xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
                      <Play className="w-5 h-5 text-blue-600" />
                    </div>
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full justify-start h-12 text-left font-medium"
                    onClick={() => (window.location.href = '/courses')}
                  >
                    <BookOpen className="w-5 h-5 mr-3" />
                    Browse Courses
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start h-12 text-left font-medium"
                    onClick={() => (window.location.href = '/learning')}
                  >
                    <Play className="w-5 h-5 mr-3" />
                    Continue Learning
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start h-12 text-left font-medium"
                    onClick={() => (window.location.href = '/account')}
                  >
                    <Award className="w-5 h-5 mr-3" />
                    View Certificates
                  </Button>
                </CardContent>
              </Card>

              {/* Achievement Badge */}
              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50 shadow-lg border-0 rounded-3xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                    First Steps
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Completed your first course
                  </p>
                  <div className="flex items-center justify-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      Achievement Unlocked
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="text-center pt-8 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              size="lg"
              onClick={handleLogout}
              className="px-8"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
