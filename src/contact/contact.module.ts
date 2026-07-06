import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { Contact } from './contact.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Contact]), MailModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
