import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  readonly text: string;

  @IsNumber()
  @IsNotEmpty()
  readonly questionId: number;

  @IsOptional()
  @IsNumber()
  readonly parentCommentId: number;
}
