import { Repository } from 'typeorm';
import { UniversityUpload } from './entities/university-upload.entity';
export declare class CleanupService {
    private readonly uploadRepo;
    private readonly logger;
    constructor(uploadRepo: Repository<UniversityUpload>);
    deleteRejectedUploads(): Promise<void>;
}
