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
import { memoryStorage } from 'multer';
import { InnovationService } from './innovation.service';
import type { JwtUser } from '../auth/jwt.strategy';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { Request } from 'express';
import { uploadFileToR2 } from '../storage/r2.storage';

const memory = memoryStorage();

export interface RequestWithUser extends Request {
  user: JwtUser;
}

@Controller('api')
export class InnovationController {
  constructor(private readonly innovationService: InnovationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my-innovations')
  async getMyInnovations(@Req() req: RequestWithUser): Promise<any> {
    return this.innovationService.findMyInnovations(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('innovations/create')
  @UseInterceptors(FileInterceptor('photo', { storage: memory }))
  async createInnovation(
    @Req() req: RequestWithUser,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    const photoPath = file ? await uploadFileToR2(file, 'innovations') : null;
    return this.innovationService.create(req.user.userId, body, photoPath);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('innovations/:id')
  @UseInterceptors(FileInterceptor('photo', { storage: memoryStorage() }))
  async updateInnovation(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<any> {
    const photoPath = file ? await uploadFileToR2(file, 'innovations') : undefined;
    return this.innovationService.updateInnovation(req.user.userId, id, body, photoPath);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('innovations/:id')
  async deleteInnovation(@Req() req: RequestWithUser, @Param('id') id: string): Promise<any> {
    return this.innovationService.deleteInnovation(req.user.userId, id);
  }

  @Get('innovations/public-lists')
  async getPublicList(
    @Query('search') search?: string,
    @Query('sponsorship_needed') sponsorship?: string,
  ): Promise<any> {
    return this.innovationService.findAllPublic(search, sponsorship);
  }

  @Get('innovations/public-countss')
  async getCounts(): Promise<any> {
    return this.innovationService.getPublicCounts();
  }

  @Get('innovation/:id')
  async getOne(@Param('id') id: string): Promise<any> {
    const innovation = await this.innovationService.findOne(id);
    if (!innovation) throw new NotFoundException('Innovation not found or not approved');
    return innovation;
  }
}