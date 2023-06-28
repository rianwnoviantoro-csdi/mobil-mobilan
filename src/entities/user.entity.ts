import { AbstractEntity } from 'src/entities/database.entity';
import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

export interface IMenu {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
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
}
