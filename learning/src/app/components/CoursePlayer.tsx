import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
          <div className="text-center text-red-600">
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
          <div className="text-center text-gray-600">
            No lessons available in this course
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{course.title}</span>
            <span className="text-sm font-normal text-gray-500">
              Lesson {currentLesson.order} of {course.lessons.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">
              {currentLesson.title}
            </h3>
            <p className="text-gray-600 mb-4">{currentLesson.description}</p>
          </div>

          {/* Video Player Placeholder */}
          {currentLesson.type === 'video' && (
            <div className="bg-black rounded-lg aspect-video mb-6 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-6xl mb-4">🎥</div>
                <p>Video Player</p>
                <p className="text-sm opacity-75">
                  Duration: {Math.floor(currentLesson.duration / 60)}:
                  {(currentLesson.duration % 60).toString().padStart(2, '0')}
                </p>
              </div>
            </div>
          )}

          {/* Text Content */}
          {currentLesson.type === 'text' && (
            <div className="prose max-w-none mb-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div
                  dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                />
              </div>
            </div>
          )}

          {/* Quiz Placeholder */}
          {currentLesson.type === 'quiz' && (
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h4 className="text-lg font-semibold mb-4">Quiz</h4>
              <p className="text-gray-600 mb-4">
                Interactive quiz will be implemented here.
              </p>
              <div className="text-center text-4xl">📝</div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button variant="outline" disabled={currentLesson.order === 1}>
              Previous Lesson
            </Button>
            <Button
              onClick={() => markLessonComplete(currentLesson.id)}
              className="bg-green-600 hover:bg-green-700"
            >
              Mark as Complete
            </Button>
            <Button disabled={currentLesson.order === course.lessons.length}>
              Next Lesson
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
