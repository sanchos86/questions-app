import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoreModule } from './core/core.module';
import { DATABASE_CONFIG } from './config/database-config';

@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get(DATABASE_CONFIG),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
