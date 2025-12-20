import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private cacheService: CacheService,
  ) {}

  async create(data: any): Promise<User> {
    const user = this.userRepository.create({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      bio: data.bio,
      role: data.role || 'student',
      isActive: true,
      emailVerified: false,
    });
    return this.userRepository.save(user);
  }

  async findAll(
    options: { page?: number; limit?: number; search?: string } = {},
  ): Promise<{
    data: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const { page = 1, limit = 10, search } = options;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (search) {
      queryBuilder.where(
        'user.email ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search',
        { search: `%${search}%` },
      );
    }

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

  async findOne(id: string): Promise<User> {
    // Try to get from cache first
    const cacheKey = `user:${id}`;
    const cachedUser = await this.cacheService.get<User>(cacheKey);
    if (cachedUser) {
      return cachedUser;
    }

    // Get from database
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Cache the user for 1 hour
    await this.cacheService.set(cacheKey, user, 3600);
    return user;
  }

  async update(id: string, data: any): Promise<User> {
    await this.userRepository.update(id, data);
    // Invalidate cache
    await this.cacheService.delete(`user:${id}`);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
    // Invalidate cache
    await this.cacheService.delete(`user:${id}`);
  }

  async getProfile(id: string): Promise<any> {
    const user = await this.findOne(id);
    // Add profile-specific data
    return {
      ...user,
      enrolledCourses: 3,
      completedCourses: 1,
      totalStudyTime: 45, // hours
      achievements: ['First Login', 'Course Completed'],
    };
  }

  async getStats(id: string): Promise<any> {
    await this.findOne(id); // Ensure user exists
    return {
      totalCoursesEnrolled: 3,
      completedCourses: 1,
      inProgressCourses: 2,
      totalStudyHours: 45,
      averageScore: 85,
      certificatesEarned: 1,
      streakDays: 7,
    };
  }
}
