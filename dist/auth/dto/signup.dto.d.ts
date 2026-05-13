import { UserCategory } from '../../users/entities/user.entity';
export declare class SignupDto {
    username?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    user_category?: UserCategory;
    password?: string;
    confirmPassword?: string;
}
