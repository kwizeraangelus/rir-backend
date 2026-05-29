import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MulterModule.register({
      storage: diskStorage({
        destination: (_req, file, cb) => {
          const dirs: Record<string, string> = {
            profile_image: './uploads/profiles',
            cv: './uploads/documents',
            resume: './uploads/documents',
          };
          const dir = dirs[file.fieldname] || './uploads/misc';
          fs.mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
