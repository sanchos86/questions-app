import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
  @MinLength(2)
  @IsNotEmpty()
  readonly username: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @MinLength(6)
  @IsNotEmpty()
  readonly password: string;
}
