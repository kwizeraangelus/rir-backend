// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../users/entities/user.entity';
import { UniversityUpload } from '../university/entities/university-upload.entity';
import { Event } from '../event/entities/event.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { EventModule } from '../event/event.module';
import { Publication } from 'src/researcher/entities/publication.entity';
import { Innovation } from 'src/innovation/entities/innovation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UniversityUpload,
      Event,
      Publication,
      Innovation,
    ]),
    AuthModule, // <--- This brings in the Guard and Strategy
    EventModule, // <--- This brings in the EventsService
  ],

  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
