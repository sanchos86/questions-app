import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @MinLength(3)
  @IsNotEmpty()
  readonly name: string;
}
