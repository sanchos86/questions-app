import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  text: string;

  @IsNumber()
  @IsNotEmpty()
  questionId: number;

  @IsOptional()
  @IsNumber()
  parentCommentId: number;
}
