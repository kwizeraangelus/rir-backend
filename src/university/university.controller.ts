// university/university.controller.ts
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
  UnauthorizedException,
  Param,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UniversityService } from './university.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

@Controller('api')
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req) {
    const userId = req.user.sub;

    // Fetch the full user object so the frontend has 'username', 'university_name', etc.
    const user = await this.universityService.getUserById(userId);

    if (!user) throw new UnauthorizedException();
    return user;
  }
  @UseGuards(JwtAuthGuard)
  @Patch('update')
  @UseInterceptors(
    FileInterceptor('profile_image', {
      storage: diskStorage({
        destination: './uploads/profiles',
        filename: (req, file, cb) =>
          cb(null, `${Date.now()}${extname(file.originalname)}`),
      }),
    }),
  )
  async updateProfile(@Req() req, @Body() body, @UploadedFile() file) {
    const userId = req.user.userId;
    const updateData = { ...body };

    if (!userId) {
      throw new UnauthorizedException(
        'User ID not found in request. Check JwtStrategy.',
      );
    }

    // 2. RENAME: If frontend sends 'university', change it to 'university_name'
    if (body.university) {
      updateData.university_name = body.university;
      delete updateData.university; // Remove the key that doesn't exist in DB
    }

    // 3. Add file path if exists
    if (file) {
      updateData.profile_image = `/uploads/profiles/${file.filename}`;
    }

    return this.universityService.updateProfile(userId, updateData);
  }
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/research',
        filename: (req, file, cb) =>
          cb(null, `${Date.now()}-${file.originalname}`),
      }),
    }),
  )
  async uploadResearch(@Req() req, @Body() body, @UploadedFile() file) {
    return this.universityService.createUpload(req.user.sub, body, file.path);
  }
  @UseGuards(JwtAuthGuard)
  @Get('my-uploads')
  async getMyUploads(@Req() req) {
    return this.universityService.getMyUploads(req.user.id);
  }

  @Get('book/:id')
  @UseGuards(JwtAuthGuard)
  async getBook(@Param('id') id: string) {
    const book = await this.universityService.getUploadById(id);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    // Map the database fields to match what your frontend expects
    return {
      ...book,
      // Ensure file_url points to your NestJS static folder
      file_url: `http://localhost:8000/${book.file_path}`,
      status_display: book.status.toUpperCase(),
    };
  }

  @Get('innovations/public-list')
  async getPublicList(
    @Query('search') search?: string,
    @Query('degree_type') degreeType?: string,
    @Query('field_keywords') fieldKeywords?: string,
  ) {
    return this.universityService.findApproved(
      search,
      degreeType,
      fieldKeywords,
    );
  }

  @Get('innovations/public-counts')
  async getPublicCounts(@Query('degree_type') degreeType?: string) {
    return this.universityService.getCounts(degreeType);
  }

  // src/university/university.public.controller.ts

  // 1. GET Public Detail
  @Get('university/public-detail/:id')
  async getPublicDetail(@Param('id') id: string) {
    const book = await this.universityService.getPublicBookDetail(id);
    if (!book) throw new NotFoundException('Article not found');
    return book;
  }

  // 2. GET Public List (with User filter for "More by Author")
  @Get('university/public-list')
  async getPublicLists(@Query('user') userId?: string) {
    return this.universityService.findApprovedPublic(userId);
  }

  // 3. POST Like
  @Post('university/:id/like')
  async likeBook(@Param('id') id: string) {
    return this.universityService.updateLikes(id, 'increment');
  }

  // 4. POST Unlike
  @Post('university/:id/unlike')
  async unlikeBook(@Param('id') id: string) {
    return this.universityService.updateLikes(id, 'decrement');
  }

  // src/university/university.public.controller.ts

  @Post('university/rate/:id')
  async rateBook(@Param('id') id: string, @Body('rating') rating: number) {
    return this.universityService.addRating(id, rating);
  }
}
