import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import databaseConfig from '../config/database-config';
import { PaginationModule } from '../pagination/pagination.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),
    PaginationModule,
  ],
  exports: [ConfigModule, PaginationModule],
})
export class CoreModule {}
