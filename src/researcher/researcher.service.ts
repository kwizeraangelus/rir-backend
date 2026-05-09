// src/researcher/researcher.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Publication } from './entities/publication.entity';

@Injectable()
export class ResearcherService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Publication) private pubRepo: Repository<Publication>,
  ) {}

  async getProfile(userId: string) {
    return this.userRepo.findOne({ where: { id: userId } });
  }

  async getPublications(userId: string) {
    return this.pubRepo.find({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
    });
  }

  async createPublication(userId: string, data: any) {
    const pub = this.pubRepo.create({ ...data, user: { id: userId } });
    return this.pubRepo.save(pub);
  }

  async updateProfile(userId: string, body: any, file?: Express.Multer.File) {
    const updateData: any = {};

    if (body.bio) updateData.bio = body.bio;
    if (body.platformId) updateData.orcid = body.platformId; // Mapping platform ID to ORCID or similar

    if (file) {
      updateData.profile_image = `/uploads/profiles/${file.filename}`;
    }

    // Ensure userId is valid to avoid "Empty criteria" error
    if (!userId) throw new BadRequestException('User ID is missing');

    await this.userRepo.update(userId, updateData);
    return this.getProfile(userId);
  }

  // src/researcher/researcher.service.ts

  async findAllApproved() {
    const publications = await this.pubRepo.find({
      where: { status: true }, // 👈 Filter only approved
      relations: ['user'], // Include user if you want to show the submitter
      order: { created_at: 'DESC' },
    });

    return publications;
  }
}
