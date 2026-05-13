import { User } from '../../users/entities/user.entity';
export declare class Innovation {
    id?: string;
    name?: string;
    description?: string;
    photo?: string;
    sponsorship_needed?: string;
    status?: boolean;
    userId?: string;
    user: User;
    created_at?: Date;
}
