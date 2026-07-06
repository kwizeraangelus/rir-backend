// university/university.service.ts
import { Injectable, NotFoundException, BadRequestException , ForbiddenException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UniversityUpload } from './entities/university-upload.entity';

@Injectable()
export class UniversityService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UniversityUpload)
    private uploadRepo: Repository<UniversityUpload>,
  ) {}

  async updateProfile(userId: string, updateData: Partial<User>) {
    await this.userRepo.update(userId, updateData);
    return this.userRepo.findOneBy({ id: userId });
  }

  async createUpload(userId: string, data: any, filePath: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    const upload = this.uploadRepo.create({
      ...data,
      file_path: filePath,
      user,
    });
    return this.uploadRepo.save(upload);
  }

  async getMyUploads(userId: string) {
    return this.uploadRepo.find({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
    });
  }

  async getUserById(userId: string) {
    // This finds the full user profile (name, university, bio, image)
    return this.userRepo.findOneBy({ id: userId });
  }

  async getUploadById(id: string) {
    return this.uploadRepo.findOne({
      where: { id },
      relations: ['user'], // Optional: if you need user data too
    });
  }

  async findApproved(
  search?: string,
  degreeType?: string,
  fieldKeywords?: string,
) {
  const query = this.uploadRepo
    .createQueryBuilder('p')
    .leftJoin('p.user', 'user')
   .addSelect(['user.university_name']) // only pull what we need, avoid leaking password etc.
    .where('p.status = :status', { status: 'approved' });

  if (search) {
    query.andWhere(
      new Brackets((qb) => {
        qb.where('p.title LIKE :s', { s: `%${search}%` })
          .orWhere('p.authors LIKE :s', { s: `%${search}%` })
          .orWhere('p.description LIKE :s', { s: `%${search}%` });
      }),
    );
  }

  if (degreeType && degreeType !== 'all') {
    query.andWhere(
      new Brackets((qb) => {
        qb.where('p.degree_type = :dt', { dt: degreeType }).orWhere(
          new Brackets((qb2) => {
            qb2
              .where('p.degree_type IS NULL')
              .andWhere('p.submission_type LIKE :dtPrefix', {
                dtPrefix: `${degreeType}%`,
              });
          }),
        );
      }),
    );
  }

  if (fieldKeywords) {
    const keywords = fieldKeywords.split(',');
    query.andWhere(
      new Brackets((qb) => {
        keywords.forEach((k, i) => {
          qb.orWhere(`p.submission_type LIKE :k${i}`, {
            [`k${i}`]: `%${k}%`,
          });
        });
      }),
    );
  }

  const results = await query.getMany();

  const inferDegree = (p: UniversityUpload): string | undefined => {
    if (p.degree_type) return p.degree_type;
    if (p.submission_type?.toLowerCase().startsWith('dissertation')) return 'dissertation';
    if (p.submission_type?.toLowerCase().startsWith('thesis')) return 'thesis';
    return undefined;
  };

  return results.map((p) => {
  const mapped: any = {
    ...p,
    university_name: p.user?.university_name || null,
    degree_type: inferDegree(p),
    file_url: `http://localhost:8000${p.file_path}`,
    cover_image: p.cover_image ? `http://localhost:8000${p.cover_image}` : null,
  };
  delete mapped.user;      // don't leak the raw joined user object
  delete mapped.university; // drop the old, unreliable free-typed field entirely
  return mapped;
});
}


async deleteUpload(userId: string, uploadId: string) {
  const upload = await this.uploadRepo.findOne({
    where: { id: uploadId },
    relations: ['user'],
  });

  if (!upload) {
    throw new NotFoundException('Upload not found');
  }

  if (!upload.user || upload.user.id !== userId) {
    throw new ForbiddenException('You can only delete your own uploads');
  }

  await this.uploadRepo.remove(upload);
  return { success: true };
}

  async getCounts(degreeType?: string) {
  const query = this.uploadRepo
    .createQueryBuilder('p')
    .where('p.status = :status', { status: 'approved' });

  if (degreeType && degreeType !== 'all') {
    query.andWhere(
      new Brackets((qb) => {
        qb.where('p.degree_type = :dt', { dt: degreeType }).orWhere(
          new Brackets((qb2) => {
            qb2
              .where('p.degree_type IS NULL')
              .andWhere('p.submission_type LIKE :dtPrefix', {
                dtPrefix: `${degreeType}%`,
              });
          }),
        );
      }),
    );
  }

  const items = await query.getMany();

  const inferDegree = (i: UniversityUpload): string | undefined => {
    if (i.degree_type) return i.degree_type;
    if (i.submission_type?.toLowerCase().startsWith('dissertation')) return 'dissertation';
    if (i.submission_type?.toLowerCase().startsWith('thesis')) return 'thesis';
    return undefined;
  };

  return {
    thesis: items.filter((i) => inferDegree(i) === 'thesis').length,
    dissertation: items.filter((i) => inferDegree(i) === 'dissertation').length,
    engineering: items.filter((i) => i.submission_type.includes('engineering')).length,
    medicine_health_sciences: items.filter((i) => i.submission_type.match(/medicine|health|nursing/)).length,
    arts_humanities: items.filter((i) => i.submission_type.match(/law|arts|history/)).length,
    natural_sciences: items.filter((i) => i.submission_type.match(/biology|physics|chemistry/)).length,
    social_sciences: items.filter((i) => i.submission_type.match(/sociology|psychology|social/)).length,
    business_economics: items.filter((i) => i.submission_type.match(/business|economics|finance/)).length,
    computer_science_it: items.filter((i) => i.submission_type.match(/computer|it|software/)).length,
    education: items.filter((i) => i.submission_type.includes('education')).length,
  };
}
  // src/university/university.service.ts
  async getPublicBookDetail(id: string) {
    // Find only approved books
    const book = await this.uploadRepo.findOne({
      where: { id, status: 'approved' },
      relations: ['user'], // To get author details
    });

    if (book) {
      // Auto-increment views when someone opens the page
      await this.uploadRepo.increment({ id }, 'views_count', 1);
    }

    return book;
  }

  async findApprovedPublic(userId?: string) {
    const where: any = { status: 'approved' };

    // Use 'userId' (no underscore) to match your DB column
    if (userId) {
      where.userId = userId;
    }

    return this.uploadRepo.find({
      where,
      relations: ['user'],
      order: { created_at: 'DESC' },
      take: 10,
    });
  }

  async updateLikes(id: string, action: 'increment' | 'decrement') {
    if (action === 'increment') {
      await this.uploadRepo.increment({ id }, 'likes_count', 1);
    } else {
      // Ensure likes don't go below 0
      const book = await this.uploadRepo.findOneBy({ id });
      if (book && (book.likes_count ?? 0) > 0) {
        await this.uploadRepo.decrement({ id }, 'likes_count', 1);
      }
    }
    return { success: true };
  }

  // src/university/university.service.ts

  async addRating(id: string, rating: number) {
  const book = await this.uploadRepo.findOneBy({ id });
  if (!book) throw new NotFoundException();

  const numericRating = Number(rating);
  if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
    throw new BadRequestException('Rating must be a number between 1 and 5');
  }

  // Accumulate onto existing values (treat missing/null as 0, not the whole expression)
  const newSum = (book.rating_sum ?? 0) + numericRating;
  const newCount = (book.rating_count ?? 0) + 1;
  const newAverage = newSum / newCount;

  await this.uploadRepo.update(id, {
    rating_sum: newSum,
    rating_count: newCount,
    average_rating: parseFloat(newAverage.toFixed(1)),
  });

  return { success: true, average: newAverage };
}

  async getPublicBookDetails(id: string) {
    const book = await this.uploadRepo.findOne({
      where: { id, status: 'approved' },
    });

    if (book) {
      // Map backend file_path to frontend file_url
      return {
        ...book,
        file_url: `http://localhost:8000${book.file_path}`,
      };
    }
    return null;
  }



  async updateUpload(userId: string, uploadId: string, updateData: any, filePath?: string) {
  // Verify ownership
  const upload = await this.uploadRepo.findOne({
    where: { id: uploadId, user: { id: userId } },
  });

  if (!upload) throw new NotFoundException('Upload not found or unauthorized');

  // Update allowed fields only
  const allowedFields = ['title', 'authors', 'description', 'supervisor_name', 'year'];
  const dataToUpdate: any = {};

  allowedFields.forEach(field => {
    if (updateData[field] !== undefined && updateData[field] !== null) {
      dataToUpdate[field] = updateData[field];
    }
  });

  // Update file if provided
  if (filePath) {
    dataToUpdate.file_path = filePath;
  }

  await this.uploadRepo.update(uploadId, dataToUpdate);
  return this.uploadRepo.findOneBy({ id: uploadId });
}
}
