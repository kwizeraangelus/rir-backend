import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExpertService } from './expert.service';
import { CreateExpertDto } from './dto/create-expert.dto';
import { UpdateExpertDto } from './dto/update-expert.dto';
import { AdminGuard } from '../auth/admin.guard';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { Expert } from './entities/expert.entity';

const memory = memoryStorage();

@Controller('experts')
export class ExpertController {
  constructor(private readonly expertService: ExpertService) {}

  // Public endpoints
  @Get()
  async findAll(): Promise<Expert[]> {
    return await this.expertService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Expert> {
    return await this.expertService.findById(id);
  }

  // Admin endpoints
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  async create(@Body() createExpertDto: CreateExpertDto): Promise<Expert> {
    return await this.expertService.create(createExpertDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateExpertDto: UpdateExpertDto,
  ): Promise<Expert> {
    return await this.expertService.update(id, updateExpertDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return await this.expertService.remove(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id/verify')
  async verify(@Param('id') id: string): Promise<Expert> {
    return await this.expertService.verify(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id/unverify')
  async unverify(@Param('id') id: string): Promise<Expert> {
    return await this.expertService.unverify(id);
  }

// Standalone — used during CREATE, before an expert id exists
@UseGuards(JwtAuthGuard, AdminGuard)
@Post('upload-profile-image')
@UseInterceptors(FileInterceptor('file', { storage: memory }))
async uploadStandaloneImage(
  @UploadedFile() file: Express.Multer.File,
): Promise<{ url: string }> {
  if (!file) {
    throw new Error('No file uploaded');
  }
  return await this.expertService.uploadImage(file);
}

// ID-scoped — used to replace an image on an EXISTING expert
@UseGuards(JwtAuthGuard, AdminGuard)
@Post(':id/upload-profile-image')
@UseInterceptors(FileInterceptor('file', { storage: memory }))
async uploadProfileImage(
  @Param('id') id: string,
  @UploadedFile() file: Express.Multer.File,
): Promise<Expert> {
  if (!file) {
    throw new Error('No file uploaded');
  }
  return await this.expertService.uploadProfileImage(id, file);
}
}
