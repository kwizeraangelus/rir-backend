import { ResearcherService } from './researcher.service';
export declare class ResearcherController {
    private readonly researcherService;
    constructor(researcherService: ResearcherService);
    getMe(req: any): Promise<import("../users/entities/user.entity").User | null>;
    getMyResearches(req: any): Promise<import("./entities/publication.entity").Publication[]>;
    addPublication(req: any, body: any): Promise<import("./entities/publication.entity").Publication[]>;
    updateProfile(req: any, body: {
        bio: string;
        platformId: string;
    }, file: Express.Multer.File): Promise<import("../users/entities/user.entity").User | null>;
    getPublicPublications(): Promise<import("./entities/publication.entity").Publication[]>;
}
