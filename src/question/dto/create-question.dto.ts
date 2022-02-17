import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly plainText: string;

  @IsNotEmpty()
  readonly formattedText: string;

  @IsNotEmpty()
  readonly content: string;

  @IsNumber()
  @IsNotEmpty()
  readonly categoryId: number;
}
