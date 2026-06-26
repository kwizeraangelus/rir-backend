// src/innovator/entities/innovation.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('innovations')
export class Innovation {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  name?: string;

  @Column('text')
  description?: string;

  @Column({ nullable: true })
  photo?: string;

  @Column({ default: 'no-need' }) // 'no-need', 'sponsored', 'unsponsored'
  sponsorship_needed?: string;

  @Column({ default: false })
  status!: boolean;

  @Column({ nullable: true, type: 'text' }) // Admin feedback
  feedback?: string;

  @Column()
  userId?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
