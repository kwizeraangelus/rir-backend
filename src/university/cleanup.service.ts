// cleanup.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { UniversityUpload } from './entities/university-upload.entity'; // adjust path
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(
    @InjectRepository(UniversityUpload)
    private readonly uploadRepo: Repository<UniversityUpload>,
  ) {}

  // Runs every hour
  @Cron(CronExpression.EVERY_HOUR)
  async deleteRejectedUploads() {
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - 48); // 48 hours ago

    const expiredUploads = await this.uploadRepo.find({
      where: {
        status: 'rejected',
        updated_at: LessThan(cutoff), // when it was rejected
      },
    });

    if (expiredUploads.length === 0) return;

    this.logger.log(`Found ${expiredUploads.length} rejected uploads to delete`);

    for (const upload of expiredUploads) {
      // Delete file from disk
      if (upload.file_path) {
        const fullPath = path.join(process.cwd(), upload.file_path);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          this.logger.log(`Deleted file: ${fullPath}`);
        }
      }

      // Delete cover image from disk
      if (upload.cover_image) {
        const coverPath = path.join(process.cwd(), upload.cover_image);
        if (fs.existsSync(coverPath)) {
          fs.unlinkSync(coverPath);
        }
      }

      // Delete DB record
      await this.uploadRepo.remove(upload);
      this.logger.log(`Deleted upload record: ${upload.id}`);
    }
  }
}