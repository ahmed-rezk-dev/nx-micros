import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { message: string; service: string; uptime: number } {
    return {
      message: 'Welcome to Nx Micros E-Learning Platform API Gateway',
      service: 'API Gateway v1.0.0',
      uptime: process.uptime(),
    };
  }
}
