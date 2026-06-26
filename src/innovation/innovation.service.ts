// src/innovator/innovator.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Innovation } from './entities/innovation.entity'; // Check this path
import { User } from '../users/entities/user.entity'; // Check this path

@Injectable()
export class InnovationService {
  constructor(
    @InjectRepository(Innovation)
    private innovationRepo: Repository<Innovation>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(userId: string, data: any, photoPath: string | null) {
    const innovation = this.innovationRepo.create({
      ...data,
      userId,
      photo: photoPath,
    });
    return this.innovationRepo.save(innovation);
  }

  async findMyInnovations(userId: string) {
    return this.innovationRepo.find({
      where: { userId },
      order: { created_at: 'DESC' },
    });
  }

  // src/innovation/innovation.service.ts

  async findAllPublic(searchTerm?: string, sponsorship?: string) {
    const query = this.innovationRepo
      .createQueryBuilder('innovation')
      .leftJoinAndSelect('innovation.user', 'user')
      .where('innovation.status = :status', { status: true });

    // Filter by name or description if search term exists
    if (searchTerm) {
      query.andWhere(
        '(innovation.name LIKE :term OR innovation.description LIKE :term)',
        { term: `%${searchTerm}%` },
      );
    }

    // Filter by sponsorship type
    if (sponsorship) {
      query.andWhere('innovation.sponsorship_needed = :sponsorship', {
        sponsorship,
      });
    }

    return await query.orderBy('innovation.created_at', 'DESC').getMany();
  }

  async getPublicCounts() {
    const total = await this.innovationRepo.count({ where: { status: true } });
    const sponsored = await this.innovationRepo.count({
      where: { status: true, sponsorship_needed: 'sponsored' },
    });
    const unsponsored = await this.innovationRepo.count({
      where: { status: true, sponsorship_needed: 'unsponsored' },
    });
    const no_need = await this.innovationRepo.count({
      where: { status: true, sponsorship_needed: 'no-need' },
    });

    return { total, sponsored, unsponsored, no_need };
  }

  // src/innovation/innovation.service.ts

  async findOne(id: string) {
    const innovation = await this.innovationRepo.findOne({
      where: { id, status: true }, // Only show if it's approved
      relations: ['user'], // Join with the user table to get innovator details
    });

    if (!innovation) {
      return null;
    }

    return innovation;
  }



   async updateInnovation(
    userId: string,
    innovationId: string,
    updateData: any,
    photoPath?: string,
  ) {
    // Verify ownership
    const innovation = await this.innovationRepo.findOne({
      where: { id: innovationId, userId },
    });
 
    if (!innovation) {
      throw new NotFoundException(
        'Innovation not found or unauthorized',
      );
    }
 
    // Allowed fields to update
    const allowedFields = ['name', 'description', 'sponsorship_needed'];
    const dataToUpdate: any = {};
 
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined && updateData[field] !== null) {
        dataToUpdate[field] = updateData[field];
      }
    });
 
    // Update photo if provided
    if (photoPath) {
      dataToUpdate.photo = photoPath;
    }
 
    await this.innovationRepo.update(innovationId, dataToUpdate);
    return this.innovationRepo.findOneBy({ id: innovationId });
  }
 
  // ============= NEW: DELETE INNOVATION =============
  async deleteInnovation(userId: string, innovationId: string) {
    // Verify ownership
    const innovation = await this.innovationRepo.findOne({
      where: { id: innovationId, userId },
    });
 
    if (!innovation) {
      throw new NotFoundException(
        'Innovation not found or unauthorized',
      );
    }
 
    await this.innovationRepo.delete(innovationId);
    return { success: true, message: 'Innovation deleted successfully' };
  }
}
