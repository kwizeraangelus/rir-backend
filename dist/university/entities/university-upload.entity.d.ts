import { User } from '../../users/entities/user.entity';
export declare class UniversityUpload {
    id: string;
    submission_type: string;
    university: string;
    title: string;
    authors: string;
    cover_image?: string;
    year: number;
    description: string;
    supervisor_name: string;
    degree_type?: string;
    file_path: string;
    status: 'pending' | 'approved' | 'rejected';
    userId?: string;
    user?: User;
    created_at: Date;
    views_count: number;
    likes_count?: number;
    feedback?: string;
    rating_sum?: number;
    rating_count?: number;
    average_rating?: number;
    updated_at: Date;
}
