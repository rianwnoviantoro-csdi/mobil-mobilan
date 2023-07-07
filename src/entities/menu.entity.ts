import { AbstractEntity } from 'src/entities/database.entity';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';

export interface IMenu {
  id?: string;
  name?: string;
  path?: string;
  parent?: Menu;
  sub_menu?: Menu[];
  is_active?: boolean;
  created_at?: Date;
  created_by?: User;
  updated_at?: Date;
  updated_by?: User;
}

@Entity('menus')
export class Menu extends AbstractEntity<Menu> {
  @Column({ name: 'name', nullable: false, unique: true })
  name: string;

  @Column({ name: 'path', nullable: false, unique: true })
  path: string;

  @ManyToOne(() => Menu, (menu) => menu.sub_menu, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Menu;

  @OneToMany(() => Menu, (sub_menu) => sub_menu.parent)
  sub_menu: Menu[];

  @Column({ name: 'is_active', nullable: false, default: true })
  is_active: boolean;
}
