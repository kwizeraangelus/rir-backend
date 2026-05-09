// src/innovator/innovator.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InnovationController } from './innovation.controller';
import { InnovationService } from './innovation.service';
import { Innovation } from './entities/innovation.entity';
import { User } from '../users/entities/user.entity'; // Import User entity
import { AuthModule } from '../auth/auth.module'; // Import AuthModule for JwtAuthGuard

@Module({
  imports: [
    // Register BOTH entities so the Service can use them
    TypeOrmModule.forFeature([Innovation, User]),
    // Import AuthModule so the Controller can use JwtAuthGuard
    AuthModule,
  ],
  controllers: [InnovationController],
  providers: [InnovationService],
  exports: [InnovationService],
})
export class InnovationModule {}
