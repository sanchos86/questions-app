export interface PaginationResultInterface<T> {
  entities: T[];

  total: number;

  totalPages: number;
}
