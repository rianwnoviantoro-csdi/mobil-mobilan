import { AbstractEntity } from 'src/entities/database.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';

export interface IRole {
  id?: string;
  type?: string;
  name?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

@Entity('roles')
export class Role extends AbstractEntity<Role> {
  @Column({ name: 'type', nullable: false, unique: true })
  type: string;

  @Column({ name: 'name', nullable: false, unique: true })
  name: string;

  @Column({ name: 'is_active', nullable: false, default: true })
  is_active: boolean;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
