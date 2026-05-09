import { Module } from '@nestjs/common';
import { UniversityService } from './university.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniversityController } from './university.controller';
import { UniversityUpload } from './entities/university-upload.entity';
import { User } from 'src/users/entities/user.entity';
// src/university/university.module.ts
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UniversityUpload, User]),
    JwtModule.register({
      secret:
        process.env.JWT_SECRET ||
        'super-secret-key-change-this-in-production-very-long-random-string-987654321',
    }), // Same secret as AuthService
  ],
  controllers: [UniversityController],
  providers: [UniversityService, JwtAuthGuard], // Add Guard here
})
export class UniversityModule {}
