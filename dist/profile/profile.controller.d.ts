import { ProfileService } from './profile.service';
import { UpdateProfileDto, ChangePasswordDto } from './profile.dto';
interface JwtUser {
    userId: string;
    email: string;
    category: string;
    is_staff: boolean;
}
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
    getProfile(id: string, req: {
        user: JwtUser;
    }): Promise<{
        id: string;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
        phone_number: string;
        qualification?: string;
        specialization?: string;
        user_category: import("../users/entities/user.entity").UserCategory;
        university_name?: string;
        is_active: boolean;
        age?: number;
        location?: string;
        details?: string;
        profile_image?: string;
        is_staff: boolean;
        bio?: string;
        orcid?: string;
        cv?: string;
        resume?: string;
    }>;
    updateProfile(id: string, dto: UpdateProfileDto, req: {
        user: JwtUser;
    }): Promise<{
        id: string;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
        phone_number: string;
        qualification?: string;
        specialization?: string;
        user_category: import("../users/entities/user.entity").UserCategory;
        university_name?: string;
        is_active: boolean;
        age?: number;
        location?: string;
        details?: string;
        profile_image?: string;
        is_staff: boolean;
        bio?: string;
        orcid?: string;
        cv?: string;
        resume?: string;
    }>;
    updatePhoto(id: string, file: Express.Multer.File, req: {
        user: JwtUser;
    }): Promise<{
        id: string;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
        phone_number: string;
        qualification?: string;
        specialization?: string;
        user_category: import("../users/entities/user.entity").UserCategory;
        university_name?: string;
        is_active: boolean;
        age?: number;
        location?: string;
        details?: string;
        profile_image?: string;
        is_staff: boolean;
        bio?: string;
        orcid?: string;
        cv?: string;
        resume?: string;
    }>;
    updateCv(id: string, file: Express.Multer.File, req: {
        user: JwtUser;
    }): Promise<{
        id: string;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
        phone_number: string;
        qualification?: string;
        specialization?: string;
        user_category: import("../users/entities/user.entity").UserCategory;
        university_name?: string;
        is_active: boolean;
        age?: number;
        location?: string;
        details?: string;
        profile_image?: string;
        is_staff: boolean;
        bio?: string;
        orcid?: string;
        cv?: string;
        resume?: string;
    }>;
    updateResume(id: string, file: Express.Multer.File, req: {
        user: JwtUser;
    }): Promise<{
        id: string;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
        phone_number: string;
        qualification?: string;
        specialization?: string;
        user_category: import("../users/entities/user.entity").UserCategory;
        university_name?: string;
        is_active: boolean;
        age?: number;
        location?: string;
        details?: string;
        profile_image?: string;
        is_staff: boolean;
        bio?: string;
        orcid?: string;
        cv?: string;
        resume?: string;
    }>;
    changePassword(id: string, dto: ChangePasswordDto, req: {
        user: JwtUser;
    }): Promise<{
        message: string;
    }>;
}
export {};
