import { Injectable, NotFoundException } from '@nestjs/common';
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
  const events = await this.eventRepo.find({
    where: { user: { id: userId } },
    order: { created_at: 'DESC' },
  });

  return events.map((event) => ({
    ...event,
    photo_url: event.photo
      ? event.photo.startsWith('http')
        ? event.photo
        : (() => {
            const baseUrl = process.env.NODE_ENV === 'production'
              ? 'https://api.riri.rw'
              : 'http://localhost:8000';
            return `${baseUrl}/${event.photo.replace(/^\/+/, '')}`;
          })()
      : null,
  }));
}
  async findAll() {
    const events = await this.eventRepo.find({
      where: { status: true },
      order: { date: 'ASC' },
    });

   return events.map((event) => ({
  ...event,
  photo_url: event.photo
    ? event.photo.startsWith('http')
      ? event.photo          // R2 full URL — use directly
      : (() => {             // legacy local path fallback
          const baseUrl = process.env.NODE_ENV === 'production'
            ? 'https://api.riri.rw'
            : 'http://localhost:8000';
          return `${baseUrl}/${event.photo.replace(/^\/+/, '')}`;
        })()
    : null,
}));
  }

  // ============= NEW: UPDATE EVENT =============
  async updateEvent(
  userId: string,
  eventId: string,
  updateData: any,
  photoPath?: string,
) {
  // Verify ownership
  const event = await this.eventRepo.findOne({
    where: { id: eventId, user: { id: userId } },
  });

  if (!event) {
    throw new NotFoundException('Event not found or unauthorized');
  }

  // Allowed fields to update
  const allowedFields = ['title', 'description', 'date', 'location', 'link', 'icon'];
  const dataToUpdate: any = {};

  allowedFields.forEach(field => {
    if (updateData[field] !== undefined && updateData[field] !== null) {
      dataToUpdate[field] = updateData[field];
    }
  });

  // remove_photo arrives as a string via multipart/form-data, not a boolean
  const shouldRemovePhoto =
    updateData.remove_photo === 'true' || updateData.remove_photo === true;

  if (photoPath) {
    // TODO: delete event.photo from R2 before replacing, once deleteFileFromR2 exists
    dataToUpdate.photo = photoPath;
  } else if (shouldRemovePhoto) {
    // TODO: delete event.photo from R2 once deleteFileFromR2 exists
    dataToUpdate.photo = null;
  }

  await this.eventRepo.update(eventId, dataToUpdate);
  return this.eventRepo.findOne({
    where: { id: eventId },
    relations: ['user'],
  });
}

  // ============= NEW: DELETE EVENT =============
  async deleteEvent(userId: string, eventId: string) {
    // Verify ownership
    const event = await this.eventRepo.findOne({
      where: { id: eventId, user: { id: userId } },
    });

    if (!event) {
      throw new NotFoundException(
        'Event not found or unauthorized',
      );
    }

    await this.eventRepo.delete(eventId);
    return { success: true, message: 'Event deleted successfully' };
  }
}