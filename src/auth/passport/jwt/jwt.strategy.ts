import { Strategy as PassportJwtStrategy, StrategyOptions } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(PassportJwtStrategy) {
  constructor(options: StrategyOptions) {
    super(options);
  }

  async validate(payload: any) {
    return { id: payload.id, role: payload.role };
  }
}
