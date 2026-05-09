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

  @Column('simple-array') // Stores ['Author 1', 'Author 2'] as a string in DB
  authors?: string[];

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
  publication_type?: string;

  // src/researcher/entities/publication.entity.ts

  @Column({ default: false })
  status: boolean = false;

  @CreateDateColumn()
  created_at?: Date;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' }) // This links the relation to the column below
  user?: User;

  @Column() // Remove 'nullable: true' if every publication MUST have a user
  userId!: string;
}
