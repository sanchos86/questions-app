import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { User } from './entities/user.entity';
import { RegisterDto } from '../auth/dto/register.dto';
import { UserStatus } from './enums/user-status.enum';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  createUser(registerDto: RegisterDto): Promise<User> {
    const user = this.userRepository.create(registerDto);
    this.userRepository.merge(user, {
      confirmationToken: this.createConfirmationToken(registerDto.email),
    });
    return this.userRepository.save(user);
  }

  createConfirmationToken(email: string): string {
    const payload = { email };
    const options: JwtSignOptions = {
      expiresIn: this.configService.get('CONFIRMATION_TOKEN_EXPIRES_IN'),
    };
    return this.jwtService.sign(payload, options);
  }

  async confirmRegistration(confirmationToken: string): Promise<void> {
    const email = await this.decodeConfirmationToken(confirmationToken);
    await this.markUserAsConfirmed(email, confirmationToken);
  }

  async decodeConfirmationToken(confirmationToken: string): Promise<string> {
    try {
      const { email } = await this.jwtService.verify(confirmationToken);
      return email;
    } catch (e) {
      if (e?.name === 'TokenExpiredError') {
        throw new BadRequestException('Confirmation token expired');
      }
      throw new BadRequestException('Invalid confirmation token');
    }
  }

  async markUserAsConfirmed(
    email: string,
    confirmationToken: string,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email, confirmationToken },
    });

    if (!user) {
      throw new BadRequestException('Invalid confirmation token');
    }

    this.userRepository.merge(user, {
      confirmationToken: null,
      status: UserStatus.CONFIRMED,
    });

    await this.userRepository.save(user);
  }

  async findOne(
    currentUserId: number,
    currentUserRole: string,
    userId: string,
  ): Promise<User> {
    if (
      currentUserId === Number(userId) ||
      currentUserRole === UserRole.ADMIN
    ) {
      const user = await this.userRepository.findOne(userId);

      if (!user) {
        throw new NotFoundException();
      }

      return user;
    } else {
      throw new ForbiddenException();
    }
  }
}
