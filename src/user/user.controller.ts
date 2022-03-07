import {
  Controller,
  Get,
  Param,
  UseGuards,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from './enums/user-role.enum';
import { Roles } from '../common/decorators/roles.decorator';
import { PaginationResultInterface } from '../pagination/interfaces';
import { GetUsersParamsDto } from './dto/get-users-params.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(UserRole.ADMIN)
  findAll(
    @Query(new ValidationPipe({ transform: true }))
    params: GetUsersParamsDto,
  ): Promise<PaginationResultInterface<User>> {
    return this.userService.findAll(params);
  }

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
