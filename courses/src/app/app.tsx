import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Separator,
  Skeleton,
} from '@nx-micros/ui';
import { useAuthStore } from 'shell/stores';
import {
  BookOpen,
  Search,
  Filter,
  Star,
  Users,
  Clock,
  User,
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  originalPrice?: number;
  rating: number;
  totalRatings: number;
  totalStudents: number;
  duration: number;
  thumbnail: string;
  tags: string[];
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [categories] = useState<string[]>([
    'Web Development',
    'Data Science',
    'Mobile Development',
    'DevOps',
    'Design',
    'Business',
  ]);
  const [filters, setFilters] = useState<CourseFilters>({
    sortBy: 'title',
    sortOrder: 'ASC',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock course data
  const mockCourses: Course[] = [
    {
      id: '1',
      title: 'React Fundamentals',
      description:
        'Master the basics of React development with hands-on projects',
      instructor: 'Sarah Johnson',
      category: 'Web Development',
      level: 'beginner',
      price: 89.99,
      rating: 4.8,
      totalRatings: 1247,
      totalStudents: 15420,
      duration: 12,
      thumbnail: '/api/placeholder/400/250',
      tags: ['React', 'JavaScript', 'Frontend'],
    },
    {
      id: '2',
      title: 'Advanced Node.js',
      description:
        'Build scalable backend applications with Node.js and Express',
      instructor: 'Mike Chen',
      category: 'Web Development',
      level: 'advanced',
      price: 149.99,
      rating: 4.9,
      totalRatings: 892,
      totalStudents: 8920,
      duration: 18,
      thumbnail: '/api/placeholder/400/250',
      tags: ['Node.js', 'Backend', 'API'],
    },
    {
      id: '3',
      title: 'Python for Data Science',
      description: 'Learn data analysis and machine learning with Python',
      instructor: 'Dr. Emily Davis',
      category: 'Data Science',
      level: 'intermediate',
      price: 119.99,
      rating: 4.7,
      totalRatings: 2156,
      totalStudents: 25600,
      duration: 20,
      thumbnail: '/api/placeholder/400/250',
      tags: ['Python', 'Data Science', 'ML'],
    },
  ];

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    filterAndSortCourses();
  }, [courses, filters]);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCourses(mockCourses);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortCourses = () => {
    let filtered = [...courses];

    // Apply filters
    if (filters.search) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
          course.description
            .toLowerCase()
            .includes(filters.search!.toLowerCase()) ||
          course.instructor
            .toLowerCase()
            .includes(filters.search!.toLowerCase()),
      );
    }

    if (filters.category) {
      filtered = filtered.filter(
        (course) => course.category === filters.category,
      );
    }

    if (filters.level) {
      filtered = filtered.filter((course) => course.level === filters.level);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[filters.sortBy || 'title'];
      let bValue: any = b[filters.sortBy || 'title'];

      if (filters.sortBy === 'title') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (filters.sortOrder === 'DESC') {
        return aValue < bValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

    setFilteredCourses(filtered);
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle>Course Catalog</CardTitle>
            <CardDescription>
              Sign in to explore our comprehensive course collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => (window.location.href = '/auth')}
            >
              Sign In to Browse Courses
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
          <div className="text-center flex flex-col gap-4">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              Course Catalog
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover and enroll in our comprehensive collection of expert-led
              courses
            </p>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <Button onClick={handleSearch}>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>

                <Separator />

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-medium">Filters:</span>
                  </div>

                  <select
                    value={filters.category || ''}
                    onChange={(e) =>
                      handleFilterChange('category', e.target.value)
                    }
                    className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filters.level || ''}
                    onChange={(e) =>
                      handleFilterChange('level', e.target.value)
                    }
                    className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                    className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="title-ASC">Title A-Z</option>
                    <option value="title-DESC">Title Z-A</option>
                    <option value="price-ASC">Price Low-High</option>
                    <option value="price-DESC">Price High-Low</option>
                    <option value="rating-DESC">Highest Rated</option>
                    <option value="totalStudents-DESC">Most Popular</option>
                  </select>

                  {(filters.category || filters.level || filters.search) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFilters({ sortBy: 'title', sortOrder: 'ASC' });
                        setSearchQuery('');
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Grid */}
          <div className="flex flex-col gap-6">
            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="h-48 w-full" />
                    <CardContent>
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex justify-between items-center pt-4">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-10 w-24" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">
                    Showing {filteredCourses.length} course
                    {filteredCourses.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCourses.map((course) => (
                    <Card
                      key={course.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <div className="relative">
                        <div className="h-48 bg-muted flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <div className="absolute top-3 right-3">
                          <Badge
                            variant={
                              course.level === 'beginner'
                                ? 'default'
                                : course.level === 'intermediate'
                                  ? 'secondary'
                                  : 'destructive'
                            }
                          >
                            {course.level}
                          </Badge>
                        </div>
                      </div>

                      <CardContent>
                        <div className="flex flex-col gap-2">
                          <CardTitle className="text-lg line-clamp-2">
                            {course.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {course.description}
                          </CardDescription>
                        </div>

                        <div className="flex items-center gap-4">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={`/api/placeholder/32/32`} />
                            <AvatarFallback>
                              <User className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {course.instructor}
                            </p>
                            <div className="flex items-center gap-6 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span>{course.rating}</span>
                                <span>({course.totalRatings})</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>
                                  {course.totalStudents.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{course.duration}h</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {course.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between pt-4">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold">
                                ${course.price}
                              </span>
                              {course.originalPrice && (
                                <span className="text-lg text-muted-foreground line-through">
                                  ${course.originalPrice}
                                </span>
                              )}
                            </div>
                            {course.originalPrice && (
                              <div className="text-sm text-green-600 font-medium">
                                Save ${course.originalPrice - course.price}
                              </div>
                            )}
                          </div>
                          <Button size="sm">View Course</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredCourses.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      No courses found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search criteria or browse all courses
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFilters({ sortBy: 'title', sortOrder: 'ASC' });
                        setSearchQuery('');
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
