import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtractJwt, StrategyOptions } from 'passport-jwt';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { DATABASE_CONFIG } from './config/database-config';
import { JwtStrategy } from './auth/passport/jwt/jwt.strategy';

@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get(DATABASE_CONFIG),
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    UserModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [
    {
      inject: [ConfigService],
      provide: JwtStrategy,
      useFactory: (configService: ConfigService) => {
        const options: StrategyOptions = {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: false,
          secretOrKey: configService.get('JWT_SECRET'),
        };
        return new JwtStrategy(options);
      },
    },
  ],
})
export class AppModule {}
