import { User } from '../../user/entities/user.entity';

export const USER_REGISTERED = 'user.registered';

export class UserRegisteredEvent {
  constructor(public user: User) {}
}
