import { Repository } from 'typeorm';

export interface UserFilters {
  [key: string]: string | number | boolean;
}

export interface QueryOptions {
  alias?: string;
  relations?: string[];
  selects?: string[];
  filter?: any;
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

  async paginate(
    queryOptions: QueryOptions,
    filters: UserFilters,
  ): Promise<PaginationResult<T>> {
    const { page, limit } = queryOptions;

    const queryBuilder = this.repository.createQueryBuilder(queryOptions.alias);

    for (const relation of queryOptions.relations) {
      queryBuilder.leftJoinAndSelect(
        `${queryOptions.alias}.${relation}`,
        relation,
      );
    }

    queryBuilder.select(queryOptions.selects);

    const { filteredFilters } = this.excludeKeys(filters, ['page', 'limit']);

    Object.keys(filteredFilters).forEach(async (filterKey) => {
      let filterValue = filters[filterKey];

      if (filterKey === 'is_active') {
        filterValue = this.stringToBoolean(filterValue.toString());
      }

      if (typeof filterValue === 'boolean') {
        queryBuilder.andWhere(
          `${queryOptions.alias}.${filterKey} = ${filterValue}`,
        );
      } else if (typeof filterValue === 'string') {
        queryBuilder.andWhere(
          `${queryOptions.alias}.${filterKey} ~* :filterValue`,
          {
            filterValue: `.*${filterValue}.*`,
          },
        );
      } else {
        queryBuilder.andWhere(
          `${queryOptions.alias}.${filterKey} = :filterValue`,
          {
            filterValue,
          },
        );
      }
    });

    if (queryOptions.orderBy) {
      queryBuilder.orderBy(queryOptions.orderBy, 'ASC');
    }

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

  private excludeKeys(
    obj: UserFilters,
    keysToExclude: string[],
  ): { skipKeys: string[]; filteredFilters: UserFilters } {
    const filteredFilters: UserFilters = {};
    const skipKeys: string[] = [];

    Object.entries(obj).forEach(([key, value]) => {
      if (keysToExclude.includes(key)) {
        skipKeys.push(key);
      } else {
        filteredFilters[key] = value;
      }
    });

    return { skipKeys, filteredFilters };
  }

  private stringToBoolean(value: string): boolean {
    return value.toLowerCase() === 'true';
  }
}
