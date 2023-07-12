import { AbstractEntity } from 'src/entities/database.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Brand } from './brand.entity';

export interface ICar {
  id?: string;
  name?: string;
  slug?: string;
  type?: ECar;
  price?: number;
  is_active?: boolean;
  created_at?: Date;
  created_by?: User;
  updated_at?: Date;
  updated_by?: User;

  brand?: Brand;
}

export enum ECar {
  MICRO = 'micro',
  SEDAN = 'sedan',
  HATCHBACK = 'hatchback',
  UNIVERSAL = 'universal',
  LIFTBACK = 'liftback',
  COUPE = 'coupe',
  CABRIOLET = 'cabriolet',
  ROADSTER = 'roadster',
  TARGA = 'targa',
  LIMOUSINE = 'limousine',
  MUSCLECAR = 'muscle car',
  SPORTCAR = 'sport car',
  SUV = 'SUV',
  CROSSOVER = 'crossover',
  PICKUP = 'pickup',
  VAN = 'van',
  MINIVAN = 'minivan',
  MINIBUS = 'minibus',
  CAMPERVAN = 'campervan',
}

@Entity('cars')
export class Car extends AbstractEntity<Car> {
  @Column({ name: 'name', nullable: false, unique: true })
  name: string;

  @Column({ name: 'slug', nullable: false, unique: true })
  slug: string;

  @ManyToOne(() => Brand, (brand) => brand.cars, {
    nullable: true,
  })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Column({
    name: 'type',
    type: 'enum',
    enum: ECar,
    nullable: false,
  })
  type: ECar;

  @Column({ name: 'price', nullable: false, default: 0 })
  price: number;

  @Column({ name: 'is_active', nullable: false, default: true })
  is_active: boolean;
}
