import { Type } from 'class-transformer';

import { PaginationParamsDto } from '../../pagination/dto/pagination-params.dto';

export class GetQuestionsParamsDto extends PaginationParamsDto {
  @Type(() => Number)
  readonly userId?: number;

  @Type(() => Number)
  readonly categoryId?: number;
}
