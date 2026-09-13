import { ExpertService } from './expert.service';
import { CreateExpertDto } from './dto/create-expert.dto';
import { UpdateExpertDto } from './dto/update-expert.dto';
import { Expert } from './entities/expert.entity';
export declare class ExpertController {
    private readonly expertService;
    constructor(expertService: ExpertService);
    findAll(): Promise<Expert[]>;
    findOne(id: string): Promise<Expert>;
    create(createExpertDto: CreateExpertDto): Promise<Expert>;
    update(id: string, updateExpertDto: UpdateExpertDto): Promise<Expert>;
    remove(id: string): Promise<{
        message: string;
    }>;
    verify(id: string): Promise<Expert>;
    unverify(id: string): Promise<Expert>;
    uploadStandaloneImage(file: Express.Multer.File): Promise<{
        url: string;
    }>;
    uploadProfileImage(id: string, file: Express.Multer.File): Promise<Expert>;
}
