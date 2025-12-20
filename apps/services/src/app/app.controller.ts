import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

interface LoginDto {
  email: string;
  password: string;
}

interface RegisterDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('gateway-status')
  getGatewayStatus() {
    return {
      service: 'API Gateway',
      status: 'operational',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      endpoints: [
        '/api/health',
        '/api/auth/*',
        '/api/users/*',
        '/api/courses/*',
        '/api/subscriptions/*',
        '/api/community/*',
        '/api/analytics/*',
      ],
    };
  }

  // Basic authentication endpoints (will be moved to Auth service later)
  @Post('auth/login')
  async login(@Body() loginDto: LoginDto) {
    // Mock authentication - in real implementation this would validate against database
    if (
      loginDto.email === 'demo@nx-micros.com' &&
      loginDto.password === 'demo123'
    ) {
      return {
        accessToken: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        user: {
          id: '1',
          email: loginDto.email,
          firstName: 'Demo',
          lastName: 'User',
          role: 'student',
        },
        expiresIn: 3600,
      };
    }

    return {
      error: 'Invalid credentials',
      message: 'Please check your email and password',
    };
  }

  @Post('auth/register')
  async register(@Body() registerDto: RegisterDto) {
    // Mock registration - in real implementation this would create user in database
    return {
      message: 'User registered successfully',
      user: {
        id: 'new-user-' + Date.now(),
        email: registerDto.email,
        firstName: registerDto.firstName || 'New',
        lastName: registerDto.lastName || 'User',
        role: 'student',
      },
    };
  }

  @Get('auth/me')
  getProfile() {
    // Mock user profile - in real implementation this would be protected with JWT
    return {
      id: '1',
      email: 'demo@nx-micros.com',
      firstName: 'Demo',
      lastName: 'User',
      role: 'student',
      enrolledCourses: 3,
      completedCourses: 1,
    };
  }
}
