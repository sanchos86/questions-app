import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { QuestionModule } from './question/question.module';
import { CommentModule } from './comment/comment.module';
import { DATABASE_CONFIG } from './config/database-config';
import { AuthMiddleware } from './auth/middleware/auth.middleware';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get(DATABASE_CONFIG),
    }),
    TypeOrmModule.forFeature([User]),
    EventEmitterModule.forRoot(),
    AuthModule,
    UserModule,
    CategoryModule,
    QuestionModule,
    CommentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ method: RequestMethod.ALL, path: '*' });
  }
}
