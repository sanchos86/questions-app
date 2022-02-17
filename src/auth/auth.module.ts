import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';
import { UserRegisteredListener } from './listeners/user-registered.listener';
import { EmailConfirmationService } from './email-confirmation.service';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UserModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService, UserRegisteredListener, EmailConfirmationService],
})
export class AuthModule {}
