import { useEffect, useState } from 'react';
import NxWelcome from './nx-welcome';
import {
  apiClient,
  useAuthStore,
  useCartStore,
  useUIStore,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
} from '@nx-micros/ui';
import { useToast } from '@nx-micros/ui';

interface Course {
  id: string;
  title: string;
  description?: string;
  shortDescription?: string;
  category?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price?: number;
  currency?: string;
  rating?: number;
  totalStudents?: number;
  thumbnailUrl?: string;
  instructor?: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
  isPublished: boolean;
}

interface CourseFilters {
  category?: string;
  level?: string;
  search?: string;
  sortBy?: 'title' | 'price' | 'rating' | 'totalStudents';
  sortOrder?: 'ASC' | 'DESC';
}

export function App() {
  const { isAuthenticated } = useAuthStore();
  const { items: cartItems, addCourse, hasCourse } = useCartStore();
  const { setLoading, isLoading } = useUIStore();
  const { addToast } = useToast();

  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState<CourseFilters>({
    sortBy: 'title',
    sortOrder: 'ASC',
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCourses();
    loadCategories();
  }, [filters]);

  const loadCourses = async () => {
    try {
      setLoading('courses', true);

      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.level) queryParams.append('level', filters.level);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

      const response = await apiClient.get<{
        data: Course[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>(`/courses?${queryParams.toString()}`);

      setCourses(response.data);
    } catch (error) {
      console.error('Failed to load courses:', error);
      addToast({
        title: 'Error',
        description: 'Failed to load courses. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading('courses', false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await apiClient.get<string[]>('/courses/categories');
      setCategories(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to load categories:', error);
      setCategories([]);
    }
  };

  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      search: searchQuery || undefined,
    }));
  };

  const handleFilterChange = (key: keyof CourseFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleEnroll = async (course: Course) => {
    if (!isAuthenticated) {
      addToast({
        title: 'Authentication Required',
        description: 'Please log in to enroll in courses.',
        type: 'warning',
      });
      return;
    }

    if (hasCourse(course.id)) {
      addToast({
        title: 'Already Enrolled',
        description: 'You are already enrolled in this course.',
        type: 'info',
      });
      return;
    }

    try {
      addCourse(course);
      addToast({
        title: 'Added to Cart',
        description: `${course.title} has been added to your cart.`,
        type: 'success',
      });
    } catch (error) {
      console.error('Failed to enroll in course:', error);
      addToast({
        title: 'Error',
        description: 'Failed to enroll in course. Please try again.',
        type: 'error',
      });
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Course Catalog
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover and enroll in our comprehensive course collection
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading('courses')}>
              Search
            </Button>
          </div>

          <div className="flex flex-wrap gap-4">
            <select
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="">All Categories</option>
              {Array.isArray(categories) &&
                categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>

            <select
              value={filters.level || ''}
              onChange={(e) => handleFilterChange('level', e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select
              value={`${filters.sortBy || 'title'}-${filters.sortOrder || 'ASC'}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                setFilters((prev) => ({
                  ...prev,
                  sortBy: sortBy as any,
                  sortOrder: sortOrder as any,
                }));
              }}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="title-ASC">Title A-Z</option>
              <option value="title-DESC">Title Z-A</option>
              <option value="price-ASC">Price Low-High</option>
              <option value="price-DESC">Price High-Low</option>
              <option value="rating-DESC">Highest Rated</option>
              <option value="totalStudents-DESC">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading('courses') && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading courses...</p>
          </div>
        )}

        {/* Course Grid */}
        {!isLoading('courses') && (
          <>
            {courses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No courses found matching your criteria.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() =>
                    setFilters({ sortBy: 'title', sortOrder: 'ASC' })
                  }
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {courses.map((course) => (
                  <Card
                    key={course.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Course Thumbnail */}
                    <div className="aspect-video bg-muted relative">
                      {course.thumbnailUrl ? (
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                          <div className="text-4xl opacity-50">📚</div>
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}
                        >
                          {course.level}
                        </span>
                      </div>
                    </div>

                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-2">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {course.shortDescription || course.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Course Meta */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{course.category}</span>
                        {course.totalStudents && (
                          <span>{course.totalStudents} students</span>
                        )}
                      </div>

                      {/* Rating */}
                      {course.rating && (
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-sm font-medium">
                            {course.rating.toFixed(1)}
                          </span>
                        </div>
                      )}

                      {/* Instructor */}
                      {course.instructor && (
                        <div className="text-sm text-muted-foreground">
                          By {course.instructor.firstName}{' '}
                          {course.instructor.lastName}
                        </div>
                      )}

                      {/* Price and Enroll */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="text-lg font-bold">
                          {course.price ? (
                            <span>
                              ${course.price} {course.currency?.toUpperCase()}
                            </span>
                          ) : (
                            <span className="text-green-600">Free</span>
                          )}
                        </div>
                        <Button
                          onClick={() => handleEnroll(course)}
                          disabled={hasCourse(course.id)}
                          size="sm"
                        >
                          {hasCourse(course.id) ? 'In Cart' : 'Enroll'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <div className="fixed bottom-4 right-4 z-50">
            <Card className="shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-sm">
                    <span className="font-medium">{cartItems.length}</span>{' '}
                    course{cartItems.length !== 1 ? 's' : ''} in cart
                  </div>
                  <Button size="sm">View Cart</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t">
          <NxWelcome title="Courses Microfrontend" />
        </div>
      </div>
    </div>
  );
}

export default App;
