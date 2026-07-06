// src/contact/contact.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  subject!: string;

  @Column('text')
  message!: string;

  @Column({ default: false })
  is_read!: boolean;

  @CreateDateColumn()
  created_at!: Date;
}