// university/entities/university-upload.entity.ts
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

@Entity('university_uploads')
export class UniversityUpload {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  submission_type: string = ''; // e.g., "thesis-computer_science"

  @Column()
  university: string = '';

  @Column()
  title: string = '';

  @Column()
  authors: string = '';

  @Column({ length: 255, nullable: true }) // Added
  cover_image?: string;

  @Column() // Changed from varchar to int for years
  year!: number;

  @Column('longtext') // Changed from text to longtext
  description!: string;

  @Column()
  supervisor_name: string = '';

  @Column({ nullable: true }) // Added
  degree_type?: string;

  @Column()
  file_path: string = '';

  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected' = 'pending';

  @Column({ nullable: true })
  userId?: string;

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user?: User;

  @CreateDateColumn()
  created_at: Date = new Date();

  @Column({ default: 0 }) // Added
  views_count!: number;

  // src/university/entities/university-upload.entity.ts
  @Column({ default: 0 })
  likes_count?: number;

  @Column('longtext', { nullable: true }) // Added
  feedback?: string;

  // src/university/entities/university-upload.entity.ts
  @Column({ type: 'float', default: 0 })
  rating_sum?: number;

  @Column({ default: 0 })
  rating_count?: number;

  @Column({ type: 'float', default: 0 })
  average_rating?: number;

  @CreateDateColumn()
  updated_at!: Date;

}
