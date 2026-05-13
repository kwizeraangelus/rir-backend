import { Repository } from 'typeorm';
import { Innovation } from './entities/innovation.entity';
import { User } from '../users/entities/user.entity';
export declare class InnovationService {
    private innovationRepo;
    private userRepo;
    constructor(innovationRepo: Repository<Innovation>, userRepo: Repository<User>);
    create(userId: string, data: any, photoPath: string | null): Promise<Innovation[]>;
    findMyInnovations(userId: string): Promise<Innovation[]>;
    findAllPublic(searchTerm?: string, sponsorship?: string): Promise<Innovation[]>;
    getPublicCounts(): Promise<{
        total: number;
        sponsored: number;
        unsponsored: number;
        no_need: number;
    }>;
    findOne(id: string): Promise<Innovation | null>;
}
