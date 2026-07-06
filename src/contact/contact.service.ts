// src/contact/contact.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { MailService } from '../mail/mail.service'; // reuse existing service

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact) private contactRepo: Repository<Contact>,
    private mailService: MailService,
  ) {}

  async create(dto: CreateContactDto) {
    const contact = this.contactRepo.create(dto);
    const saved = await this.contactRepo.save(contact);

    await this.mailService.sendContactNotification(dto);

    return saved;
  }

  findAll() {
    return this.contactRepo.find({ order: { created_at: 'DESC' } });
  }

  markAsRead(id: string) {
    return this.contactRepo.update(id, { is_read: true });
  }

  remove(id: string) {
    return this.contactRepo.delete(id);
  }
}
