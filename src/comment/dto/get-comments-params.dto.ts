import { Type } from 'class-transformer';

import { PaginationParamsDto } from '../../pagination/dto/pagination-params.dto';

export class GetCommentsParamsDto extends PaginationParamsDto {
  @Type(() => Number)
  readonly userId: number;

  @Type(() => Number)
  readonly questionId: number;

  @Type(() => Number)
  readonly parentCommentId: number;
}
