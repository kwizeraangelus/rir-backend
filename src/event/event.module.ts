// src/events/events.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './event.controller';
import { EventsService } from './event.service';
import { Event } from './entities/event.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    JwtModule.register({
      secret:
        process.env.JWT_SECRET ||
        'super-secret-key-change-this-in-production-very-long-random-string-987654321',
    }),
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventModule {}
