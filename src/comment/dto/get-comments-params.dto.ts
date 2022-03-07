import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationParamsDto } from '../../pagination/dto/pagination-params.dto';

export class GetCommentsParamsDto extends PaginationParamsDto {
  @ApiPropertyOptional()
  @Type(() => Number)
  readonly userId?: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  readonly questionId?: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  readonly parentCommentId?: number;
}
