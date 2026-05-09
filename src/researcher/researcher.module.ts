import { Module } from '@nestjs/common';
import { ResearcherController } from './researcher.controller';
import { ResearcherService } from './researcher.service';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Publication } from './entities/publication.entity';

@Module({
  imports: [
    // You MUST include BOTH entities here
    TypeOrmModule.forFeature([User, Publication]),
  ],
  controllers: [ResearcherController],
  providers: [ResearcherService],
})
export class ResearcherModule {}
