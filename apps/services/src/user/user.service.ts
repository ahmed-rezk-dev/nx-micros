import { Injectable, NotFoundException } from '@nestjs/common';

// Mock user data - will be replaced with database integration
interface User {
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

@Injectable()
export class UserService {
  private users: User[] = [
    {
      id: '1',
      email: 'demo@nx-micros.com',
      firstName: 'Demo',
      lastName: 'User',
      role: 'student',
      isActive: true,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
  ];

  async create(data: any): Promise<any> {
    const user = {
      id: Date.now().toString(),
      ...data,
      role: data.role || 'student',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async findAll(
    options: { page?: number; limit?: number; search?: string } = {},
  ): Promise<any> {
    const { page = 1, limit = 10, search } = options;
    let filteredUsers = this.users;

    if (search) {
      filteredUsers = this.users.filter(
        (user) =>
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.firstName?.toLowerCase().includes(search.toLowerCase()) ||
          user.lastName?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
      data: paginatedUsers,
      total: filteredUsers.length,
      page,
      limit,
      totalPages: Math.ceil(filteredUsers.length / limit),
      hasNext: endIndex < filteredUsers.length,
      hasPrev: page > 1,
    };
  }

  async findOne(id: string): Promise<any> {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, data: any): Promise<any> {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = {
      ...this.users[userIndex],
      ...data,
      updatedAt: new Date(),
    };
    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }
    this.users.splice(userIndex, 1);
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
