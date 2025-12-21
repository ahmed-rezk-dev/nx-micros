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
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg aspect-video mb-6 flex items-center justify-center relative overflow-hidden">
              <div className="text-white text-center z-10">
                <div className="text-6xl mb-4 animate-bounce">🎥</div>
                <p className="font-semibold text-lg mb-2">Video Lesson</p>
                <p className="text-sm opacity-75">
                  Duration: {Math.floor(currentLesson.duration / 60)}:
                  {(currentLesson.duration % 60).toString().padStart(2, '0')}
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>
            </div>
          )}

          {/* Text Content */}
          {currentLesson.type === 'text' && (
            <div className="prose max-w-none mb-6">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-lg shadow-sm border border-gray-200">
                <div
                  className="text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                />
              </div>
            </div>
          )}

          {/* Quiz Placeholder */}
          {currentLesson.type === 'quiz' && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg mb-6 border-2 border-dashed border-blue-200">
              <div className="text-center">
                <div className="text-6xl mb-4 animate-pulse">📝</div>
                <h4 className="text-xl font-semibold mb-2 text-blue-900">
                  Interactive Quiz
                </h4>
                <p className="text-gray-600 mb-4">
                  Test your knowledge with this lesson quiz.
                </p>
                <div className="bg-white rounded-lg p-4 shadow-sm inline-block">
                  <p className="text-sm text-gray-500">Coming Soon</p>
                </div>
              </div>
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
