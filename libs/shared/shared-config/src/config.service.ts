import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config.interface';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get config(): AppConfig {
    return {
      database: {
        host: this.configService.get<string>('DATABASE_HOST', 'localhost'),
        port: this.configService.get<number>('DATABASE_PORT', 5432),
        username: this.configService.get<string>('DATABASE_USER', 'postgres'),
        password: this.configService.get<string>(
          'DATABASE_PASSWORD',
          'password',
        ),
        database: this.configService.get<string>('DATABASE_NAME', 'nx_micros'),
        synchronize: this.configService.get<boolean>(
          'DATABASE_SYNCHRONIZE',
          false,
        ),
        logging: this.configService.get<boolean>('DATABASE_LOGGING', false),
      },
      valkey: {
        hot: {
          url: this.configService.get<string>(
            'VALKEY_HOT_URL',
            'redis://localhost:6379',
          ),
          ttl: this.configService.get<number>('VALKEY_HOT_TTL', 3600),
        },
        session: {
          url: this.configService.get<string>(
            'VALKEY_SESSION_URL',
            'redis://localhost:6380',
          ),
          ttl: this.configService.get<number>('VALKEY_SESSION_TTL', 604800),
        },
      },
      sqs: {
        endpoint: this.configService.get<string>(
          'SQS_ENDPOINT',
          'http://localhost:4566',
        ),
        region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
        accessKeyId: this.configService.get<string>(
          'AWS_ACCESS_KEY_ID',
          'test',
        ),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
          'test',
        ),
        queues: {
          userEvents: `${this.configService.get<string>('SQS_ENDPOINT', 'http://localhost:4566')}/000000000000/user-events`,
          courseEvents: `${this.configService.get<string>('SQS_ENDPOINT', 'http://localhost:4566')}/000000000000/course-events`,
          subscriptionEvents: `${this.configService.get<string>('SQS_ENDPOINT', 'http://localhost:4566')}/000000000000/subscription-events`,
          progressEvents: `${this.configService.get<string>('SQS_ENDPOINT', 'http://localhost:4566')}/000000000000/progress-events`,
          communityEvents: `${this.configService.get<string>('SQS_ENDPOINT', 'http://localhost:4566')}/000000000000/community-events`,
          emailQueue: `${this.configService.get<string>('SQS_ENDPOINT', 'http://localhost:4566')}/000000000000/email-queue`,
          analyticsQueue: `${this.configService.get<string>('SQS_ENDPOINT', 'http://localhost:4566')}/000000000000/analytics-queue`,
        },
      },
      jwt: {
        secret: this.configService.get<string>(
          'JWT_SECRET',
          'development-secret-key',
        ),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '7d'),
      },
      service: {
        name: this.configService.get<string>('SERVICE_NAME', 'Unknown Service'),
        port: this.configService.get<number>('PORT', 3000),
        environment: this.configService.get<string>('NODE_ENV', 'development'),
      },
      cors: {
        origin: this.configService
          .get<string>('CORS_ORIGIN', 'http://localhost:4200')
          .split(','),
        credentials: this.configService.get<boolean>('CORS_CREDENTIALS', true),
      },
      rateLimit: {
        ttl: this.configService.get<number>('RATE_LIMIT_TTL', 60),
        limit: this.configService.get<number>('RATE_LIMIT_MAX', 100),
      },
    };
  }
}
