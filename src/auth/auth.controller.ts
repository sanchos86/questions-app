import { Body, Controller, Post, UseGuards, Res } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { LoginResponseInterface } from './interfaces';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CustomValidationPipe } from '../common/pipes/custom-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(ThrottlerGuard)
  @Post('login')
  async login(
    @Body(new CustomValidationPipe({ stopAtFirstError: true }))
    loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Pick<LoginResponseInterface, 'id'>> {
    const { accessToken, id } = await this.authService.login(loginDto);
    response
      .cookie(this.configService.get('JWT_TOKEN_COOKIE_NAME'), accessToken, {
        httpOnly: true,
        maxAge: Number(this.configService.get('JWT_EXPIRES_IN')),
      })
      .cookie(
        this.configService.get('JWT_EXPIRES_IN_COOKIE_NAME'),
        this.configService.get('JWT_EXPIRES_IN'),
        {
          maxAge: Number(this.configService.get('JWT_EXPIRES_IN')),
        },
      )
      .cookie(this.configService.get('JWT_USER_ID_COOKIE_NAME'), id, {
        maxAge: Number(this.configService.get('JWT_EXPIRES_IN')),
      });
    return { id };
  }

  @UseGuards(ThrottlerGuard)
  @Post('register')
  register(
    @Body(new CustomValidationPipe({ stopAtFirstError: true }))
    registerDto: RegisterDto,
  ): Promise<void> {
    return this.authService.register(registerDto);
  }

  @Post('sign-out')
  signOut(@Res({ passthrough: true }) response: Response): void {
    const jwtTokenCookieName = this.configService.get('JWT_TOKEN_COOKIE_NAME');
    const jwtExpiresInCookieName = this.configService.get(
      'JWT_EXPIRES_IN_COOKIE_NAME',
    );
    const jwtUserIdCookieName = this.configService.get(
      'JWT_USER_ID_COOKIE_NAME',
    );
    response
      .clearCookie(jwtTokenCookieName)
      .clearCookie(jwtExpiresInCookieName)
      .clearCookie(jwtUserIdCookieName);
  }
}
