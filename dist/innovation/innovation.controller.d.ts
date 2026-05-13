import { InnovationService } from './innovation.service';
import type { JwtUser } from '../auth/jwt.strategy';
import { Request } from 'express';
export interface MulterFile {
    filename: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    path: string;
    buffer: Buffer;
}
export interface RequestWithUser extends Request {
    user: JwtUser;
}
export interface CreateInnovationDto {
    title: string;
    description: string;
    category: string;
    target_group: string;
    innovation_type: string;
    problem_statement: string;
    proposed_solution: string;
    expected_impact: string;
    timeline: string;
    budget: string;
    sponsorship_needed: string;
    status: string;
}
export declare class InnovationController {
    private readonly innovationService;
    constructor(innovationService: InnovationService);
    getMyInnovations(req: RequestWithUser): Promise<any>;
    createInnovation(req: RequestWithUser, body: CreateInnovationDto, file: MulterFile): Promise<any>;
    getPublicList(search?: string, sponsorship?: string): Promise<any>;
    getCounts(): Promise<any>;
    getOne(id: string): Promise<any>;
}
