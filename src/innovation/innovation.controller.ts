// src/innovator/innovation.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { InnovationService } from './innovation.service';
import type { JwtUser } from '../auth/jwt.strategy';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { Request } from 'express';

export interface MulterFile {
  filename: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  path: string;
  buffer: Buffer;
}

export interface RequestWithUser extends Request {
  user: JwtUser;
}

@Controller('api')
export class InnovationController {
  constructor(private readonly innovationService: InnovationService) {}

  // 1. Get current user's innovations
  @UseGuards(JwtAuthGuard)
  @Get('my-innovations')
  async getMyInnovations(@Req() req: RequestWithUser): Promise<any> {
    return this.innovationService.findMyInnovations(req.user.userId);
  }

  // 2. Create a new innovation with a photo upload
  @UseGuards(JwtAuthGuard)
  @Post('innovations/create')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/innovations',
        filename: (req, file, cb) =>
          cb(null, `${Date.now()}${extname(file.originalname)}`),
      }),
    }),
  )
  async createInnovation(
    @Req() req: RequestWithUser,
    @Body() body: any,
    @UploadedFile() file: MulterFile,
  ): Promise<any> {
    const photoPath = file ? `/uploads/innovations/${file.filename}` : null;
    return this.innovationService.create(req.user.userId, body, photoPath);
  }

  // 3. Update innovation (PATCH)
  @UseGuards(JwtAuthGuard)
  @Patch('innovations/:id')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/innovations',
        filename: (req, file, cb) =>
          cb(null, `${Date.now()}${extname(file.originalname)}`),
      }),
    }),
  )
  async updateInnovation(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file?: MulterFile,
  ): Promise<any> {
    const photoPath = file ? `/uploads/innovations/${file.filename}` : undefined;
    return this.innovationService.updateInnovation(
      req.user.userId,
      id,
      body,
      photoPath,
    );
  }

  // 4. Delete innovation (DELETE)
  @UseGuards(JwtAuthGuard)
  @Delete('innovations/:id')
  async deleteInnovation(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<any> {
    return this.innovationService.deleteInnovation(req.user.userId, id);
  }

  // 5. Get public list
  @Get('innovations/public-lists')
  async getPublicList(
    @Query('search') search?: string,
    @Query('sponsorship_needed') sponsorship?: string,
  ): Promise<any> {
    return this.innovationService.findAllPublic(search, sponsorship);
  }

  // 6. Get public counts
  @Get('innovations/public-countss')
  async getCounts(): Promise<any> {
    return this.innovationService.getPublicCounts();
  }

  // 7. Get single innovation detail (public)
  @Get('innovation/:id')
  async getOne(@Param('id') id: string): Promise<any> {
    const innovation = await this.innovationService.findOne(id);

    if (!innovation) {
      throw new NotFoundException('Innovation not found or not approved');
    }

    return innovation;
  }
}
