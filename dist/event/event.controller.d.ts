import { EventsService } from './event.service';
import * as express from 'express';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    createEvent(req: any, body: any, file: Express.Multer.File): Promise<import("./entities/event.entity").Event[]>;
    getMyEvents(req: any): Promise<import("./entities/event.entity").Event[]>;
    getAllPublicEvents(req: express.Request): Promise<{
        photo_url: string | null;
        id: string;
        title: string;
        description: string;
        date: string;
        location: string;
        link?: string;
        icon: string;
        photo?: string;
        user: import("../users/entities/user.entity").User;
        created_at: Date;
        status?: boolean;
        rejection_feedback?: string;
    }[]>;
}
