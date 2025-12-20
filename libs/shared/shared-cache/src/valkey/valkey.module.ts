import { Module, Global } from '@nestjs/common';
import { ValkeyHotService, ValkeySessionService } from './index';

export interface ValkeyConfig {
  hot: {
    url: string;
    ttl: number;
  };
  session: {
    url: string;
    ttl: number;
  };
}

@Global()
@Module({})
export class ValkeyModule {
  static forRoot(config: ValkeyConfig): any {
    return {
      module: ValkeyModule,
      providers: [
        {
          provide: ValkeyHotService,
          useFactory: () => new ValkeyHotService(config.hot),
        },
        {
          provide: ValkeySessionService,
          useFactory: () => new ValkeySessionService(config.session),
        },
        {
          provide: 'VALKEY_CONFIG',
          useValue: config,
        },
      ],
      exports: [ValkeyHotService, ValkeySessionService],
      global: true,
    };
  }
}
