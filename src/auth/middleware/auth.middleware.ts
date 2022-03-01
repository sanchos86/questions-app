import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { User } from '../../user/entities/user.entity';
import { extractTokenFormCookie } from './helpers/extractTokenFromCookie';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = extractTokenFormCookie(
      req,
      this.configService.get('JWT_TOKEN_COOKIE_NAME'),
    );
    if (token) {
      try {
        const decoded = this.jwtService.verify(token);
        req.user = await this.userRepository.findOne(decoded.id);
        next();
      } catch (e) {
        req.user = null;
        next();
      }
    } else {
      req.user = null;
      next();
    }
  }
}
