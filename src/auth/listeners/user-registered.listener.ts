import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import {
  USER_REGISTERED,
  UserRegisteredEvent,
} from '../events/user-registered.event';
import { EmailConfirmationService } from '../email-confirmation.service';

@Injectable()
export class UserRegisteredListener {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @OnEvent(USER_REGISTERED)
  onUserRegistered(event: UserRegisteredEvent) {
    const {
      user: { email, confirmationToken },
    } = event;

    return this.emailConfirmationService.sendConfirmationEmail(
      email,
      confirmationToken,
    );
  }
}
