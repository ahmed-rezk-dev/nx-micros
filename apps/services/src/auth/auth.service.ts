import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { SessionService } from '../cache/session.service';
import { SqsService } from '../queue/sqs.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private sessionService: SessionService,
    private sqsService: SqsService,
  ) {}

  async register(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
  ): Promise<{ user: User; token: string; sessionId: string }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = this.userRepository.create({
      email,
      passwordHash,
      firstName,
      lastName,
      role: 'student',
      isActive: true,
      emailVerified: false,
    });

    await this.userRepository.save(user);

    // Generate JWT token
    const token = this.generateToken(user);

    // Create session
    const sessionId = await this.sessionService.createSession(user.id, {
      email: user.email,
      role: user.role,
      registrationTime: new Date().toISOString(),
    });

    // Send user registration event
    await this.sqsService.sendMessage('user-events', {
      eventType: 'user.registered',
      userId: user.id,
      email: user.email,
      role: user.role,
      timestamp: new Date().toISOString(),
    });

    return { user, token, sessionId };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: User; token: string; sessionId: string }> {
    // Find user by email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash || '',
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Generate JWT token
    const token = this.generateToken(user);

    // Create session
    const sessionId = await this.sessionService.createSession(user.id, {
      email: user.email,
      role: user.role,
      loginTime: new Date().toISOString(),
    });

    // Send user login event
    await this.sqsService.sendMessage('user-events', {
      eventType: 'user.logged_in',
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId,
      timestamp: new Date().toISOString(),
    });

    return { user, token, sessionId };
  }

  async validateUser(userId: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user && user.isActive) {
      return user;
    }
    return null;
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }
}
