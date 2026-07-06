// src/contact/contact.controller.ts
import { Body, Controller, Get, Post, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // for admin-only routes

@Controller('api/contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post()
  create(@Body() dto: CreateContactDto) {
    return this.contactService.create(dto);
  }

  // ── Admin-only: list messages ──
  // @UseGuards(JwtAuthGuard) // add auth so random people can't read messages
  @Get()
  findAll() {
    return this.contactService.findAll();
  }

  // @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.contactService.markAsRead(id);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }
}