import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => ({
        apiGateway: {
          status: 'up',
          message: 'API Gateway is healthy',
        },
      }),
    ]);
  }

  @Get('detailed')
  @HealthCheck()
  async detailedCheck() {
    return this.health.check([
      async () => ({
        apiGateway: {
          status: 'up',
          message: 'API Gateway is running',
          timestamp: new Date().toISOString(),
        },
      }),
    ]);
  }
}
