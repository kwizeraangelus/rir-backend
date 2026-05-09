import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Email or Username is required' })
  email: string = '';

  @IsString()
  @IsNotEmpty()
  password: string = '';
}
