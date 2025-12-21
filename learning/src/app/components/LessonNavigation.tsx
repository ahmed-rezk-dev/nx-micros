import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from '@nx-micros/ui';
import { apiClient } from 'shell/stores';
import { LoadingCard } from './LoadingSpinner';

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  type: 'video' | 'text' | 'quiz';
  duration: number;
  order: number;
  completed?: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export default function LessonNavigation() {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId?: string;
  }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<{ [lessonId: string]: boolean }>({});

  useEffect(() => {
    if (courseId) {
      loadCourse();
      loadProgress();
    }
  }, [courseId]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const response = (await apiClient.get(`/courses/${courseId}`)) as {
        data: Course;
      };
      setCourse(response.data);
    } catch (err) {
      console.error('Error loading course:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const response = (await apiClient.get(
        `/courses/${courseId}/progress`,
      )) as { data: { lessonId: string; completed: boolean }[] };
      const progressMap = response.data.reduce(
        (acc, item) => {
          acc[item.lessonId] = item.completed;
          return acc;
        },
        {} as { [lessonId: string]: boolean },
      );
      setProgress(progressMap);
    } catch (err) {
      console.error('Error loading progress:', err);
    }
  };

  const handleLessonClick = (lesson: Lesson) => {
    navigate(`/learning/course/${courseId}/lesson/${lesson.id}`);
  };

  const getLessonIcon = (type: string, completed: boolean) => {
    if (completed) return '✅';

    switch (type) {
      case 'video':
        return '🎥';
      case 'text':
        return '📄';
      case 'quiz':
        return '📝';
      default:
        return '📚';
    }
  };

  if (loading) {
    return <LoadingCard />;
  }

  if (!course) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="text-center text-gray-600">Course not found</div>
        </CardContent>
      </Card>
    );
  }

  const completedLessons = course.lessons.filter(
    (lesson) => progress[lesson.id],
  ).length;
  const progressPercentage = Math.round(
    (completedLessons / course.lessons.length) * 100,
  );

  return (
    <div className="space-y-4">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Course Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>
                {completedLessons}/{course.lessons.length} lessons
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="text-center mt-2 text-sm font-medium">
              {progressPercentage}% Complete
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lesson List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lessons</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {course.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  lessonId === lesson.id
                    ? 'bg-blue-50 border-l-4 border-blue-500'
                    : ''
                }`}
                onClick={() => handleLessonClick(lesson)}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-lg">
                    {getLessonIcon(lesson.type, progress[lesson.id] || false)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        progress[lesson.id] ? 'text-gray-500' : 'text-gray-900'
                      }`}
                    >
                      {lesson.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {lesson.type.charAt(0).toUpperCase() +
                        lesson.type.slice(1)}{' '}
                      • {Math.floor(lesson.duration / 60)}:
                      {(lesson.duration % 60).toString().padStart(2, '0')}
                    </p>
                  </div>
                  {progress[lesson.id] && (
                    <div className="text-green-600 text-sm font-medium">✓</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4">
          <Button
            variant="outline"
            className="w-full mb-2"
            onClick={() => navigate('/learning/progress')}
          >
            View Full Progress
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/courses')}
          >
            Back to Courses
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
