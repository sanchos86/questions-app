import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';

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
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN'),
        },
        secret: configService.get('JWT_SECRET'),
      }),
    }),
  ],
  exports: [ConfigModule, PaginationModule, ThrottlerModule, JwtModule],
})
export class CoreModule {}
