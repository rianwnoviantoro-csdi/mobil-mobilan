import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateRoleDTO } from '../dto/create-role.dto';
import { Exception } from 'src/utils/custom-exception';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(body: CreateRoleDTO): Promise<Role> {
    const existRole = await this.findOneByName(body.name);

    if (existRole) throw new Exception(`Role ${body.name} already exists`, 400);

    const roleInstance = new Role({ ...body });

    const success = await this.entityManager.save(roleInstance);

    if (!success) throw new Exception('Something went wrong.', 500);

    return success;
  }

  async getList(): Promise<Role[] | undefined> {
    const result = await this.roleRepository.find();

    return result;
  }

  async findOneByName(name: string): Promise<Role | undefined> {
    const exist = await this.roleRepository.findOne({ where: { name } });

    if (!exist) return undefined;

    return exist;
  }
}
