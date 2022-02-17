import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { LoginResponseInterface } from './interfaces';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CustomValidationPipe } from '../common/pipes/custom-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(ThrottlerGuard)
  @Post('login')
  login(
    @Body(new CustomValidationPipe({ stopAtFirstError: true }))
    loginDto: LoginDto,
  ): Promise<LoginResponseInterface> {
    return this.authService.login(loginDto);
  }

  @UseGuards(ThrottlerGuard)
  @Post('register')
  register(
    @Body(new CustomValidationPipe({ stopAtFirstError: true }))
    registerDto: RegisterDto,
  ): Promise<void> {
    return this.authService.register(registerDto);
  }
}
