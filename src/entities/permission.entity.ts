import { AbstractEntity } from 'src/entities/database.entity';
import { Entity, Column } from 'typeorm';
import { Role } from './role.entity';
import { User } from './user.entity';

export interface IPermission {
  id?: string;
  type?: string;
  name?: string;
  is_active?: boolean;
  created_at?: Date;
  created_by?: User;
  updated_at?: Date;
  updated_by?: User;

  roles?: Role[];
}

@Entity('permissions')
export class Permission extends AbstractEntity<Permission> {
  @Column({ name: 'name', nullable: false, unique: true })
  name: string;

  @Column({ name: 'code', nullable: false, unique: true })
  code: string;

  @Column({ name: 'is_active', nullable: false, default: true })
  is_active: boolean;
}
