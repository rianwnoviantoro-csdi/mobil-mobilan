import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from 'src/entities/menu.entity';
import { Repository } from 'typeorm';
import { CreateMenuDTO } from '../dto/create-menu.dto';
import { Exception } from 'src/utils/custom-exception';
import slugify from 'slugify';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  async create(body: CreateMenuDTO, req: any): Promise<Menu | any> {
    const existMenu = await this.findOneByName(body.name);

    if (existMenu) throw new Exception(`Menu ${body.name} already exists`, 400);

    if (!body.path) {
      body.path = slugify(body.name);
    }

    if (body.parent) {
      body.parent = await this.findOneById(body.parent.toString());

      body.path = body.parent.path + body.path + '/';
    }

    const menuInstance = new Menu({
      ...body,
      created_by: req.id,
      updated_by: req.id,
    });

    const success = await this.menuRepository.save(menuInstance);

    if (!success) throw new Exception('Something went wrong.', 500);

    return success;
  }

  async findOneByName(name: string): Promise<Menu | undefined> {
    const exist = await this.menuRepository.findOne({
      where: { name },
      relations: ['subMenus', 'created_by', 'updated_by'],
      select: {
        created_by: { id: true, name: true },
        updated_by: { id: true, name: true },
      },
    });

    if (!exist) return undefined;

    return exist;
  }

  async findOneById(id: string): Promise<Menu | undefined> {
    const exist = await this.menuRepository.findOne({
      where: { id },
      relations: ['subMenus', 'created_by', 'updated_by'],
      select: {
        created_by: { id: true, name: true },
        updated_by: { id: true, name: true },
      },
    });

    if (!exist) return undefined;

    return exist;
  }
}
