import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Course } from '../entities/course.entity';
import { User } from '../entities/user.entity';
import { CacheService } from '../cache/cache.service';

export interface CourseFilters {
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  accessType?: 'lifetime' | 'subscription';
  instructorId?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  priceMin?: number;
  priceMax?: number;
  search?: string;
}

export interface CoursePaginationOptions {
  page?: number;
  limit?: number;
  sortBy?:
    | 'createdAt'
    | 'updatedAt'
    | 'title'
    | 'price'
    | 'rating'
    | 'totalStudents';
  sortOrder?: 'ASC' | 'DESC';
}

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private cacheService: CacheService,
  ) {}

  async create(data: Partial<Course>, instructorId?: string): Promise<Course> {
    // Verify instructor exists and is active
    if (instructorId) {
      const instructor = await this.userRepository.findOne({
        where: { id: instructorId, isActive: true },
      });
      if (!instructor) {
        throw new NotFoundException('Instructor not found');
      }
    }

    const course = this.courseRepository.create({
      ...data,
      instructorId,
      level: data.level || 'beginner',
      accessType: data.accessType || 'subscription',
      currency: data.currency || 'USD',
      isPublished: data.isPublished || false,
      isFeatured: data.isFeatured || false,
      totalStudents: 0,
      rating: 0.0,
      totalRatings: 0,
    });

    const savedCourse = await this.courseRepository.save(course);

    // Cache the course for 6 hours (courses don't change frequently)
    await this.cacheService.set(`course:${savedCourse.id}`, savedCourse, 21600);

    return savedCourse;
  }

  async findAll(
    filters: CourseFilters = {},
    pagination: CoursePaginationOptions = {},
    userId?: string,
  ): Promise<{
    data: Course[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const {
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = pagination;

    const queryBuilder = this.courseRepository.createQueryBuilder('course');

    // Apply filters
    this.applyFilters(queryBuilder, filters, userId);

    // Apply sorting - use addSelect to avoid ordering issues with joins
    const sortField = this.mapSortField(sortBy);
    queryBuilder.orderBy(`course.${sortField}`, sortOrder);

    // Apply pagination
    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNext: page * limit < total,
      hasPrev: page > 1,
    };
  }

  async findOne(id: string, userId?: string): Promise<Course> {
    // Try cache first
    const cacheKey = `course:${id}`;
    const cachedCourse = await this.cacheService.get<Course>(cacheKey);
    if (cachedCourse) {
      return cachedCourse;
    }

    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['instructor'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Cache the course for 6 hours
    await this.cacheService.set(cacheKey, course, 21600);

    return course;
  }

  async update(
    id: string,
    data: Partial<Course>,
    userId?: string,
  ): Promise<Course> {
    const course = await this.findOne(id);

    // Check permissions (only instructor can update their own courses)
    if (userId && course.instructorId && course.instructorId !== userId) {
      throw new ForbiddenException('You can only update your own courses');
    }

    await this.courseRepository.update(id, data);

    // Invalidate cache
    await this.cacheService.delete(`course:${id}`);

    return this.findOne(id);
  }

  async remove(id: string, userId?: string): Promise<void> {
    const course = await this.findOne(id);

    // Check permissions (only instructor can delete their own courses)
    if (userId && course.instructorId && course.instructorId !== userId) {
      throw new ForbiddenException('You can only delete your own courses');
    }

    const result = await this.courseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Course not found');
    }

    // Invalidate cache
    await this.cacheService.delete(`course:${id}`);
  }

  async publish(id: string, userId?: string): Promise<Course> {
    const course = await this.findOne(id);

    // Check permissions (only instructor can publish their own courses)
    if (userId && course.instructorId && course.instructorId !== userId) {
      throw new ForbiddenException('You can only publish your own courses');
    }

    return this.update(id, { isPublished: true }, userId);
  }

  async unpublish(id: string, userId?: string): Promise<Course> {
    const course = await this.findOne(id);

    // Check permissions (only instructor can unpublish their own courses)
    if (userId && course.instructorId && course.instructorId !== userId) {
      throw new ForbiddenException('You can only unpublish your own courses');
    }

    return this.update(id, { isPublished: false }, userId);
  }

  async updateRating(
    id: string,
    newRating: number,
    userId?: string,
  ): Promise<Course> {
    const course = await this.findOne(id);

    if (!course.isPublished) {
      throw new ForbiddenException('Cannot rate unpublished courses');
    }

    // Calculate new average rating
    const currentTotal = course.rating * course.totalRatings;
    const newTotalRatings = course.totalRatings + 1;
    const newAverageRating = (currentTotal + newRating) / newTotalRatings;

    return this.update(
      id,
      {
        rating: Math.round(newAverageRating * 100) / 100, // Round to 2 decimal places
        totalRatings: newTotalRatings,
      },
      userId,
    );
  }

  async incrementStudentCount(id: string): Promise<Course> {
    const course = await this.findOne(id);

    return this.update(id, {
      totalStudents: course.totalStudents + 1,
    });
  }

  async getFeaturedCourses(limit: number = 6): Promise<Course[]> {
    const cacheKey = `courses:featured:${limit}`;
    const cachedCourses = await this.cacheService.get<Course[]>(cacheKey);
    if (cachedCourses) {
      return cachedCourses;
    }

    const courses = await this.courseRepository.find({
      where: { isPublished: true, isFeatured: true },
      relations: ['instructor'],
      order: { createdAt: 'DESC' },
      take: limit,
    });

    // Cache for 1 hour
    await this.cacheService.set(cacheKey, courses, 3600);

    return courses;
  }

  async getCoursesByInstructor(
    instructorId: string,
    includeUnpublished: boolean = false,
  ): Promise<Course[]> {
    const whereCondition: any = { instructorId };

    if (!includeUnpublished) {
      whereCondition.isPublished = true;
    }

    return this.courseRepository.find({
      where: whereCondition,
      relations: ['instructor'],
      order: { createdAt: 'DESC' },
    });
  }

  async getCategories(): Promise<string[]> {
    const result = await this.courseRepository
      .createQueryBuilder('course')
      .select('course.category')
      .where('course.category IS NOT NULL')
      .andWhere('course.is_published = :isPublished', { isPublished: true })
      .groupBy('course.category')
      .orderBy('COUNT(*)', 'DESC')
      .getRawMany();

    const categories = result.map((row: any) => row.course_category);

    // Cache for 24 hours
    await this.cacheService.set('courses:categories', categories, 86400);

    return categories;
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<Course>,
    filters: CourseFilters,
    userId?: string,
  ): void {
    const {
      category,
      level,
      accessType,
      instructorId,
      isPublished,
      isFeatured,
      priceMin,
      priceMax,
      search,
    } = filters;

    if (category) {
      queryBuilder.andWhere('course.category = :category', { category });
    }

    if (level) {
      queryBuilder.andWhere('course.level = :level', { level });
    }

    if (accessType) {
      queryBuilder.andWhere('course.accessType = :accessType', { accessType });
    }

    if (instructorId) {
      queryBuilder.andWhere('course.instructorId = :instructorId', {
        instructorId,
      });
    }

    if (isPublished !== undefined) {
      queryBuilder.andWhere('course.isPublished = :isPublished', {
        isPublished,
      });
    } else {
      // By default, only show published courses unless user is the instructor
      if (!userId) {
        queryBuilder.andWhere('course.isPublished = :isPublished', {
          isPublished: true,
        });
      }
    }

    if (isFeatured !== undefined) {
      queryBuilder.andWhere('course.isFeatured = :isFeatured', { isFeatured });
    }

    if (priceMin !== undefined) {
      queryBuilder.andWhere('course.price >= :priceMin', { priceMin });
    }

    if (priceMax !== undefined) {
      queryBuilder.andWhere('course.price <= :priceMax', { priceMax });
    }

    if (search) {
      queryBuilder.andWhere(
        '(course.title ILIKE :search OR course.description ILIKE :search OR course.shortDescription ILIKE :search)',
        { search: `%${search}%` },
      );
    }
  }

  private mapSortField(sortBy: string): string {
    const fieldMap: { [key: string]: string } = {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      title: 'title',
      price: 'price',
      rating: 'rating',
      totalStudents: 'total_students',
    };

    return fieldMap[sortBy] || 'created_at';
  }
}
