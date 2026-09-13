import { Repository } from 'typeorm';
import { Contact } from './contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { MailService } from '../mail/mail.service';
export declare class ContactService {
    private contactRepo;
    private mailService;
    constructor(contactRepo: Repository<Contact>, mailService: MailService);
    create(dto: CreateContactDto): Promise<Contact>;
    findAll(): Promise<Contact[]>;
    markAsRead(id: string): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
