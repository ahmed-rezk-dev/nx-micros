import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { SessionService } from './session.service';

@Module({
  providers: [
    {
      provide: 'VALKEY_HOT_URL',
      useValue: process.env.VALKEY_HOT_URL || 'redis://localhost:6379',
    },
    {
      provide: 'VALKEY_SESSION_URL',
      useValue: process.env.VALKEY_SESSION_URL || 'redis://localhost:6380',
    },
    CacheService,
    SessionService,
  ],
  exports: [CacheService, SessionService],
})
export class CacheModule {}
