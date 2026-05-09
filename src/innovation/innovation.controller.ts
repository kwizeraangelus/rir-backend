import {
  Controller,
  Get,
  Post,
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

export interface CreateInnovationDto {
  title: string;
  description: string;
  category: string;
  target_group: string;
  innovation_type: string;
  problem_statement: string;
  proposed_solution: string;
  expected_impact: string;
  timeline: string;
  budget: string;
  sponsorship_needed: string;
  status: string;
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
      // This must match your frontend 'photo' key
      storage: diskStorage({
        destination: './uploads/innovations',
        filename: (req, file, cb) =>
          cb(null, `${Date.now()}${extname(file.originalname)}`),
      }),
    }),
  )
  async createInnovation(
    @Req() req: RequestWithUser,
    @Body() body: CreateInnovationDto,
    @UploadedFile() file: MulterFile,
  ): Promise<any> {
    const photoPath = file ? `/uploads/innovations/${file.filename}` : null;
    return this.innovationService.create(req.user.userId, body, photoPath);
  }

  @Get('innovations/public-lists')
  async getPublicList(
    @Query('search') search?: string,
    @Query('sponsorship_needed') sponsorship?: string,
  ): Promise<any> {
    return this.innovationService.findAllPublic(search, sponsorship);
  }

  // Match: http://localhost:8000/api/innovations/public-countss/
  @Get('innovations/public-countss')
  async getCounts(): Promise<any> {
    return this.innovationService.getPublicCounts();
  }

  // src/innovation/innovation.controller.ts

  @Get('innovation/:id') // This matches: GET /api/innovations/:id
  async getOne(@Param('id') id: string): Promise<any> {
    const innovation = await this.innovationService.findOne(id);

    if (!innovation) {
      throw new NotFoundException('Innovation not found or not approved');
    }

    return innovation;
  }
}
