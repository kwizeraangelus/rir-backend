import { InnovationService } from './innovation.service';
import type { JwtUser } from '../auth/jwt.strategy';
import { Request } from 'express';
export interface RequestWithUser extends Request {
    user: JwtUser;
}
export declare class InnovationController {
    private readonly innovationService;
    constructor(innovationService: InnovationService);
    getMyInnovations(req: RequestWithUser): Promise<any>;
    createInnovation(req: RequestWithUser, body: any, file: Express.Multer.File): Promise<any>;
    updateInnovation(req: RequestWithUser, id: string, body: any, file?: Express.Multer.File): Promise<any>;
    deleteInnovation(req: RequestWithUser, id: string): Promise<any>;
    getPublicList(search?: string, sponsorship?: string): Promise<any>;
    getCounts(): Promise<any>;
    getOne(id: string): Promise<any>;
}
