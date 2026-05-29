import { IsOptional, IsString, IsInt, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProfileDto {
  @IsOptional() @IsString() first_name?: string;
  @IsOptional() @IsString() last_name?: string;
  @IsOptional() @IsString() phone_number?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) age?: number;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsString() details?: string;
  @IsOptional() @IsString() bio?: string;
  @IsOptional() @IsString() orcid?: string;
  @IsOptional() @IsString() university_name?: string;
}

export class ChangePasswordDto {
  @IsString() current_password: string = '';
  @IsString() @MinLength(6) new_password: string = '';
}
