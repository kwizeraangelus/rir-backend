import { ResearcherService } from './researcher.service';
export declare class ResearcherController {
    private readonly researcherService;
    constructor(researcherService: ResearcherService);
    getMe(req: any): Promise<import("../users/entities/user.entity").User | null>;
    getMyResearches(req: any): Promise<import("./entities/publication.entity").Publication[]>;
    addPublication(req: any, body: any, file?: Express.Multer.File): Promise<import("./entities/publication.entity").Publication[]>;
    updateProfile(req: any, body: any, file: Express.Multer.File): Promise<import("../users/entities/user.entity").User | null>;
    getPublicPublications(): Promise<import("./entities/publication.entity").Publication[]>;
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
        location: string;
        institution: string;
    }[]>;
    getResearcherDetail(id: string): Promise<{
        id: string;
        name: string;
        qualification: string;
        Field: string;
        email: string;
        contact: string;
        Position: string;
        institution: string;
        ResearchArea: string;
        bio: string;
        image: string;
        orcid: string | undefined;
        university: string | undefined;
        graduation_university: string | undefined;
        location: string;
        publications: import("./entities/publication.entity").Publication[];
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
        location: string;
        institution: string;
        image: string;
    }[]>;
    updatePublication(req: any, id: string, body: any, file?: Express.Multer.File): Promise<import("./entities/publication.entity").Publication>;
    deletePublication(req: any, id: string): Promise<{
        success: boolean;
        id: string;
    }>;
}
