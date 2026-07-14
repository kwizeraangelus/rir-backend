import { Repository } from 'typeorm';
import { CreateExpertDto } from './dto/create-expert.dto';
import { UpdateExpertDto } from './dto/update-expert.dto';
import { Expert } from './entities/expert.entity';
export declare class ExpertService {
    private readonly expertRepository;
    constructor(expertRepository: Repository<Expert>);
    create(createExpertDto: CreateExpertDto): Promise<Expert>;
    findAll(): Promise<Expert[]>;
    findOne(id: string): Promise<Expert>;
    findById(id: string): Promise<Expert>;
    update(id: string, updateExpertDto: UpdateExpertDto): Promise<Expert>;
    remove(id: string): Promise<{
        message: string;
    }>;
    verify(id: string): Promise<Expert>;
    unverify(id: string): Promise<Expert>;
    uploadProfileImage(id: string, filePath: string): Promise<Expert>;
}
