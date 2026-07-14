import { UserCategory } from '../../users/entities/user.entity';
export declare class RegisterDto {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    user_category: UserCategory;
    university_name?: string;
    password: string;
    password_confirmation: string;
}
