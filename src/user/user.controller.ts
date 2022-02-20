import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/passport/jwt/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(
    @CurrentUser()
    currentUser: User,
    @Param('id')
    userId: string,
  ): Promise<User> {
    return this.userService.findOne(currentUser.id, currentUser.role, userId);
  }

  @Get('token/:confirmationToken')
  confirmRegistration(
    @Param('confirmationToken')
    confirmationToken: string,
  ): Promise<void> {
    return this.userService.confirmRegistration(confirmationToken);
  }
}
