import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/entities/permission.entity';
import { Repository } from 'typeorm';
import { CreatePermissionDTO } from '../dto/create-permission.dto';
import { Exception } from 'src/utils/custom-exception';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(
    body: CreatePermissionDTO,
    req: any,
  ): Promise<Permission | string> {
    const existPermission = await this.findOneByName(body.name);

    if (existPermission)
      throw new Exception(`Permission ${body.name} already exists`, 400);

    const permissionInstance = new Permission({
      ...body,
      created_by: req.id,
      updated_by: req.id,
    });

    const success = await this.permissionRepository.save(permissionInstance);

    if (!success) throw new Exception('Something went wrong.', 500);

    return success;
  }

  async getList(): Promise<Permission[] | undefined> {
    const result = await this.permissionRepository.find({
      relations: ['created_by', 'updated_by'],
      select: {
        created_by: { id: true, name: true },
        updated_by: { id: true, name: true },
      },
    });

    return result;
  }

  async findOneByName(name: string): Promise<Permission | undefined> {
    const exist = await this.permissionRepository.findOne({
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

  async findOneById(id: string): Promise<Permission | undefined> {
    const exist = await this.permissionRepository.findOne({
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
