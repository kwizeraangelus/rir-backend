// src/researcher/researcher.service.ts
import { BadRequestException,Injectable, NotFoundException } from '@nestjs/common';
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

  // Better check - allow empty string updates too
  if (body.bio !== undefined) updateData.bio = body.bio;
  if (body.platformId !== undefined) updateData.orcid = body.platformId;
  if (body.qualification !== undefined) updateData.qualification = body.qualification;
  if (body.specialization !== undefined) updateData.specialization = body.specialization;

  if (file) {
    updateData.profile_image = `/uploads/profiles/${file.filename}`;
    console.log('✅ Image saved:', updateData.profile_image); // Debug
  }

  if (!userId) {
    throw new BadRequestException('User ID is missing');
  }

  console.log('Update Data:', updateData); // ← Add this for debugging

  if (Object.keys(updateData).length === 0) {
    return this.getProfile(userId);
  }

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
  async getAllResearchers(search?: string) {
    try {
      const query = this.userRepo
        .createQueryBuilder('user')
        .where(
          'user.user_category = :category AND user.is_active = true AND user.isExpert = false',
          {
            category: 'researcher',
          },
        )
        .select([
          'user.id',
          'user.first_name',
          'user.last_name',
          'user.email',
          'user.phone_number',
          'user.qualification',
          'user.specialization',
          'user.bio',
          'user.profile_image',
          'user.orcid',
        ]);

      if (search) {
        query.andWhere(
          '(user.first_name LIKE :search OR user.last_name LIKE :search OR user.specialization LIKE :search)',
          { search: `%${search}%` },
        );
      }

      const users = await query.getMany();

      return users.map((user) => ({
        id: user.id,
        name: `${user.first_name} ${user.last_name}`.trim(),
        qualification: user.qualification || 'Not Specified',
        email: user.email,
        contact: user.phone_number || 'N/A',
        specialization: user.specialization || user.bio?.slice(0, 150) || 'Not Specified',
        image: user.profile_image
  ? `http://localhost:8000${user.profile_image.startsWith('/') ? '' : '/'}${user.profile_image}`
  : 'https://via.placeholder.com/120x150/003087/ffffff?text=Researcher',
      }));
    } catch (error) {
      console.error('Error in getAllResearchers:', error);
      throw error;
    }
  }

  async getResearcherDetail(id: string) {
    try {
      const user = await this.userRepo.findOne({
        where: { id, user_category: 'researcher', is_active: true },
        select: [
          'id',
          'first_name',
          'last_name',
          'email',
          'phone_number',
          'qualification',
          'specialization',
          'bio',
          'profile_image',
          'orcid',
          'university_name',
        ],
      });

      if (!user) {
        throw new NotFoundException('Researcher not found');
      }

      const publications = await this.pubRepo.find({
        where: { user: { id }, status: true },
        order: { created_at: 'DESC' },
        take: 10,
      });

      return {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`.trim(),
        qualification: user.qualification || 'Not Specified',
        email: user.email,
        contact: user.phone_number || 'N/A',
        specialization: user.specialization || 'Not Specified',
        bio: user.bio || '',
        image: user.profile_image
          ? `/uploads/profiles/${user.profile_image.split('/').pop()}`
          : 'https://via.placeholder.com/300x400/003087/ffffff?text=Researcher',
        orcid: user.orcid,
        university: user.university_name,
        publications: publications || [],
      };
    } catch (error) {
      console.error('Error in getResearcherDetail:', error);
      throw error;
    }
  }
  async getAllExperts(search?: string) {
    const query = this.userRepo
      .createQueryBuilder('user')
      .where(
        'user.user_category = :category AND user.is_active = true AND user.isExpert = true',
        {
          category: 'researcher',
        },
      )
      .select([
        'user.id',
        'user.first_name',
        'user.last_name',
        'user.email',
        'user.phone_number',
        'user.qualification', 'user.specialization',
        'user.bio',
        'user.profile_image',
        'user.orcid'
      ]);

  if (search) {
    query.andWhere(
      '(user.first_name LIKE :search OR user.last_name LIKE :search OR user.specialization LIKE :search)',
      { search: `%${search}%` }
    );
  }

  const users = await query.getMany();

  return users.map(user => ({
    id: user.id,
    name: `${user.first_name} ${user.last_name}`.trim(),
    qualification: user.qualification || 'Not Specified',
    email: user.email,
    contact: user.phone_number || 'N/A',
    specialization: user.specialization || user.bio?.slice(0, 150) || 'Not Specified',
    image: user.profile_image 
      ? `http://localhost:8000${user.profile_image.startsWith('/') ? '' : '/'}${user.profile_image}`
      : 'https://via.placeholder.com/120x150/003087/ffffff?text=Expert',
  }));
}
}
