import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from 'src/entities/car.entity';
import { Repository } from 'typeorm';
import { CreateCarDTO } from '../dto/create-brand.dto';
import { Exception } from 'src/utils/custom-exception';
import slugify from 'slugify';
import {
  PaginationHelper,
  PaginationResult,
  QueryOptions,
  UserFilters,
} from 'src/utils/pagination';
import { BrandService } from 'src/modules/brand/services/brand.service';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    private readonly brandService: BrandService,
  ) {}

  async create(body: CreateCarDTO, req: any): Promise<Car | any> {
    const existCar = await this.findOneByName(body.name);

    if (existCar) throw new Exception(`Car ${body.name} already exists`, 400);

    const existBrand = await this.brandService.findOneById(
      body.brand.toString(),
    );

    if (!existBrand) throw new Exception(`Brand ${body.brand} not found`, 404);

    const carInstance = new Car({
      ...body,
      brand: existBrand,
      slug: slugify(body.name.toLocaleLowerCase()),
      created_by: req.id,
      updated_by: req.id,
    });

    const success = await this.carRepository.save(carInstance);

    if (!success) throw new Exception('Something went wrong.', 500);

    return success;
  }

  async getAllCar(
    options: QueryOptions,
    filters: UserFilters,
  ): Promise<PaginationResult<Car>> {
    const queryOptions = {
      alias: 'car',
      relations: ['created_by', 'updated_by'],
      selects: [
        'car',
        'created_by.id',
        'created_by.name',
        'updated_by.id',
        'updated_by.name',
      ],
      filter: ``,
      orderBy: 'car.created_at',
      page: options.page || 1,
      limit: options.limit || 10,
    };

    const paginationHelper = new PaginationHelper<Car>(this.carRepository);
    return await paginationHelper.paginate(queryOptions, filters);
  }

  async findOneByName(name: string): Promise<Car | undefined> {
    const exist = await this.carRepository.findOne({
      where: { name },
      relations: ['created_by', 'updated_by'],
      select: {
        created_by: { id: true, name: true },
        updated_by: { id: true, name: true },
      },
    });

    if (!exist) return undefined;

    return exist;
  }

  async findOneById(id: string): Promise<Car | undefined> {
    const exist = await this.carRepository.findOne({
      where: { id },
      relations: ['created_by', 'updated_by'],
      select: {
        created_by: { id: true, name: true },
        updated_by: { id: true, name: true },
      },
    });

    if (!exist) return undefined;

    return exist;
  }
}
