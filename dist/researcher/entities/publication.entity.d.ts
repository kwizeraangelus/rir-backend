import { User } from '../../users/entities/user.entity';
export declare class Publication {
    id?: string;
    title?: string;
    authors: string[];
    journal_name?: string;
    conference_info?: string;
    doi?: string;
    abstract: string;
    url?: string;
    publisher?: string;
    book_title?: string;
    publication_type: string;
    status: boolean;
    assignedToExpertId?: string;
    pdf_path?: string;
    orcid: string | null;
    assignedToExpert?: User;
    user?: User;
    userId?: string;
    created_at?: Date;
}
