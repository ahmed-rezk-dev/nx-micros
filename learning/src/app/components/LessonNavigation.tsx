import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Separator,
  Progress,
} from '@nx-micros/ui';
import { apiClient } from 'shell/stores';
import { LoadingCard } from './LoadingSpinner';
import {
  CheckCircle,
  Play,
  FileText,
  Brain,
  Clock,
  BarChart3,
  ArrowLeft,
} from 'lucide-react';

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

  if (loading) {
    return <LoadingCard />;
  }

  if (!course) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">
            Course not found
          </div>
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
    <div className="flex flex-col gap-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Course Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-4">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {completedLessons}/{course.lessons.length} lessons
              </span>
            </div>
            <Progress value={progressPercentage} className="mb-4" />
            <div className="text-center text-sm font-medium">
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
          <div className="divide-y">
            {course.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className={`p-4 cursor-pointer hover:bg-muted/50 transition-all duration-200 ${
                  lessonId === lesson.id
                    ? 'bg-primary/5 border-l-4 border-primary shadow-sm'
                    : ''
                }`}
                onClick={() => handleLessonClick(lesson)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {progress[lesson.id] ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : lesson.type === 'video' ? (
                      <Play className="w-5 h-5 text-primary" />
                    ) : lesson.type === 'text' ? (
                      <FileText className="w-5 h-5 text-primary" />
                    ) : (
                      <Brain className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <p
                        className={`text-sm font-medium truncate ${
                          progress[lesson.id]
                            ? 'text-muted-foreground'
                            : 'text-foreground'
                        }`}
                      >
                        {lesson.title}
                      </p>
                      <Badge variant="outline" className="text-xs ml-2">
                        {lesson.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {Math.floor(lesson.duration / 60)}:
                      {(lesson.duration % 60).toString().padStart(2, '0')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4 flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/learning/progress')}
          >
            View Full Progress
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/courses')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
