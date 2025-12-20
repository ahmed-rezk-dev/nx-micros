import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  roles: string[];
  sessionId: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(payload: Partial<JwtPayload>): string {
    return this.jwtService.sign(payload, { expiresIn: '30d' });
  }

  verifyToken(token: string): JwtPayload {
    return this.jwtService.verify(token);
  }

  decodeToken(token: string): JwtPayload {
    return this.jwtService.decode(token) as JwtPayload;
  }

  extractTokenFromHeader(authHeader: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}

export class AuthGuard {
  // This would be implemented in individual services
  // using NestJS guards pattern
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  roles: string[];
  sessionId: string;
}

// Permission constants
export const PERMISSIONS = {
  // User permissions
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',

  // Course permissions
  COURSE_READ: 'course:read',
  COURSE_CREATE: 'course:create',
  COURSE_UPDATE: 'course:update',
  COURSE_DELETE: 'course:delete',
  COURSE_PUBLISH: 'course:publish',

  // Subscription permissions
  SUBSCRIPTION_READ: 'subscription:read',
  SUBSCRIPTION_CREATE: 'subscription:create',
  SUBSCRIPTION_UPDATE: 'subscription:update',
  SUBSCRIPTION_CANCEL: 'subscription:cancel',

  // Community permissions
  COMMUNITY_READ: 'community:read',
  COMMUNITY_CREATE: 'community:create',
  COMMUNITY_MODERATE: 'community:moderate',

  // Admin permissions
  ADMIN_USER_MANAGEMENT: 'admin:user_management',
  ADMIN_COURSE_MANAGEMENT: 'admin:course_management',
  ADMIN_ANALYTICS: 'admin:analytics',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
