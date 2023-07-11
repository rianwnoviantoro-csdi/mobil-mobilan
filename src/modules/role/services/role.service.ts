import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDTO } from '../dto/create-role.dto';
import { Exception } from 'src/utils/custom-exception';
import { PermissionService } from 'src/modules/permission/services/permission.service';
import {
  PaginationHelper,
  PaginationResult,
  QueryOptions,
} from 'src/utils/pagination';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly permissionService: PermissionService,
  ) {}

  async create(body: CreateRoleDTO, req: any): Promise<Role | any> {
    const existRole = await this.findOneByName(body.name);

    if (existRole) throw new Exception(`Role ${body.name} already exists`, 400);

    // eslint-disable-next-line prefer-const
    let permissions = [];

    if (typeof body.permissions != 'undefined') {
      // eslint-disable-next-line prefer-const
      for await (let permission of body.permissions) {
        const value = await this.permissionService.findOneById(
          permission.toString(),
        );
        permissions.push(value);
      }
    }

    const roleInstance = new Role({
      ...body,
      permissions: permissions,
      created_by: req.id,
      updated_by: req.id,
    });

    const success = await this.roleRepository.save(roleInstance);

    if (!success) throw new Exception('Something went wrong.', 500);

    return roleInstance;
  }

  async getList(options: QueryOptions): Promise<PaginationResult<Role>> {
    const queryOptions = {
      alias: 'role',
      relations: ['created_by', 'updated_by'],
      selects: [
        'role',
        'created_by.id',
        'created_by.name',
        'updated_by.id',
        'updated_by.name',
      ],
      filter: '',
      orderBy: '',
      page: options.page || 1,
      limit: options.limit || 10,
    };

    const paginationHelper = new PaginationHelper<Role>(this.roleRepository);

    return await paginationHelper.paginate(queryOptions);
  }

  async findOneByName(name: string): Promise<Role | undefined> {
    const exist = await this.roleRepository.findOne({
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
}
