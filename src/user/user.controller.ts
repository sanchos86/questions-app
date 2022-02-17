import { Controller, Get, Param } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('token/:confirmationToken')
  confirmRegistration(
    @Param('confirmationToken') confirmationToken: string,
  ): Promise<void> {
    return this.userService.confirmRegistration(confirmationToken);
  }
}
