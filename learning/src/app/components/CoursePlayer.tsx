import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  Play,
  FileText,
  Brain,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
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

export default function CoursePlayer() {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId?: string;
  }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  useEffect(() => {
    if (course && lessonId) {
      const lesson = course.lessons.find((l) => l.id === lessonId);
      setCurrentLesson(lesson || course.lessons[0] || null);
    } else if (course && !lessonId) {
      setCurrentLesson(course.lessons[0] || null);
    }
  }, [course, lessonId]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const response = (await apiClient.get(`/courses/${courseId}`)) as {
        data: Course;
      };
      setCourse(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load course');
      console.error('Error loading course:', err);
    } finally {
      setLoading(false);
    }
  };

  const markLessonComplete = async (lessonId: string) => {
    try {
      await apiClient.post(`/courses/${courseId}/lessons/${lessonId}/complete`);
      // Refresh course data to update progress
      loadCourse();
    } catch (err) {
      console.error('Error marking lesson complete:', err);
    }
  };

  if (loading) {
    return <LoadingCard />;
  }

  if (error || !course) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            {error || 'Course not found'}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentLesson) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            No lessons available in this course
          </div>
        </CardContent>
      </Card>
    );
  }

  const completedLessons = course.lessons.filter(
    (lesson) => lesson.completed,
  ).length;
  const progressPercentage = Math.round(
    (completedLessons / course.lessons.length) * 100,
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Course Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>{course.title}</span>
            <Badge variant="secondary">{progressPercentage}% Complete</Badge>
          </CardTitle>
          <Progress value={progressPercentage} className="mt-2" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <span>
              Lesson {currentLesson.order} of {course.lessons.length}
            </span>
            <span>{completedLessons} completed</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {currentLesson.type === 'video' && (
              <Play className="w-5 h-5 text-primary" />
            )}
            {currentLesson.type === 'text' && (
              <FileText className="w-5 h-5 text-primary" />
            )}
            {currentLesson.type === 'quiz' && (
              <Brain className="w-5 h-5 text-primary" />
            )}
            <span>{currentLesson.title}</span>
            <Badge
              variant={
                currentLesson.type === 'video'
                  ? 'default'
                  : currentLesson.type === 'text'
                    ? 'secondary'
                    : 'destructive'
              }
            >
              {currentLesson.type}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-muted-foreground mb-4">
              {currentLesson.description}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>
                {Math.floor(currentLesson.duration / 60)}:
                {(currentLesson.duration % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Video Player Placeholder */}
          {currentLesson.type === 'video' && (
            <div className="bg-gradient-to-br from-background to-muted rounded-lg aspect-video mb-6 flex items-center justify-center relative overflow-hidden border">
              <div className="text-foreground text-center z-10">
                <Play className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
                <p className="font-semibold text-lg mb-2">Video Lesson</p>
                <p className="text-sm text-muted-foreground">
                  Duration: {Math.floor(currentLesson.duration / 60)}:
                  {(currentLesson.duration % 60).toString().padStart(2, '0')}
                </p>
              </div>
            </div>
          )}

          {/* Text Content */}
          {currentLesson.type === 'text' && (
            <div className="prose max-w-none mb-6">
              <Card className="p-8 bg-muted/30">
                <div
                  className="text-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                />
              </Card>
            </div>
          )}

          {/* Quiz Placeholder */}
          {currentLesson.type === 'quiz' && (
            <Card className="p-8 mb-6 border-dashed border-2 bg-primary/5">
              <div className="text-center">
                <Brain className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
                <h4 className="text-xl font-semibold mb-2">Interactive Quiz</h4>
                <p className="text-muted-foreground mb-4">
                  Test your knowledge with this lesson quiz.
                </p>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
            </Card>
          )}

          <Separator className="my-6" />

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button variant="outline" disabled={currentLesson.order === 1}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous Lesson
            </Button>
            <Button
              onClick={() => markLessonComplete(currentLesson.id)}
              className={
                currentLesson.completed ? 'bg-green-600 hover:bg-green-700' : ''
              }
            >
              {currentLesson.completed ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Completed
                </>
              ) : (
                'Mark as Complete'
              )}
            </Button>
            <Button disabled={currentLesson.order === course.lessons.length}>
              Next Lesson
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
