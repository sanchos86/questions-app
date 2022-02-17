import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdateCategoryDto {
  @MinLength(3)
  @IsNotEmpty()
  readonly name: string;
}
