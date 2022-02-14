import { Type } from 'class-transformer';

export class PaginationParamsDto {
  @Type(() => Number)
  page?: number;

  @Type(() => Number)
  perPage?: number;
}
