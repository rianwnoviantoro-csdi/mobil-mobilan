import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateUserDTO } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Exception } from 'src/utils/custom-exception';
import { LoginUserDTO } from '../dto/login-user.dto';
import {
  PaginationHelper,
  PaginationResult,
  QueryOptions,
} from 'src/utils/pagination';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(body: CreateUserDTO): Promise<User> {
    const existUser = await this.findOneByEmail(body.email);

    if (existUser)
      throw new Exception(`User ${body.email} already exists`, 400);

    const userInstance = new User({
      ...body,
      password: await bcrypt.hash(body.password, 10),
    });

    const success = await this.userRepository.save(userInstance);

    if (!success) throw new Exception('Something went wrong.', 500);

    delete success.password;

    return success;
  }

  async authenticate(body: LoginUserDTO): Promise<object> {
    const exist = await this.findOneByEmail(body.email);

    if (!exist) throw new Exception(`User ${body.email} not found`, 404);

    if (!exist.is_active)
      throw new Exception(`User ${body.email} has been deactivated`, 401);

    const validPassword = await bcrypt.compare(body.password, exist.password);

    if (!validPassword) throw new Exception(`Invalid credentials`, 400);

    const token = this.jwtService.sign({ id: exist.id });

    delete exist.password;
    delete exist.role;

    return { user: exist, token: token };
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    const exist = await this.userRepository.findOne({
      where: { email },
      relations: ['role', 'role.permissions'],
    });

    if (!exist) return undefined;

    return exist;
  }

  async findById(id: string): Promise<User | undefined> {
    const exist = await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'role.permissions'],
    });

    if (!exist) return undefined;

    return exist;
  }

  async getList(options: QueryOptions): Promise<PaginationResult<User>> {
    const queryOptions = {
      alias: 'user',
      relations: ['created_by', 'updated_by'],
      selects: [
        'user.id',
        'user.name',
        'user.email',
        'user.is_active',
        'user.created_at',
        'user.updated_at',
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

    const paginationHelper = new PaginationHelper<User>(this.userRepository);

    return await paginationHelper.paginate(queryOptions);
  }

  async validateUser(userId: string) {
    return await this.findById(userId);
  }
}
