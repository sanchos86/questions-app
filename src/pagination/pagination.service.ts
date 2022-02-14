import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { PaginationResultInterface } from './interfaces';
import { PaginationParamsDto } from './dto/pagination-params.dto';

@Injectable()
export class PaginationService {
  constructor(private readonly configService: ConfigService) {}

  async paginate<T>(
    repositoryOrQueryBuilder: Repository<T> | SelectQueryBuilder<T>,
    params: PaginationParamsDto,
  ): Promise<PaginationResultInterface<T>> {
    const page = Number.isInteger(params.page) ? params.page : 1;
    const perPage = Number.isInteger(params.page)
      ? params.perPage
      : Number(this.configService.get('PER_PAGE'));
    const offset = (page - 1) * perPage;

    return repositoryOrQueryBuilder instanceof Repository
      ? this.paginateRepository(repositoryOrQueryBuilder, offset, perPage)
      : this.paginateQueryBuilder(repositoryOrQueryBuilder, offset, perPage);
  }

  async paginateRepository<T>(
    repository: Repository<T>,
    offset: number,
    perPage: number,
  ): Promise<PaginationResultInterface<T>> {
    const [entities, total] = await repository.findAndCount({
      skip: offset,
      take: perPage,
    });

    return { entities, total };
  }

  async paginateQueryBuilder<T>(
    queryBuilder: SelectQueryBuilder<T>,
    offset: number,
    perPage: number,
  ): Promise<PaginationResultInterface<T>> {
    const [entities, total] = await queryBuilder
      .take(perPage)
      .skip(offset)
      .getManyAndCount();

    return { entities, total };
  }
}
