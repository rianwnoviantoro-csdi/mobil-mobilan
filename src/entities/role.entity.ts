import { AbstractEntity } from 'src/entities/database.entity';
import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user.entity';
import { Permission } from './permission.entity';

export interface IRole {
  id?: string;
  type?: string;
  name?: string;
  is_active?: boolean;
  created_at?: Date;
  created_by?: User;
  updated_at?: Date;
  updated_by?: User;

  permissions?: Permission[];
}

@Entity('roles')
export class Role extends AbstractEntity<Role> {
  @Column({ name: 'code', nullable: false, unique: true })
  code: string;

  @Column({ name: 'name', nullable: false, unique: true })
  name: string;

  @Column({ name: 'is_active', nullable: false, default: true })
  is_active: boolean;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  //Many-to-many relation with permission
  @ManyToMany(() => Permission, { cascade: true })
  @JoinTable({
    name: 'role_permission',
    joinColumn: { name: 'role_code', referencedColumnName: 'code' },
    inverseJoinColumn: {
      name: 'permission_code',
      referencedColumnName: 'code',
    },
  })
  permissions: Permission[];
}
