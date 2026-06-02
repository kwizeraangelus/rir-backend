import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
export declare class EventsService {
    private eventRepo;
    constructor(eventRepo: Repository<Event>);
    create(userId: string, data: any, photoPath?: string): Promise<Event[]>;
    getMyEvents(userId: string): Promise<Event[]>;
    findAll(baseUrl: string): Promise<{
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
