import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly plainText: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly formattedText: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly content: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly categoryId: number;
}
