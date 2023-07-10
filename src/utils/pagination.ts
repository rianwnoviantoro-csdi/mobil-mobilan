import { Repository } from 'typeorm';

export interface QueryOptions {
  alias?: string;
  relations?: string[];
  selects?: string[];
  filter?: string;
  orderBy?: string;
  page: number;
  limit: number;
}

export interface PaginationResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export class PaginationHelper<T> {
  constructor(private readonly repository: Repository<T>) {}

  async paginate(queryOptions: QueryOptions): Promise<PaginationResult<T>> {
    const { page, limit } = queryOptions;

    const queryBuilder = this.repository.createQueryBuilder(queryOptions.alias);

    for (const relation of queryOptions.relations) {
      queryBuilder.leftJoinAndSelect(
        `${queryOptions.alias}.${relation}`,
        relation,
      );
    }

    queryBuilder
      .select(queryOptions.selects)
      .where(queryOptions.filter)
      .orderBy(queryOptions.orderBy, 'ASC');

    const [items, totalItems] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items,
      totalItems,
      totalPages,
      currentPage: page,
    };
  }
}
