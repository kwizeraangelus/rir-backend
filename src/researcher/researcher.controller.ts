// src/researcher/researcher.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UnauthorizedException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResearcherService } from './researcher.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('api')
export class ResearcherController {
  constructor(private readonly researcherService: ResearcherService) {}
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req) {
    return this.researcherService.getProfile(req.user.userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('my-researches')
  getMyResearches(@Req() req) {
    return this.researcherService.getPublications(req.user.userId);
  }
  @UseGuards(JwtAuthGuard)
  @Post('researches')
  async addPublication(@Req() req, @Body() body: any) {
    // Use .userId because that's what your JwtStrategy returns
    const userId = req.user?.userId;

    if (!userId) {
      console.error('User context missing from request:', req.user);
      throw new UnauthorizedException('User ID not found in token payload');
    }

    return this.researcherService.createPublication(userId, body);
  }

  // src/researcher/researcher.controller.ts
  @Patch('update-profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('profile_image', {
      storage: diskStorage({
        destination: './uploads/profiles',
        filename: (req, file, cb) =>
          cb(null, `${Date.now()}${extname(file.originalname)}`),
      }),
    }),
  )
  async updateProfile(
    @Req() req,
    @Body() body: { bio: string; platformId: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Use .userId from your JwtStrategy
    const userId = req.user.userId;
    return this.researcherService.updateProfile(userId, body, file);
  }

  // src/researcher/researcher.controller.ts

  @Get('publications/public') // GET /api/publications/public
  async getPublicPublications() {
    return this.researcherService.findAllApproved();
  }
}
