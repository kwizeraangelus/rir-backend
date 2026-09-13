import { User } from '../../users/entities/user.entity';
export declare class Innovation {
    id?: string;
    name?: string;
    description?: string;
    photo?: string;
    sponsorship_needed?: string;
    status: boolean;
    feedback?: string;
    userId?: string;
    user: User;
    created_at?: Date;
    updated_at?: Date;
}
