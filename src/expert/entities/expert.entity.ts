import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// 1. Define the nested interfaces exactly as you have them
export interface Portfolio {
  title: string;
  description: string;
  technologies: string[];
}

export interface WorkExperience {
  position: string;
  company: string;
  startYear: number;
  endYear?: number;
  description: string;
  technologies: string[];
}

export interface Education {
  degree: string;
  institution: string;
  startYear: number;
  endYear: number;
}

export interface Certification {
  name: string;
  issuer: string;
  dateObtained: Date;
}

export interface Skills {
  libraries?: string[];
  tools?: string[];
  languages?: string[];
  paradigms?: string[];
  platforms?: string[];
  storage?: string[];
  frameworks?: string[];
  other?: string[];
}

// 2. Turn the Class into a MySQL Database Table
@Entity('experts') // This creates a table named 'experts' in MySQL
export class Expert {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  title!: string;

  @Column()
  location!: string;

  @Column('text') // Use 'text' type for longer biography text
  bio!: string;

  @Column({ nullable: true }) // Optional field maps to a nullable column
  profileImage?: string;

  @Column('int')
  yearOfExperience!: number;

  @Column('json') // MySQL natively supports JSON for arrays
  expertise!: string[];

  @Column('json') // Saves the array of portfolio objects as a JSON column
  portfolio!: Portfolio[];

  @Column('json')
  workExperience!: WorkExperience[];

  @Column('json')
  education!: Education[];

  @Column('json')
  certifications!: Certification[];

  @Column('json')
  skills!: Skills;

  @Column('json')
  preferredEnvironment!: string[];

  @Column({ default: false })
  verified!: boolean;

  @CreateDateColumn() // Automatically populates when a record is created
  createdAt!: Date;

  @UpdateDateColumn() // Automatically updates when a record changes
  updatedAt!: Date;
}
