import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. Import TypeOrmModule
import { ExpertController } from './expert.controller';
import { ExpertService } from './expert.service';
import { Expert } from './entities/expert.entity'; // 2. Import your Database Entity

@Module({
  imports: [
    TypeOrmModule.forFeature([Expert]),
    // 3. Register the Expert entity for MySQL
  ],
  controllers: [ExpertController],
  providers: [ExpertService],
  exports: [ExpertService], // Kept this so your AdminModule can still reuse it
})
export class ExpertModule {}
