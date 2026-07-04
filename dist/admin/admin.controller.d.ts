import { AdminService } from './admin.service';
import { ExpertService } from '../expert/expert.service';
import { Expert } from '../expert/entities/expert.entity';
import { CreateExpertDto } from "../expert/dto/create-expert.dto";
import { UpdateExpertDto } from "../expert/dto/update-expert.dto";
export interface RequestWithUser extends Request {
    user: {
        userId: string;
        email: string;
        category: string;
        is_staff: boolean;
    };
}
export interface CreateEventDto {
    title: string;
    description: string;
    date: string;
    location: string;
    status: string;
}
export interface UpdateEventDto {
    title?: string;
    description?: string;
    date?: string;
    location?: string;
    status?: string;
}
export interface CreateUserDto {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    user_category: string;
    is_staff: boolean;
    is_active: boolean;
}
export interface UpdateUserDto {
    username?: string;
    email?: string;
    password?: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    user_category?: string;
    is_staff?: boolean;
    is_active?: boolean;
}
export interface AdminFilters {
    search?: string;
    status?: string;
    category?: string;
    page?: string;
    limit?: string;
}
export declare class AdminController {
    private readonly adminService;
    private readonly expertService;
    constructor(adminService: AdminService, expertService: ExpertService);
    getDashboard(): Promise<{
        kpis: {
            total_users: number;
            total_books: number;
            total_events: number;
            pending_count: number;
        };
        pending: {
            author_name: string;
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
        }[];
    }>;
    updateUploadStatus(id: string, body: {
        action: string;
        feedback?: string;
    }): Promise<{
        message: string;
        status: "pending" | "approved" | "rejected" | undefined;
    }>;
    getAllUsers(): Promise<import("../users/entities/user.entity").User[]>;
    updateUser(id: string, body: UpdateUserDto): Promise<{
        message: string;
    }>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    getApproved(filters: AdminFilters): Promise<{
        books: import("../university/entities/university-upload.entity").UniversityUpload[];
    }>;
    createUser(body: CreateUserDto): Promise<{
        message: string;
    }>;
    createAdminEvent(req: RequestWithUser, body: CreateEventDto, file: Express.Multer.File): Promise<{
        message: string;
    }>;
    getAllEvents(): Promise<import("../event/entities/event.entity").Event[]>;
    deleteEvent(id: string): Promise<{
        message: string;
    }>;
    updateAdminEvent(id: string, body: UpdateEventDto, file: Express.Multer.File): Promise<{
        message: string;
    }>;
    deleteBook(id: string): Promise<{
        message: string;
    }>;
    getPending(): Promise<import("../event/entities/event.entity").Event[]>;
    approve(id: string): Promise<{
        message: string;
    }>;
    reject(id: string, feedback: string): Promise<{
        message: string;
    }>;
    delete(id: string): Promise<import("typeorm").DeleteResult>;
    getPendingPubs(): Promise<import("../researcher/entities/publication.entity").Publication[]>;
    approvePub(id: string): Promise<import("typeorm").UpdateResult>;
    rejectPub(id: string, feedback: string): Promise<import("typeorm").UpdateResult>;
    deletePub(id: string): Promise<import("typeorm").DeleteResult>;
    getPendingInnovations(): Promise<import("../innovation/entities/innovation.entity").Innovation[]>;
    approveInnovation(id: string): Promise<import("typeorm").UpdateResult>;
    rejectInnovation(id: string, feedback: string): Promise<import("typeorm").UpdateResult>;
    deleteInnovation(id: string): Promise<import("typeorm").DeleteResult>;
    createResearch(req: any, body: any): Promise<{
        message: string;
        publication: import("../researcher/entities/publication.entity").Publication;
    }>;
    findAll(): Promise<Expert[]>;
    findOne(id: string): Promise<Expert>;
    create(dto: CreateExpertDto, req: any): Promise<Expert>;
    update(id: string, dto: UpdateExpertDto, req: any): Promise<Expert>;
    remove(id: string, req: any): Promise<void>;
}
