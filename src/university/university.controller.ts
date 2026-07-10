import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
  Delete,
  UnauthorizedException,
  Param,
  NotFoundException,
  Query,ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UniversityService } from './university.service';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { uploadFileToR2 } from '../storage/r2.storage';


const memory = memoryStorage();

const researchUploadConfig = {
  storage: memory,
  limits: { fileSize: 16 * 1024 * 1024 }, // 16MB
};

const profileUploadConfig = {
  storage: memory,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB for profile
};


@Controller('api')
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req) {
    const userId = req.user.userId;
    const user = await this.universityService.getUserById(userId);
    if (!user) throw new UnauthorizedException();
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  @UseInterceptors(FileInterceptor('profile_image', profileUploadConfig))
  async updateProfile(
  @Req() req, 
  @Body() body, 
  @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
      ],
      fileIsRequired: false,
      errorHttpStatusCode: 413,
    })
  ) file?: Express.Multer.File
) {
    const userId = req.user.userId;
    const updateData = { ...body };

    if (!userId) {
      throw new UnauthorizedException('User ID not found in request. Check JwtStrategy.');
    }

    if (body.university) {
      updateData.university_name = body.university;
      delete updateData.university;
    }

    if (file) {
      updateData.profile_image = await uploadFileToR2(file, 'profiles'); // ← R2 URL
    }

    return this.universityService.updateProfile(userId, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', researchUploadConfig))
  async uploadResearch(
    @Req() req, 
    @Body() body, 
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 16 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(pdf|doc|docx)$/i }),
        ],
        fileIsRequired: false,
        errorHttpStatusCode: 413,
      })
    ) file?: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const fileUrl = await uploadFileToR2(file, 'research');
    return this.universityService.createUpload(req.user.userId, body, fileUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-uploads')
  async getMyUploads(@Req() req) {
    return this.universityService.getMyUploads(req.user.userId);
  }

  @Get('book/:id')
  @UseGuards(JwtAuthGuard)
  async getBook(@Param('id') id: string) {
    const book = await this.universityService.getUploadById(id);
    if (!book) throw new NotFoundException('Book not found');

    return {
      ...book,
      file_url: book.file_path.startsWith('http')
        ? book.file_path          // R2 full URL — use directly
        : (() => {                 // legacy local path fallback
            const baseUrl = process.env.NODE_ENV === 'production'
              ? 'https://api.riri.rw'
              : 'http://localhost:8000';
            return `${baseUrl}/${book.file_path.replace(/^\/+/, '')}`;
          })(),
      status_display: book.status.toUpperCase(),
    };
  }


  @Get('innovations/public-list')
  async getPublicList(
    @Query('search') search?: string,
    @Query('degree_type') degreeType?: string,
    @Query('field_keywords') fieldKeywords?: string,
  ) {
    return this.universityService.findApproved(search, degreeType, fieldKeywords);
  }

  @Get('innovations/public-counts')
  async getPublicCounts(@Query('degree_type') degreeType?: string) {
    return this.universityService.getCounts(degreeType);
  }

  @Get('university/public-detail/:id')
  async getPublicDetail(@Param('id') id: string) {
    const book = await this.universityService.getPublicBookDetail(id);
    if (!book) throw new NotFoundException('Article not found');
    return book;
  }

  @Get('university/public-list')
  async getPublicLists(@Query('user') userId?: string) {
    return this.universityService.findApprovedPublic(userId);
  }

  @Post('university/:id/like')
  async likeBook(@Param('id') id: string) {
    return this.universityService.updateLikes(id, 'increment');
  }

  @Post('university/:id/unlike')
  async unlikeBook(@Param('id') id: string) {
    return this.universityService.updateLikes(id, 'decrement');
  }

  @Post('university/rate/:id')
  async rateBook(@Param('id') id: string, @Body('rating') rating: number) {
    return this.universityService.addRating(id, rating);
  }

  @UseGuards(JwtAuthGuard)
@Patch('upload/:id')
@UseInterceptors(FileInterceptor('file', researchUploadConfig))
async updateUpload(
  @Req() req, 
  @Param('id') id: string, 
  @Body() body, 
  @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 16 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: /(pdf|doc|docx)$/i }),
      ],
      fileIsRequired: false,
      errorHttpStatusCode: 413,
    })
  ) file?: Express.Multer.File
) {
  const filePath = file ? await uploadFileToR2(file, 'research') : undefined;
  return this.universityService.updateUpload(req.user.userId, id, body, filePath);
}
}