import {
  BeforeInsert,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export class AbstractEntity<T> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.id, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @ManyToOne(() => User, (user) => user.id, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn({ name: 'updated_by' })
  updated_by: User;

  @BeforeInsert()
  updateDates() {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
