// src/auth/dto/signup.dto.ts
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
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

  @IsString()
  @IsNotEmpty()
  phone_number?: string;

  @IsEnum(UserCategory)
  @IsNotEmpty()
  user_category?: UserCategory; // Changed from userCategory

  @IsString()
  @MinLength(8)
  password?: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword?: string; // Keep this to match frontend logic
}
