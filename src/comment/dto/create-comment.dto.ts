import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly text: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly questionId: number;

  @ApiPropertyOptional({
    description: 'Id of the parent comment',
  })
  @IsOptional()
  @IsNumber()
  readonly parentCommentId: number;
}
