import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UniversityUpload } from '../university/entities/university-upload.entity';
import { Event } from '../event/entities/event.entity';
import { Publication } from '../researcher/entities/publication.entity';
import { Innovation } from "../innovation/entities/innovation.entity";
import { Contact } from '../contact/contact.entity';
import { MailService } from "../mail/mail.service";
export declare class AdminService {
    private userRepo;
    private uploadRepo;
    private eventRepo;
    private pubRepo;
    private innovationRepo;
    private contactRepo;
    private mailService;
    constructor(userRepo: Repository<User>, uploadRepo: Repository<UniversityUpload>, eventRepo: Repository<Event>, pubRepo: Repository<Publication>, innovationRepo: Repository<Innovation>, contactRepo: Repository<Contact>, mailService: MailService);
    getDashboardData(): Promise<{
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
            user?: User;
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
    processUpload(id: string, action: string, feedback?: string): Promise<{
        message: string;
        status: "pending" | "approved" | "rejected" | undefined;
    }>;
    getUsers(): Promise<User[]>;
    updateUser(id: string, data: any): Promise<{
        message: string;
    }>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    getApprovedBooks(filters: any): Promise<{
        books: UniversityUpload[];
    }>;
    createUser(data: any): Promise<{
        message: string;
    }>;
    createEvent(adminId: string, data: any, photoPath: string | null): Promise<{
        message: string;
    }>;
    getAllEvents(): Promise<Event[]>;
    deleteEvent(id: string): Promise<{
        message: string;
    }>;
    updateEvent(id: string, data: any, photoPath?: string): Promise<{
        message: string;
    }>;
    deleteBook(id: string): Promise<{
        message: string;
    }>;
    findPending(): Promise<Event[]>;
    updateStatus(id: string, status: boolean): Promise<{
        message: string;
    }>;
    rejectEvent(id: string, feedback: string): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
    getPendingPublications(): Promise<Publication[]>;
    approvePublication(id: string): Promise<import("typeorm").UpdateResult>;
    rejectPublication(id: string, feedback: string): Promise<import("typeorm").UpdateResult>;
    deletePublication(id: string): Promise<import("typeorm").DeleteResult>;
    getPendingInnovations(): Promise<Innovation[]>;
    approveInnovation(id: string): Promise<import("typeorm").UpdateResult>;
    rejectInnovation(id: string, feedback: string): Promise<import("typeorm").UpdateResult>;
    deleteInnovation(id: string): Promise<import("typeorm").DeleteResult>;
    createResearch(adminId: string, data: any): Promise<{
        message: string;
        publication: Publication;
    }>;
    getMessages(): Promise<Contact[]>;
    markMessageRead(id: string): Promise<import("typeorm").UpdateResult>;
    deleteMessage(id: string): Promise<import("typeorm").DeleteResult>;
    replyToMessage(id: string, reply: string): Promise<{
        success: boolean;
    }>;
}
