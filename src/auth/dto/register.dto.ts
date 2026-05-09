import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { UserCategory } from '../../users/entities/user.entity'; // Import enum from entity

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string = '';

  @IsEmail()
  @IsNotEmpty()
  email: string = '';

  @IsString()
  @IsNotEmpty()
  first_name: string = '';

  @IsString()
  @IsNotEmpty()
  last_name: string = '';

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format' })
  phone_number: string = '';

  @IsEnum(UserCategory)
  @IsNotEmpty()
  user_category: UserCategory = UserCategory.UNIVERSITY;

  @ValidateIf((o) => o.user_category === UserCategory.UNIVERSITY)
  @IsString()
  @IsNotEmpty({ message: 'University name required for university category' })
  university_name?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string = '';

  @IsString()
  @IsNotEmpty()
  password_confirmation: string = '';
}
