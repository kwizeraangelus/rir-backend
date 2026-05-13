import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Publication } from './entities/publication.entity';
export declare class ResearcherService {
    private userRepo;
    private pubRepo;
    constructor(userRepo: Repository<User>, pubRepo: Repository<Publication>);
    getProfile(userId: string): Promise<User | null>;
    getPublications(userId: string): Promise<Publication[]>;
    createPublication(userId: string, data: any): Promise<Publication[]>;
    updateProfile(userId: string, body: any, file?: Express.Multer.File): Promise<User | null>;
    findAllApproved(): Promise<Publication[]>;
}
