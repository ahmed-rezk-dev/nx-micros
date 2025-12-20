// User DTOs
export class CreateUserDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
}

export class UpdateUserDto {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatarUrl?: string;
}

export class UserResponseDto {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  bio?: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Course DTOs
export class CreateCourseDto {
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  accessType: 'lifetime' | 'subscription';
  price?: number;
  currency?: string;
  durationHours?: number;
  thumbnailUrl?: string;
  videoPreviewUrl?: string;
}

export class UpdateCourseDto {
  title?: string;
  description?: string;
  shortDescription?: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  accessType?: 'lifetime' | 'subscription';
  price?: number;
  currency?: string;
  durationHours?: number;
  thumbnailUrl?: string;
  videoPreviewUrl?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
}

export class CourseResponseDto {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  instructorId: string;
  category: string;
  level: string;
  accessType: string;
  price?: number;
  currency: string;
  durationHours?: number;
  thumbnailUrl?: string;
  videoPreviewUrl?: string;
  isPublished: boolean;
  isFeatured: boolean;
  totalStudents: number;
  rating: number;
  totalRatings: number;
  createdAt: Date;
  updatedAt: Date;
}

// Authentication DTOs
export class LoginDto {
  email: string;
  password: string;
}

export class RegisterDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export class AuthResponseDto {
  accessToken: string;
  refreshToken?: string;
  user: UserResponseDto;
  expiresIn: number;
}

// Subscription DTOs
export class CreateSubscriptionDto {
  planType: 'basic' | 'premium' | 'enterprise';
  paymentMethod: string;
}

export class SubscriptionResponseDto {
  id: string;
  userId: string;
  planType: string;
  status: string;
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

// Progress DTOs
export class UpdateProgressDto {
  lessonId: string;
  progressPercentage: number;
  timeSpentSeconds?: number;
}

export class ProgressResponseDto {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  progressPercentage: number;
  timeSpentSeconds: number;
  isCompleted: boolean;
  completedAt?: Date;
  lastAccessed: Date;
}

// Course Purchase DTOs
export class PurchaseCourseDto {
  courseId: string;
  paymentMethod: string;
}

export class CoursePurchaseResponseDto {
  id: string;
  userId: string;
  courseId: string;
  purchaseDate: Date;
  pricePaid: number;
  currency: string;
  paymentMethod: string;
  transactionId: string;
}

// Community DTOs
export class CreatePostDto {
  courseId?: string;
  title: string;
  content: string;
  postType?: 'discussion' | 'question' | 'announcement';
}

export class CreateCommentDto {
  postId: string;
  content: string;
  parentCommentId?: string;
}

export class CommunityPostResponseDto {
  id: string;
  userId: string;
  courseId?: string;
  title: string;
  content: string;
  postType: string;
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Certificate DTOs
export class CertificateResponseDto {
  id: string;
  userId: string;
  courseId: string;
  certificateNumber: string;
  issuedDate: Date;
  expiryDate?: Date;
  downloadUrl: string;
}

// Pagination DTOs
export class PaginationQueryDto {
  page?: number = 1;
  limit?: number = 10;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export class PaginatedResponseDto<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Search DTOs
export class CourseSearchDto extends PaginationQueryDto {
  query?: string;
  category?: string;
  level?: string;
  accessType?: string;
  minPrice?: number;
  maxPrice?: number;
  instructorId?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
}

// Error DTOs
export class ErrorResponseDto {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: Date;
  path: string;
}

// Health Check DTO
export class HealthCheckResponseDto {
  status: string;
  timestamp: Date;
  uptime: number;
  services: {
    database: boolean;
    valkey: boolean;
    sqs: boolean;
  };
}
