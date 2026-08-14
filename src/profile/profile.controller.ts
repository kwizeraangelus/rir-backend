import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { UpdateProfileDto, ChangePasswordDto, UpdateResearcherProfileDto } from './profile.dto';

interface JwtUser {
  userId: string;
  email: string;
  category: string;
  is_staff: boolean;
}

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getProfile(@Param('id') id: string, @Req() req: { user: JwtUser }) {
    return this.profileService.getProfile(
      id,
      req.user.userId,
      req.user.is_staff);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateProfile(@Param('id') id: string, @Body() dto: UpdateProfileDto, @Req() req: { user: JwtUser }) {
    return this.profileService.updateProfile(id, req.user.userId, req.user.is_staff, dto);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id/photo')
  @UseInterceptors(FileInterceptor('profile_image'))
  updatePhoto(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Req() req: { user: JwtUser }) {
    return this.profileService.updatePhoto(id, req.user.userId, req.user.is_staff, file.path);
  }
   
  @UseGuards(JwtAuthGuard)
  @Patch(':id/cv')
  @UseInterceptors(FileInterceptor('cv'))
  updateCv(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Req() req: { user: JwtUser }) {
    return this.profileService.updateCv(id, req.user.userId, req.user.is_staff, file.path);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/resume')
  @UseInterceptors(FileInterceptor('resume'))
  updateResume(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Req() req: { user: JwtUser }) {
    return this.profileService.updateResume(id, req.user.userId, req.user.is_staff, file.path);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/change-password')
  @HttpCode(HttpStatus.OK)
  changePassword(@Param('id') id: string, @Body() dto: ChangePasswordDto, @Req() req: { user: JwtUser }) {
    return this.profileService.changePassword(id, req.user.userId, req.user.is_staff, dto);
  }

  @Patch(':id/complete-researcher')
  @UseGuards()
  async completeResearcherProfile(
  @Param('id') id: string,
  @Body() dto: UpdateResearcherProfileDto,
) {
  return this.profileService.completeResearcherProfile(id, dto);
}
}