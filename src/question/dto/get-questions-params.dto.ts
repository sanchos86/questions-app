import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationParamsDto } from '../../pagination/dto/pagination-params.dto';

export class GetQuestionsParamsDto extends PaginationParamsDto {
  @ApiPropertyOptional()
  @Type(() => Number)
  readonly userId?: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  readonly categoryId?: number;
}
