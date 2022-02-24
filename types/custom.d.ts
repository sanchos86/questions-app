import { User } from '../user.entity';

declare module 'express' {
  export interface Request {
    user?: User;
  }
}
