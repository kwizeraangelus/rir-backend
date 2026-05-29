// src/researcher/entities/publication.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('publications')
export class Publication {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  title?: string;

  @Column('simple-array', { nullable: true })
  authors: string[] = [];

  @Column({ nullable: true })
  journal_name?: string;

  @Column({ nullable: true })
  conference_info?: string;

  @Column({ nullable: true })
  doi?: string;

  @Column({ nullable: true })
  url?: string;

  @Column({ nullable: true })
  publisher?: string;

  @Column({ nullable: true })
  book_title?: string;

  @Column({ default: 'journal' })
  publication_type: string = 'journal';

  @Column({ default: false })
  status: boolean = false;

  @Column({ nullable: true })
  assignedToExpertId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignedToExpertId' })
  assignedToExpert?: User;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column()
  userId?: string;

  @CreateDateColumn()
  created_at?: Date;
}
