import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateUserDTO } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(body: CreateUserDTO): Promise<User | string> {
    const existUser = await this.findOneByEmail(body.email);

    if (existUser) throw new Error(`User ${body.email} already exists`);

    const userInstance = new User({
      ...body,
      password: await bcrypt.hash(body.password, 10),
    });

    const success = await this.entityManager.save(userInstance);

    if (!success) throw new Error('Something went wrong.');

    delete success.password;

    return success;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    const exist = await this.userRepository.findOne({ where: { email } });

    if (!exist) return undefined;

    return exist;
  }
}
