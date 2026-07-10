import { UniversityService } from './university.service';
export declare class UniversityController {
    private readonly universityService;
    constructor(universityService: UniversityService);
    getMe(req: any): Promise<import("../users/entities/user.entity").User>;
    updateProfile(req: any, body: any, file?: Express.Multer.File): Promise<import("../users/entities/user.entity").User | null>;
    uploadResearch(req: any, body: any, file?: Express.Multer.File): Promise<import("./entities/university-upload.entity").UniversityUpload[]>;
    getMyUploads(req: any): Promise<import("./entities/university-upload.entity").UniversityUpload[]>;
    getBook(id: string): Promise<{
        file_url: string;
        status_display: string;
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
        status: "pending" | "approved" | "rejected";
        userId?: string;
        user?: import("../users/entities/user.entity").User;
        created_at: Date;
        views_count: number;
        likes_count?: number;
        feedback?: string;
        rating_sum?: number;
        rating_count?: number;
        average_rating?: number;
        updated_at: Date;
    }>;
    getPublicList(search?: string, degreeType?: string, fieldKeywords?: string): Promise<any[]>;
    getPublicCounts(degreeType?: string): Promise<{
        thesis: number;
        dissertation: number;
        engineering: number;
        medicine_health_sciences: number;
        arts_humanities: number;
        natural_sciences: number;
        social_sciences: number;
        business_economics: number;
        computer_science_it: number;
        education: number;
    }>;
    getPublicDetail(id: string): Promise<import("./entities/university-upload.entity").UniversityUpload>;
    getPublicLists(userId?: string): Promise<import("./entities/university-upload.entity").UniversityUpload[]>;
    likeBook(id: string): Promise<{
        success: boolean;
    }>;
    unlikeBook(id: string): Promise<{
        success: boolean;
    }>;
    rateBook(id: string, rating: number): Promise<{
        success: boolean;
        average: number;
    }>;
    updateUpload(req: any, id: string, body: any, file?: Express.Multer.File): Promise<import("./entities/university-upload.entity").UniversityUpload | null>;
}
