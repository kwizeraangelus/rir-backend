// src/events/entities/event.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column('text')
  description!: string;

  @Column()
  date!: string; // Using string to match datetime-local input

  @Column()
  location!: string;

  @Column({ nullable: true })
  link?: string;

  @Column()
  icon!: string;

  @Column({ nullable: true })
  photo?: string;

  @ManyToOne(() => User)
  user!: User;

  @CreateDateColumn()
  created_at!: Date;

  @Column({ default: false })
  status?: boolean;

  @Column({ type: 'text', nullable: true })
  rejection_feedback?: string;
}
