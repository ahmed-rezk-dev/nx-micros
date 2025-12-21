import { useState, useEffect } from 'react';
import {
  Input,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@nx-micros/ui';
import { useAuthStore, useCartStore } from 'shell/stores';
import {
  BookOpen,
  Search,
  Filter,
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
  duration: number; // in hours
  thumbnail: string;
  tags: string[];
  featured?: boolean;
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
  useCartStore();

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
      originalPrice: 129.99,
      rating: 4.8,
      totalRatings: 1247,
      totalStudents: 15420,
      duration: 12,
      thumbnail: '/api/placeholder/400/250',
      tags: ['React', 'JavaScript', 'Frontend'],
      featured: true,
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
      originalPrice: 159.99,
      rating: 4.7,
      totalRatings: 2156,
      totalStudents: 25600,
      duration: 20,
      thumbnail: '/api/placeholder/400/250',
      tags: ['Python', 'Data Science', 'ML'],
    },
    {
      id: '4',
      title: 'UI/UX Design Fundamentals',
      description: 'Create beautiful and user-friendly interfaces',
      instructor: 'Alex Rivera',
      category: 'Design',
      level: 'beginner',
      price: 79.99,
      rating: 4.6,
      totalRatings: 1432,
      totalStudents: 12800,
      duration: 10,
      thumbnail: '/api/placeholder/400/250',
      tags: ['UI/UX', 'Design', 'Figma'],
    },
    {
      id: '5',
      title: 'DevOps with Docker & Kubernetes',
      description: 'Master containerization and orchestration',
      instructor: 'James Wilson',
      category: 'DevOps',
      level: 'intermediate',
      price: 139.99,
      rating: 4.8,
      totalRatings: 987,
      totalStudents: 7650,
      duration: 16,
      thumbnail: '/api/placeholder/400/250',
      tags: ['Docker', 'Kubernetes', 'DevOps'],
    },
    {
      id: '6',
      title: 'Mobile App Development with React Native',
      description: 'Build cross-platform mobile apps',
      instructor: 'Lisa Park',
      category: 'Mobile Development',
      level: 'intermediate',
      price: 109.99,
      originalPrice: 149.99,
      rating: 4.5,
      totalRatings: 1654,
      totalStudents: 12300,
      duration: 14,
      thumbnail: '/api/placeholder/400/250',
      tags: ['React Native', 'Mobile', 'iOS', 'Android'],
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
            <Button className="w-full" onClick={() => window.location.href = '/auth'}>
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
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              Course Catalog
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover and enroll in our comprehensive collection of expert-led courses
            </p>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <Button onClick={handleSearch}>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-medium">Filters:</span>
                  </div>

                  <select
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="px-3 py-2 border border-input bg-background rounded-md text-sm"
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
            <CardTitle className="text-2xl font-bold">Course Catalog</CardTitle>
            <CardDescription className="text-lg mt-3">
              Sign in to explore our comprehensive course collection
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-10">
            <Button
              className="w-full py-4 text-lg rounded-2xl"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              Course Catalog
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover and enroll in our comprehensive collection of expert-led
              courses
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border-0 p-8">
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search courses by title, instructor, or topic..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Filter className="w-5 h-5" />
                  <span className="font-medium">Filters:</span>
                </div>

                <select
                  value={filters.category || ''}
                  onChange={(e) =>
                    handleFilterChange('category', e.target.value)
                  }
                  className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl text-sm font-medium focus:border-blue-500 dark:focus:border-blue-400"
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
                  onChange={(e) => handleFilterChange('level', e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl text-sm font-medium focus:border-blue-500 dark:focus:border-blue-400"
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
                  className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl text-sm font-medium focus:border-blue-500 dark:focus:border-blue-400"
                >
                  <option value="title-ASC">Title A-Z</option>
                  <option value="title-DESC">Title Z-A</option>
                  <option value="price-ASC">Price: Low to High</option>
                  <option value="price-DESC">Price: High to Low</option>
                  <option value="rating-DESC">Highest Rated</option>
                  <option value="totalStudents-DESC">Most Popular</option>
                </select>

                {(filters.category || filters.level || filters.search) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilters({ sortBy: 'title', sortOrder: 'ASC' });
                      setSearchQuery('');
                    }}
                    className="px-4 py-3 rounded-xl font-medium"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Course Grid */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <div className="h-48 bg-muted animate-pulse"></div>
                    <CardContent className="p-6 space-y-4">
                      <div className="h-6 bg-muted rounded animate-pulse"></div>
                      <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
                      <div className="flex justify-between items-center pt-4">
                        <div className="h-6 bg-muted rounded w-20 animate-pulse"></div>
                        <div className="h-10 bg-muted rounded w-24 animate-pulse"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">
                    Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCourses.map((course) => (
                    <Card key={course.id} className="hover:shadow-md transition-shadow">
                      <div className="relative">
                        <div className="h-48 bg-muted flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-muted-foreground" />
                        </div>
                        {course.featured && (
                          <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                            FEATURED
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs">
                          {course.level}
                        </div>
                      </div>

                      <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                          <CardTitle className="text-lg line-clamp-2">
                            {course.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {course.description}
                          </CardDescription>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{course.instructor}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">
                                {course.rating}
                              </span>
                              <span className="text-muted-foreground">
                                ({course.totalRatings})
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{course.duration} hours</span>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="space-y-1">
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
                          <Button
                            onClick={() => handleAddToCart(course)}
                            disabled={hasCourse(course.id)}
                            size="sm"
                          >
                            {hasCourse(course.id) ? 'In Cart' : 'Add to Cart'}
                          </Button>
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
                    <h3 className="text-xl font-semibold mb-2">No courses found</h3>
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
