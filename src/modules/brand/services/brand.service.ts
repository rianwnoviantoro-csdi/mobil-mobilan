import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from 'src/entities/brand.entity';
import { Repository } from 'typeorm';
import { CreateBrandDTO } from '../dto/create-brand.dto';
import { Exception } from 'src/utils/custom-exception';
import slugify from 'slugify';
import {
  PaginationHelper,
  PaginationResult,
  QueryOptions,
  UserFilters,
} from 'src/utils/pagination';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async create(body: CreateBrandDTO, req: any): Promise<Brand | any> {
    const existMenu = await this.findOneByName(body.name);

    if (existMenu)
      throw new Exception(`Brand ${body.name} already exists`, 400);

    const carInstance = new Brand({
      ...body,
      slug: slugify(body.name.toLocaleLowerCase()),
      created_by: req.id,
      updated_by: req.id,
    });

    const success = await this.brandRepository.save(carInstance);

    if (!success) throw new Exception('Something went wrong.', 500);

    return success;
  }

  async getAllBrand(
    options: QueryOptions,
    filters: UserFilters,
  ): Promise<PaginationResult<Brand>> {
    const queryOptions = {
      alias: 'brand',
      relations: ['cars', 'created_by', 'updated_by'],
      selects: [
        'brand',
        'cars.id',
        'cars.slug',
        'created_by.id',
        'created_by.name',
        'updated_by.id',
        'updated_by.name',
      ],
      filter: ``,
      orderBy: 'brand.created_at',
      page: options.page || 1,
      limit: options.limit || 10,
    };

    const paginationHelper = new PaginationHelper<Brand>(this.brandRepository);
    return await paginationHelper.paginate(queryOptions, filters);
  }

  async findOneByName(name: string): Promise<Brand | undefined> {
    const exist = await this.brandRepository.findOne({
      where: { name },
      relations: ['cars', 'created_by', 'updated_by'],
      select: {
        created_by: { id: true, name: true },
        updated_by: { id: true, name: true },
      },
    });

    if (!exist) return undefined;

    return exist;
  }

  async findOneById(id: string): Promise<Brand | undefined> {
    const exist = await this.brandRepository.findOne({
      where: { id },
      relations: ['cars', 'created_by', 'updated_by'],
      select: {
        created_by: { id: true, name: true },
        updated_by: { id: true, name: true },
      },
    });

    if (!exist) return undefined;

    return exist;
  }
}
