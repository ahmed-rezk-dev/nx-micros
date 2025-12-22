import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from '@nx-micros/ui';
import { apiClient } from 'shell/stores';
import { LoadingCard } from './LoadingSpinner';

interface CourseProgress {
  courseId: string;
  courseTitle: string;
  totalLessons: number;
  completedLessons: number;
  lastAccessed: string;
  progressPercentage: number;
}

export default function LearningProgress() {
  const [progress, setProgress] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const response = (await apiClient.get('/users/progress')) as {
        data: CourseProgress[];
      };
      setProgress(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load progress');
      console.error('Error loading progress:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingCard />;
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center text-red-600">{error}</div>
        </CardContent>
      </Card>
    );
  }

  const totalCourses = progress.length;
  const completedCourses = progress.filter(
    (p) => p.progressPercentage === 100,
  ).length;
  const overallProgress =
    totalCourses > 0
      ? Math.round(
          progress.reduce((sum, p) => sum + p.progressPercentage, 0) /
            totalCourses,
        )
      : 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Learning Progress
        </h1>
        <p className="text-gray-600">
          Track your course completion and achievements
        </p>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {totalCourses}
              </div>
              <div className="text-sm text-gray-600">Total Courses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {completedCourses}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {overallProgress}%
              </div>
              <div className="text-sm text-gray-600">Average Progress</div>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Completion</span>
              <span>{overallProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Progress List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {progress.length === 0 ? (
          <Card className="md:col-span-2">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-lg font-semibold mb-2">
                No courses started yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start learning by enrolling in a course from the courses page.
              </p>
              <Button onClick={() => (window.location.href = '/courses')}>
                Browse Courses
              </Button>
            </CardContent>
          </Card>
        ) : (
          progress.map((course) => (
            <Card key={course.courseId}>
              <CardHeader>
                <CardTitle className="text-lg">{course.courseTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>
                      {course.completedLessons}/{course.totalLessons} lessons
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-center mt-2 text-sm font-medium">
                    {course.progressPercentage}% Complete
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-4">
                  Last accessed:{' '}
                  {new Date(course.lastAccessed).toLocaleDateString()}
                </div>
                <Button
                  className="w-full"
                  onClick={() =>
                    (window.location.href = `/learning/course/${course.courseId}`)
                  }
                >
                  {course.progressPercentage === 100
                    ? 'Review Course'
                    : 'Continue Learning'}
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Achievements Section */}
      {completedCourses > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="mr-2">🏆</span>
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {completedCourses >= 1 && (
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl mb-2">🎓</div>
                  <div className="font-semibold">First Course</div>
                  <div className="text-sm text-gray-600">
                    Completed your first course
                  </div>
                </div>
              )}
              {completedCourses >= 3 && (
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl mb-2">📚</div>
                  <div className="font-semibold">Bookworm</div>
                  <div className="text-sm text-gray-600">
                    Completed 3 courses
                  </div>
                </div>
              )}
              {completedCourses >= 5 && (
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="font-semibold">Expert</div>
                  <div className="text-sm text-gray-600">
                    Completed 5 courses
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
