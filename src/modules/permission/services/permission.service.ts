import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/entities/permission.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreatePermissionDTO } from '../dto/create-permission.dto';
import { Exception } from 'src/utils/custom-exception';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(body: CreatePermissionDTO): Promise<Permission> {
    const existPermission = await this.findOneByName(body.name);

    if (existPermission)
      throw new Exception(`Permission ${body.name} already exists`, 400);

    const permissionInstance = new Permission({ ...body });

    const success = await this.entityManager.save(permissionInstance);

    if (!success) throw new Exception('Something went wrong.', 500);

    return success;
  }

  async getList(): Promise<Permission[] | undefined> {
    const result = await this.permissionRepository.find();

    return result;
  }

  async findOneByName(name: string): Promise<Permission | undefined> {
    const exist = await this.permissionRepository.findOne({ where: { name } });

    if (!exist) return undefined;

    return exist;
  }
}
