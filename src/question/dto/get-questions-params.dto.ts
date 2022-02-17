import { Type } from 'class-transformer';

import { PaginationParamsDto } from '../../pagination/dto/pagination-params.dto';

export class GetQuestionsParamsDto extends PaginationParamsDto {
  @Type(() => Number)
  userId?: number;

  @Type(() => Number)
  categoryId?: number;
}
