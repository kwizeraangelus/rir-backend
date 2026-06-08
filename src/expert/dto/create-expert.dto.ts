import { IsString, IsOptional, IsNumber, IsArray, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PortfolioDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  technologies: string[];
}

class WorkExperienceDto {
  @IsString()
  position: string;

  @IsString()
  company: string;

  @IsNumber()
  startYear: number;

  @IsOptional()
  @IsNumber()
  endYear?: number;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  technologies: string[];
}

class EducationDto {
  @IsString()
  degree: string;

  @IsString()
  institution: string;

  @IsNumber()
  startYear: number;

  @IsNumber()
  endYear: number;
}

class CertificationDto {
  @IsString()
  name: string;

  @IsString()
  issuer: string;

  @IsString()
  dateObtained: string;
}

class SkillsDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  libraries?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tools?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  paradigms?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  platforms?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  storage?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  frameworks?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  other?: string[];
}

export class CreateExpertDto {
  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsString()
  location: string;

  @IsString()
  bio: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsNumber()
  yearOfExperience: number;

  @IsArray()
  @IsString({ each: true })
  expertise: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PortfolioDto)
  portfolio: PortfolioDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkExperienceDto)
  workExperience: WorkExperienceDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationDto)
  education: EducationDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CertificationDto)
  certifications: CertificationDto[];

  @ValidateNested()
  @Type(() => SkillsDto)
  skills: SkillsDto;

  @IsArray()
  @IsString({ each: true })
  preferredEnvironment: string[];

  @IsOptional()
  @IsBoolean()
  verified?: boolean;
}
