import { AbstractEntity } from 'src/entities/database.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './role.entity';

export interface IUser {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  is_active?: boolean;
  created_at?: Date;
  created_by?: User;
  updated_at?: Date;
  updated_by?: User;

  role?: Role;
}

@Entity('users')
export class User extends AbstractEntity<User> {
  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'email', nullable: false, unique: true })
  email: string;

  @Column({ name: 'password', nullable: false })
  password: string;

  @Column({ name: 'is_active', nullable: false, default: true })
  is_active: boolean;

  @ManyToOne(() => Role, (role) => role.users, { cascade: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
