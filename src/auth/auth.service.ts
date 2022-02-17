import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginResponseInterface } from './interfaces';
import {
  USER_REGISTERED,
  UserRegisteredEvent,
} from './events/user-registered.event';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private signJwt(user: User): string {
    const payload = { id: user.id, role: user.role };
    return this.jwtService.sign(payload);
  }

  async login(loginDto: LoginDto): Promise<LoginResponseInterface> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new BadRequestException('Credentials are not valid');
    }

    if (!user.isConfirmed) {
      throw new BadRequestException(
        'Your registration is not confirmed yet. Please check your registration email for confirmation link or contact our support.',
      );
    }

    const isPasswordCorrect = await user.comparePassword(loginDto.password);

    if (!isPasswordCorrect) {
      throw new BadRequestException('Credentials are not valid');
    }

    const accessToken = this.signJwt(user);
    return { accessToken };
  }

  async register(registerDto: RegisterDto): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email is already taken');
    }

    const user = await this.userService.createUser(registerDto);

    this.eventEmitter.emit(USER_REGISTERED, new UserRegisteredEvent(user));
  }
}
