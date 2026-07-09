import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  UnauthorizedException,
  Query,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResearcherService } from './researcher.service';
import { memoryStorage } from 'multer';

const memory = memoryStorage();

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
@UseInterceptors(FileInterceptor('pdf', { storage: memory , limits: {
      fileSize: 100 * 1024 * 1024,   // 50MB
    }}))
async addPublication(
  @Req() req,
  @Body() body: any,
  @UploadedFile() file?: Express.Multer.File,
) {
  const userId = req.user?.userId;
  if (!userId) {
    console.error('User context missing from request:', req.user);
    throw new UnauthorizedException('User ID not found in token payload');
  }
  return this.researcherService.createPublication(userId, body, file);
}

 @Patch('update-profile')
@UseGuards(JwtAuthGuard)
@UseInterceptors(FileInterceptor('profile_image', { storage: memory }))
async updateProfile(
  @Req() req,
  @Body() body: any,
  @UploadedFile() file: Express.Multer.File,
) {
  const userId = req.user.userId;
  return this.researcherService.updateProfile(userId, body, file);
}

  @Get('publications/public')
  async getPublicPublications() {
    return this.researcherService.findAllApproved();
  }

  @Get('researchers')
  async getAllResearchers(@Query('search') search?: string) {
    return this.researcherService.getAllResearchers(search);
  }

  @Get('researchers/:id')
  async getResearcherDetail(@Param('id') id: string) {
    return this.researcherService.getResearcherDetail(id);
  }

  @Get('experts')
  async getAllExperts(@Query('search') search?: string) {
    return this.researcherService.getAllExperts(search);
  }

  @UseGuards(JwtAuthGuard)
@Patch('researches/:id')
@UseInterceptors(FileInterceptor('pdf', { storage: memory, limits: {
      fileSize: 100 * 1024 * 1024,   // 50MB
    } }))
async updatePublication(
  @Req() req,
  @Param('id') id: string,
  @Body() body: any,
  @UploadedFile() file?: Express.Multer.File,
) {
  const userId = req.user?.userId;
  if (!userId) throw new UnauthorizedException('User ID not found in token payload');
  return this.researcherService.updatePublication(userId, id, body, file);
}

  @UseGuards(JwtAuthGuard)
  @Delete('researches/:id')
  async deletePublication(@Req() req, @Param('id') id: string) {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException('User ID not found in token payload');
    return this.researcherService.deletePublication(userId, id);
  }
}