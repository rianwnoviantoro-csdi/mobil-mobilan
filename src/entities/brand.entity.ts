import { AbstractEntity } from 'src/entities/database.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Car } from './car.entity';

export interface IBrand {
  id?: string;
  name?: string;
  slug?: string;
  is_active?: boolean;
  created_at?: Date;
  created_by?: User;
  updated_at?: Date;
  updated_by?: User;

  cars?: Car[];
}

@Entity('brands')
export class Brand extends AbstractEntity<Brand> {
  @Column({ name: 'name', nullable: false, unique: true })
  name: string;

  @Column({ name: 'slug', nullable: false, unique: true })
  slug: string;

  @OneToMany(() => Car, (car) => car.brand)
  cars: Car[];

  @Column({ name: 'is_active', nullable: false, default: true })
  is_active: boolean;
}
