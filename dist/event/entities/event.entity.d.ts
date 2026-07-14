import { User } from '../../users/entities/user.entity';
export declare class Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    link?: string;
    icon: string;
    photo?: string;
    user: User;
    created_at: Date;
    status?: boolean;
    rejection_feedback?: string;
}
