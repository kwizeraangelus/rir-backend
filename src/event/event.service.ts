// src/events/events.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(@InjectRepository(Event) private eventRepo: Repository<Event>) {}

  async create(userId: string, data: any, photoPath?: string) {
    const event = this.eventRepo.create({
      ...data,
      photo: photoPath,
      user: { id: userId } as any, // Link to user via ID
    });
    return this.eventRepo.save(event);
  }

  async getMyEvents(userId: string) {
    return this.eventRepo.find({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
    });
  }

  async findAll() {
    const events = await this.eventRepo.find({
      where: { status: true }, // 👈 Only get approved events
      order: { date: 'ASC' },
    });

    // Map the database 'photo' path to 'photo_url'
    return events.map((event) => ({
      ...event,
      photo_url: event.photo ? `http://localhost:8000${event.photo}` : null,
    }));
  }
}
