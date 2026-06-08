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
import { Expert } from '../expert/entities/expert.entity';
import { ExpertModule } from 'src/expert/expert.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UniversityUpload,
      Event,
      Publication,
      Innovation,
      Expert,
    ]),
    ExpertModule,
    AuthModule,
    EventModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  // ← add ExpertProfileService
})
export class AdminModule {}
