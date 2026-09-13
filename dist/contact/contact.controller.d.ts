import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
export declare class ContactController {
    private contactService;
    constructor(contactService: ContactService);
    create(dto: CreateContactDto): Promise<import("./contact.entity").Contact>;
    findAll(): Promise<import("./contact.entity").Contact[]>;
    markAsRead(id: string): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
