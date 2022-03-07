import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationParamsDto {
  @ApiPropertyOptional()
  @Type(() => Number)
  readonly page?: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  readonly perPage?: number;
}
