import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationParamsDto } from '../../pagination/dto/pagination-params.dto';

const truthyValues = ['true', '1', 'on'];

export class GetUsersParamsDto extends PaginationParamsDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => truthyValues.includes(value), { toClassOnly: true })
  readonly withDeleted?: boolean;
}
