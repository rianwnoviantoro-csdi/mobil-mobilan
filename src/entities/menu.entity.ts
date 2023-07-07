import { AbstractEntity } from 'src/entities/database.entity';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';

export interface IMenu {
  id?: string;
  name?: string;
  path?: string;
  parent?: Menu;
  subMenus?: Menu[];
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

  @ManyToOne(() => Menu, (menu) => menu.subMenus, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Menu;

  @OneToMany(() => Menu, (subMenu) => subMenu.parent)
  subMenus: Menu[];

  @Column({ name: 'is_active', nullable: false, default: true })
  is_active: boolean;
}
