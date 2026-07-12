import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Publication } from './entities/publication.entity';
import { uploadFileToR2 } from '../storage/r2.storage';

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

  private getImageUrl(profile_image: string | null | undefined): string {
    if (!profile_image) return '';
    if (profile_image.startsWith('http')) return profile_image;
    const baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://api.riri.rw'
      : 'http://localhost:8000';
    return `${baseUrl}/${profile_image.replace(/^\/+/, '')}`;
  }

  async createPublication(userId: string, data: any, file?: Express.Multer.File) {
  if (!data.title || data.title.trim() === '') {
    throw new BadRequestException('Title is required');
  }

  const pubData: any = { ...data, user: { id: userId } };
  if (file) {
    pubData.pdf_path = await uploadFileToR2(file, 'publications');
  }
  const pub = this.pubRepo.create(pubData);
  return this.pubRepo.save(pub);
}

  async updateProfile(userId: string, body: any, file?: Express.Multer.File) {
    const updateData: any = {};

    if (body.bio !== undefined) updateData.bio = body.bio;
    if (body.orcid !== undefined) updateData.orcid = body.orcid;
    if (body.platformId !== undefined) updateData.orcid = body.platformId;
    if (body.qualification !== undefined) updateData.qualification = body.qualification;
    if (body.Graduation_university !== undefined) updateData.Graduation_university = body.Graduation_university;
    if (body.Field !== undefined) updateData.Field = body.Field;
    if (body.Position !== undefined) updateData.Position = body.Position;
    if(body.institution !== undefined) updateData.institution = body.institution;
    if (body.location!== undefined) updateData.location = body.location;
    if (body.ResearchArea !== undefined) updateData.ResearchArea = body.ResearchArea;

    if (file) {
  updateData.profile_image = await uploadFileToR2(file, 'profiles')
} else if (body.remove_profile_image === 'true') {
    updateData.profile_image = null;
  }

    if (!userId) throw new BadRequestException('User ID is missing');
    if (Object.keys(updateData).length === 0) return this.getProfile(userId);

    await this.userRepo.update(userId, updateData);
    return this.getProfile(userId);
  }

  async findAllApproved() {
    return this.pubRepo.find({
      where: { status: true },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async getAllResearchers(search?: string) {
    try {
      const query = this.userRepo
        .createQueryBuilder('user')
        .where(
          'user.user_category = :category AND user.is_active = true AND user.isExpert = false',
          { category: 'researcher' },
        )
        .select([
          'user.id', 'user.first_name', 'user.last_name', 'user.email',
          'user.phone_number', 'user.qualification', 'user.Position', 'user.location','institution',
          'user.Field', 'user.ResearchArea', 'user.bio', 'user.profile_image', 'user.orcid', 'user.graduation_university'
        ]);

      if (search) {
        query.andWhere(
          '(user.first_name LIKE :search OR user.last_name LIKE :search OR user.Position LIKE :search)',
          { search: `%${search}%` },
        );
      }

      const users = await query.getMany();

      return users.map((user) => ({
        id: user.id,
        name: `${user.first_name} ${user.last_name}`.trim(),
        qualification: user.qualification || 'Not Specified',
        Field: user.Field || 'Not Specified',
        email: user.email,
        contact: user.phone_number || 'N/A',
        ResearchArea: user.ResearchArea || 'not specified',
        Position: user.Position || user.bio?.slice(0, 150) || 'Not Specified',
        image: this.getImageUrl(user.profile_image),
        location: user.location || 'Not Specified',
        institution:user.institution|| 'Not specified',
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
          'id', 'first_name', 'last_name', 'email', 'phone_number',
          'qualification', 'Field', 'Position', 'ResearchArea', 'bio',
          'profile_image', 'orcid', 'university_name', 'graduation_university', 'location','institution',
        ],
      });

      if (!user) throw new NotFoundException('Researcher not found');

      const publications = await this.pubRepo.find({
        where: { user: { id }, status: true },
        order: { created_at: 'DESC' },
        take: 10,
      });

      return {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`.trim(),
        qualification: user.qualification || 'Not Specified',
        Field: user.Field || 'Not Specified',
        email: user.email,
        contact: user.phone_number || 'N/A',
        Position: user.Position || 'Not Specified',
        institution: user.institution || 'Not specified',
        ResearchArea: user.ResearchArea || 'not specified',
        bio: user.bio || '',
        image: this.getImageUrl(user.profile_image),
        orcid: user.orcid,
        university: user.university_name,
        graduation_university: user.graduation_university,
        location: user.location || 'Not Specified',
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
        { category: 'researcher' },
      )
      .select([
        'user.id', 'user.first_name', 'user.last_name', 'user.email',
        'user.phone_number', 'user.qualification', 'user.ResearchArea',
        'user.Position', 'user.Field', 'user.bio', 'user.profile_image', 'user.orcid',
        'user.graduation_university', 'user.location','user.institution',
      ]);

    if (search) {
      query.andWhere(
        '(user.first_name LIKE :search OR user.last_name LIKE :search OR user.Position LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const users = await query.getMany();

    return users.map((user) => ({
      id: user.id,
      name: `${user.first_name} ${user.last_name}`.trim(),
      qualification: user.qualification || 'Not Specified',
      Field: user.Field || 'Not Specified',
      ResearchArea: user.ResearchArea || 'not specified',
      email: user.email,
      contact: user.phone_number || 'N/A',
      Position: user.Position || user.bio?.slice(0, 150) || 'Not Specified',
      location: user.location || 'Not Specified',
      institution: user.institution || 'not specified',
      image: this.getImageUrl(user.profile_image),
    }));
  }

  async updatePublication(userId: string, pubId: string, data: any, file?: Express.Multer.File) {
    const pub = await this.pubRepo.findOne({
      where: { id: pubId },
      relations: ['user'],
    });

    if (!pub) throw new NotFoundException('Publication not found');
    if (pub.user?.id !== userId) {
      throw new UnauthorizedException('You are not allowed to edit this publication');
    }

    const {
      id, userId: _uid, user, created_at,
      status, assignedToExpertId, assignedToExpert,
      pdf_path, ...updatable
    } = data;

    Object.assign(pub, updatable);
    const shouldRemovePdf = data.remove_pdf === 'true' || data.remove_pdf === true;

    
  if (file) {
  // TODO: delete pub.pdf_path from R2 once deleteFileFromR2 is implemented
  pub.pdf_path = await uploadFileToR2(file, 'publications');
} else if (shouldRemovePdf) {
  // TODO: delete pub.pdf_path from R2 once deleteFileFromR2 is implemented
  pub.pdf_path = undefined;
}

    return this.pubRepo.save(pub);
  }

  async deletePublication(userId: string, pubId: string) {
    const pub = await this.pubRepo.findOne({
      where: { id: pubId },
      relations: ['user'],
    });

    if (!pub) throw new NotFoundException('Publication not found');
    if (pub.user?.id !== userId) {
      throw new UnauthorizedException('You are not allowed to delete this publication');
    }

    await this.pubRepo.remove(pub);
    return { success: true, id: pubId };
  }
}
