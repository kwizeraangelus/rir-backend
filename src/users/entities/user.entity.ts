import { Entity, PrimaryColumn, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export const UserCategory = {
  RESEARCHER: 'researcher',
  UNIVERSITY: 'university',
  CONF_ORGANIZER: 'conf_organizer',
  PUBLIC_VISITOR: 'public_visitor',
  INNOVATOR: 'innovator',
  ADMIN: 'admin',
} as const;

export type UserCategory = (typeof UserCategory)[keyof typeof UserCategory];

@Entity('users')
export class User {
  @PrimaryColumn('uuid') // ← correct for MySQL + manual generation
  id: string = '';

  @Column({ unique: true })
  username: string = '';

  @Column({ unique: true })
  email: string = '';

  @Column()
  first_name: string = '';

  @Column()
  last_name: string = '';

  @Column()
  phone_number: string = '';

  @Column({ nullable: true })
  qualification?: string;

  @Column({ nullable: true })
  specialization?: string;

  @Column({
    type: 'enum',
    enum: Object.values(UserCategory), // Uses the string values directly for MySQL compatibility
  })
  user_category: UserCategory = UserCategory.PUBLIC_VISITOR;

  @Column({ nullable: true })
  university_name?: string;

  @Column()
  password: string = '';

  @Column({ default: true })
  is_active: boolean = true;

  @Column({ nullable: true })
  age?: number;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  details?: string; // bio / short description

  @Column({ nullable: true })
  profile_image?: string; // path like "/uploads/profiles/abc123.jpg"
  @Column({ default: false })
  is_staff: boolean = false;

  // src/users/entities/user.entity.ts
  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ nullable: true })
  orcid?: string;

  @Column({ nullable: true })
  cv?: string;

  @Column({ nullable: true })
  resume?: string;


  // src/users/entities/user.entity.ts
  @Column({ default: false })
  isExpert: boolean = false;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
