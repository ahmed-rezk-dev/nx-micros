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

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

interface WeeklyGoal {
  current: number;
  target: number;
}

export function App() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [weeklyGoal, setWeeklyGoal] = useState<WeeklyGoal | null>(null);
  const [currentStreak] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

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
          description: 'Continue your learning journey',
          timestamp: '2 hours ago',
          type: 'started',
        },
        {
          id: '2',
          title: 'Completed "JavaScript Basics"',
          description: 'Scored 95%',
          timestamp: '1 day ago',
          type: 'completed',
        },
      ];

      const mockAchievements: Achievement[] = [
        {
          id: 'first-steps',
          title: 'First Steps',
          description: 'Complete your first course',
          unlocked: true,
        },
        {
          id: 'week-warrior',
          title: 'Week Warrior',
          description: 'Study for 7 consecutive days',
          unlocked: true,
        },
      ];

      const mockWeeklyGoal: WeeklyGoal = {
        current: 45,
        target: 60,
      };

      setStats(mockStats);
      setActivities(mockActivities);
      setAchievements(mockAchievements);
      setWeeklyGoal(mockWeeklyGoal);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Sign in to continue your learning journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-12">
          {/* Header */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                    Welcome back, {user?.firstName || 'Student'}!
                  </h1>
                  <p className="text-muted-foreground">
                    Ready to continue your learning journey?
                  </p>
                  {currentStreak > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium text-muted-foreground">
                          {currentStreak} day streak
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm">
                  <Award className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <User className="w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Courses
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalCourses.toLocaleString() || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Available in catalog
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Enrolled</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.enrolledCourses || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently learning
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.completedCourses || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Courses finished
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Study Time
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalStudyTime || 0}h
                </div>
                <p className="text-xs text-muted-foreground">Time invested</p>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Goal & Achievements Row */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Weekly Goal */}
            {weeklyGoal && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Weekly Study Goal
                  </CardTitle>
                  <CardDescription>
                    {weeklyGoal.current}h of {weeklyGoal.target}h this week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">
                      {Math.round(
                        (weeklyGoal.current / weeklyGoal.target) * 100,
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${Math.min((weeklyGoal.current / weeklyGoal.target) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {weeklyGoal.target - weeklyGoal.current > 0
                      ? `${weeklyGoal.target - weeklyGoal.current}h remaining`
                      : 'Goal achieved! 🎉'}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Achievements Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Recent Achievements
                </CardTitle>
                <CardDescription>Your latest unlocked badges</CardDescription>
              </CardHeader>
              <CardContent>
                {achievements
                  .filter((a) => a.unlocked)
                  .slice(0, 3)
                  .map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Award className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {achievement.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  ))}
                <Button variant="outline" size="sm" className="w-full">
                  View All Achievements
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5" />
                  <div>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Your latest learning milestones
                    </CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex flex-col gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <div className="w-10 h-10 bg-muted rounded-full animate-pulse"></div>
                      <div className="flex flex-col gap-2 flex-1">
                        <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                        <div className="h-3 bg-muted rounded w-1/2 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        {activity.type === 'started' && (
                          <Play className="w-5 h-5 text-primary" />
                        )}
                        {activity.type === 'completed' && (
                          <Trophy className="w-5 h-5 text-primary" />
                        )}
                        {activity.type === 'enrolled' && (
                          <BookOpen className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {activity.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Continue your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Button
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => (window.location.href = '/courses')}
                >
                  <BookOpen className="w-6 h-6" />
                  <span className="text-sm">Browse Courses</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => (window.location.href = '/learning')}
                >
                  <Play className="w-6 h-6" />
                  <span className="text-sm">Continue Learning</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => (window.location.href = '/account')}
                >
                  <Award className="w-6 h-6" />
                  <span className="text-sm">View Certificates</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <Target className="w-6 h-6" />
                  <span className="text-sm">Set Goals</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;
