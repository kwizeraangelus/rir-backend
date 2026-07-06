// src/auth/dto/signup.dto.ts
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  MinLength,
} from 'class-validator';
import { UserCategory } from '../../users/entities/user.entity';
// src/auth/dto/signup.dto.ts
export class SignupDto {
  @IsString()
  @IsNotEmpty()
  username?: string;

  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsString()
  @IsNotEmpty()
  first_name?: string; // Changed from firstName

  @IsString()
  @IsNotEmpty()
  last_name?: string; // Changed from lastName
  
  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsEnum(UserCategory)
  @IsNotEmpty()
  user_category?: UserCategory; // Changed from userCategory

  @ValidateIf((o) => o.user_category === UserCategory.UNIVERSITY)
  @IsString()
  @IsNotEmpty({ message: 'University name required for university category' })
  university_name?: string;

  @IsString()
  @MinLength(8)
  password?: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword?: string; // Keep this to match frontend logic
}
