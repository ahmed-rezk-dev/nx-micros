import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body()
    body: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
    },
  ) {
    const { email, password, firstName, lastName } = body;
    const result = await this.authService.register(
      email,
      password,
      firstName,
      lastName,
    );
    return {
      user: result.user,
      token: result.token,
      sessionId: result.sessionId,
      message: 'Registration successful',
    };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    const result = await this.authService.login(email, password);
    return {
      user: result.user,
      token: result.token,
      sessionId: result.sessionId,
      message: 'Login successful',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return req.user;
  }
}
