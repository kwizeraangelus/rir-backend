import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { EventsService } from './event.service';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { uploadFileToR2 } from '../storage/r2.storage';

const memory = memoryStorage();

@Controller('api')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('events/create')
  @UseInterceptors(FileInterceptor('photo', { storage: memory }))
  async createEvent(
    @Req() req: any,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const photoPath = file ? await uploadFileToR2(file, 'events') : undefined;
    return this.eventsService.create(req.user.userId, body, photoPath);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-events')
  async getMyEvents(@Req() req: any) {
    return this.eventsService.getMyEvents(req.user.userId);
  }

  @Get('events')
  async getAllPublicEvents() {
    return this.eventsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Put('events/:id')
  @UseInterceptors(FileInterceptor('photo', { storage: memory }))
  async updateEvent(
    @Req() req: any,
    @Param('id') eventId: string,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const photoPath = file ? await uploadFileToR2(file, 'events') : undefined;
    return this.eventsService.updateEvent(req.user.userId, eventId, body, photoPath);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('events/:id')
  async deleteEvent(@Req() req: any, @Param('id') eventId: string) {
    return this.eventsService.deleteEvent(req.user.userId, eventId);
  }
}