import { IsNotEmpty, MinLength, IsEmail } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @MinLength(6)
  @IsNotEmpty()
  readonly password: string;
}
