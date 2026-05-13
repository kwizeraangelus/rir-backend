import { User } from '../../users/entities/user.entity';
export declare class Publication {
    id?: string;
    title?: string;
    authors?: string[];
    journal_name?: string;
    conference_info?: string;
    doi?: string;
    url?: string;
    publisher?: string;
    book_title?: string;
    publication_type?: string;
    status: boolean;
    created_at?: Date;
    user?: User;
    userId: string;
}
