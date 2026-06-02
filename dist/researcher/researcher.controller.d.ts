import { ResearcherService } from './researcher.service';
import * as express from 'express';
export declare class ResearcherController {
    private readonly researcherService;
    constructor(researcherService: ResearcherService);
    getMe(req: any): Promise<import("../users/entities/user.entity").User | null>;
    getMyResearches(req: any): Promise<import("./entities/publication.entity").Publication[]>;
    addPublication(req: any, body: any): Promise<import("./entities/publication.entity").Publication[]>;
    updateProfile(req: any, body: any, file: Express.Multer.File): Promise<import("../users/entities/user.entity").User | null>;
    getPublicPublications(): Promise<import("./entities/publication.entity").Publication[]>;
    getAllResearchers(search: string | undefined, req: express.Request): Promise<{
        id: string;
        name: string;
        qualification: string;
        Field: string;
        email: string;
        contact: string;
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
        bio: string;
        image: string;
        orcid: string | undefined;
        university: string | undefined;
        publications: import("./entities/publication.entity").Publication[];
    }>;
    getAllExperts(search?: string): Promise<{
        id: string;
        name: string;
        qualification: string;
        Field: string;
        email: string;
        contact: string;
        Position: string;
        image: string;
    }[]>;
}
