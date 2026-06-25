import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Publication } from './entities/publication.entity';
export declare class ResearcherService {
    private userRepo;
    private pubRepo;
    constructor(userRepo: Repository<User>, pubRepo: Repository<Publication>);
    getProfile(userId: string): Promise<User | null>;
    getPublications(userId: string): Promise<Publication[]>;
    private getImageUrl;
    createPublication(userId: string, data: any): Promise<Publication[]>;
    updateProfile(userId: string, body: any, file?: Express.Multer.File): Promise<User | null>;
    findAllApproved(): Promise<Publication[]>;
    getAllResearchers(search?: string): Promise<{
        id: string;
        name: string;
        qualification: string;
        Field: string;
        email: string;
        contact: string;
        ResearchArea: string;
        Position: string;
        image: string;
    }[]>;
    getResearcherDetail(id: string): Promise<{
        id: string;
        name: string;
        qualification: string;
        Field: string;
        email: string;
        contact: string;
        Position: string;
        ResearchArea: string;
        bio: string;
        image: string;
        orcid: string | undefined;
        university: string | undefined;
        publications: Publication[];
    }>;
    getAllExperts(search?: string): Promise<{
        id: string;
        name: string;
        qualification: string;
        Field: string;
        ResearchArea: string;
        email: string;
        contact: string;
        Position: string;
        image: string;
    }[]>;
}
