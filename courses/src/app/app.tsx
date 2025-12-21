import { useState } from 'react';
import { Input } from '@nx-micros/ui';
import { useAuth } from 'shell/stores';

// Type assertion for apiClient to fix TypeScript issues
// const typedApiClient = apiClient as {
//   get: <T>(url: string) => Promise<T>;
//   post: <T>(url: string, data?: any) => Promise<T>;
// };

interface CourseFilters {
  category?: string;
  level?: string;
  search?: string;
  sortBy?: 'title' | 'price' | 'rating' | 'totalStudents';
  sortOrder?: 'ASC' | 'DESC';
}

export function App() {
  const { isAuthenticated } = useAuth();
  // __AUTO_GENERATED_PRINT_VAR_START__
  console.log('App isAuthenticated:', isAuthenticated); // __AUTO_GENERATED_PRINT_VAR_END__
  // const { items: cartItems, addCourse, hasCourse } = useCart();
  // const { setLoading, isLoading } = useUI();

  const [categories] = useState<string[]>([]);
  const [filters, setFilters] = useState<CourseFilters>({
    sortBy: 'title',
    sortOrder: 'ASC',
  });
  const [searchQuery, setSearchQuery] = useState('');

  // const loadCategories = async () => {
  //   try {
  //     const response = await typedApiClient.get<string[]>(
  //       '/courses/categories',
  //     );
  //     setCategories(Array.isArray(response) ? response : []);
  //   } catch (error) {
  //     console.error('Failed to load categories:', error);
  //     // Fallback categories
  //     setCategories(['Web Development', 'Data Science', 'Mobile Development']);
  //   }
  // };

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

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
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

        {/* Course Grid */}

        {/* Cart Summary */}
      </div>
    </div>
  );
}

export default App;
