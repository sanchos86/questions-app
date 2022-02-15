import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import databaseConfig from '../config/database-config';
import { PaginationModule } from '../pagination/pagination.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),
    PaginationModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: Number(configService.get('THROTTLE_TTL')),
        limit: Number(configService.get('THROTTLE_LIMIT')),
      }),
    }),
  ],
  exports: [ConfigModule, PaginationModule, ThrottlerModule],
})
export class CoreModule {}
