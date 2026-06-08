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
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { Expert } from './entities/expert.entity';

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

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post(':id/upload-profile-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Expert> {
    if (!file) {
      throw new Error('No file uploaded');
    }
    const filePath = `/uploads/profiles/${file.filename}`;
    return await this.expertService.uploadProfileImage(id, filePath);
  }
}
