import { Transform } from 'class-transformer';

import { PaginationParamsDto } from '../../pagination/dto/pagination-params.dto';

const truthyValues = ['true', '1', 'on'];

export class GetUsersParamsDto extends PaginationParamsDto {
  @Transform(({ value }) => truthyValues.includes(value), { toClassOnly: true })
  readonly withDeleted?: boolean;
}
