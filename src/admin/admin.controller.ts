import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from '../auth/admin.guard';
import { diskStorage } from 'multer';

import { extname } from 'path';

// src/admin/admin.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  Req,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  Request,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { ExpertService } from '../expert/expert.service';
import { Expert } from '../expert/entities/expert.entity';
import { CreateExpertDto } from 'src/expert/dto/create-expert.dto';
import { UpdateExpertDto } from 'src/expert/dto/update-expert.dto';

export interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    category: string;
    is_staff: boolean;
  };
}

export interface CreateEventDto {
  title: string;
  description: string;
  date: string;
  location: string;
  status: string;
}

export interface UpdateEventDto {
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  status?: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  user_category: string;
  is_staff: boolean;
  is_active: boolean;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  user_category?: string;
  is_staff?: boolean;
  is_active?: boolean;
}

export interface AdminFilters {
  search?: string;
  status?: string;
  category?: string;
  page?: string;
  limit?: string;
}

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

@Controller('api/admin')
@UseGuards(JwtAuthGuard, AdminGuard) // Only logged-in staff/admin can access
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly expertService: ExpertService,
  ) {}

  // 1. Dashboard Stats & Pending Books
  @Get('dashboard')
  async getDashboard() {
    return this.adminService.getDashboardData();
  }

  // 2. Approve/Reject Research
  @Post('upload/:id/update')
  async updateUploadStatus(
    @Param('id') id: string,
    @Body() body: { action: string; feedback?: string },
  ) {
    return this.adminService.processUpload(id, body.action, body.feedback);
  }

  // 3. User Management
  @Get('users')
  async getAllUsers() {
    return this.adminService.getUsers();
  }

  @Put('users/:id/update')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.adminService.updateUser(id, body);
  }

  @Delete('users/:id/delete')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // 4. Approved Books with Filters
  @Get('approved-books')
  async getApproved(@Query() filters: AdminFilters) {
    return this.adminService.getApprovedBooks(filters);
  }

  // src/admin/admin.controller.ts
  @Post('users/create')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async createUser(@Body() body: CreateUserDto) {
    return this.adminService.createUser(body);
  }

  // src/admin/admin.controller.ts

  @Post('events/create')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/events',
        filename: (req, file, cb) =>
          cb(null, `${Date.now()}${extname(file.originalname)}`),
      }),
    }),
  )
  async createAdminEvent(
    @Req() req: RequestWithUser,
    @Body() body: CreateEventDto,
    @UploadedFile() file: MulterFile,
  ) {
    const photoPath = file ? `/uploads/events/${file.filename}` : null;
    // Use req.user.userId (or sub) from your JwtStrategy
    return this.adminService.createEvent(req.user.userId, body, photoPath);
  }

  // src/admin/admin.controller.ts

  @Get('events')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getAllEvents() {
    return this.adminService.getAllEvents();
  }

  // src/admin/admin.controller.ts

  @Delete('events/:id/delete')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deleteEvent(@Param('id') id: string) {
    return this.adminService.deleteEvent(id);
  }

  // src/admin/admin.controller.ts

  @Put('events/:id/update')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/events',
        filename: (req, file, cb) =>
          cb(null, `${Date.now()}${extname(file.originalname)}`),
      }),
    }),
  )
  async updateAdminEvent(
    @Param('id') id: string,
    @Body() body: UpdateEventDto,
    @UploadedFile() file: MulterFile,
  ) {
    const photoPath = file ? `/uploads/events/${file.filename}` : undefined;
    return this.adminService.updateEvent(id, body, photoPath);
  }

  // src/admin/admin.controller.ts

  @Delete('books/:id/delete')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deleteBook(@Param('id') id: string) {
    return this.adminService.deleteBook(id);
  }

  @Get('events/pending')
  async getPending() {
    return this.adminService.findPending();
  }

  // 2. POST Approve (set status to true)
  @Post('events/:id/approve')
  async approve(@Param('id') id: string) {
    return this.adminService.updateStatus(id, true);
  }

  // 3. POST Reject (Keep status false and add feedback)
  @Post('events/:id/reject')
  async reject(@Param('id') id: string, @Body('feedback') feedback: string) {
    return this.adminService.rejectEvent(id, feedback);
  }

  // 4. DELETE Permanent
  @Delete('events/:id')
  async delete(@Param('id') id: string) {
    return this.adminService.remove(id);
  }

  // src/admin/admin.controller.ts

  @Get('publications/pending')
  async getPendingPubs() {
    return this.adminService.getPendingPublications();
  }

  @Post('publications/:id/approve')
  async approvePub(@Param('id') id: string) {
    return this.adminService.approvePublication(id);
  }

  @Post('publications/:id/reject')
  async rejectPub(@Param('id') id: string, @Body('feedback') feedback: string) {
    return this.adminService.rejectPublication(id, feedback);
  }

  @Delete('publications/:id')
  async deletePub(@Param('id') id: string) {
    return this.adminService.deletePublication(id);
  }

  // src/admin/admin.controller.ts

  @Get('innovations/pending')
  async getPendingInnovations() {
    return this.adminService.getPendingInnovations();
  }

  @Post('innovations/:id/approve')
  async approveInnovation(@Param('id') id: string) {
    return this.adminService.approveInnovation(id);
  }

  @Post('innovations/:id/reject')
  async rejectInnovation(
    @Param('id') id: string,
    @Body('feedback') feedback: string,
  ) {
    return this.adminService.rejectInnovation(id, feedback);
  }

  @Delete('innovations/:id')
  async deleteInnovation(@Param('id') id: string) {
    return this.adminService.deleteInnovation(id);
  }
@Post('create-research')
  @UseGuards(JwtAuthGuard)
  async createResearch(
    @Req() req,
    @Body() body: any,
  ) {
    const adminId = req.user.userId;
    return this.adminService.createResearch(adminId, body);
  }
  @UseGuards(JwtAuthGuard, AdminGuard) 
  @Get()
  @ApiOperation({ summary: '[Admin] List all experts' })
  findAll() {
    return this.expertService.findAll();
  }
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get(':id')
  @ApiOperation({ summary: '[Admin] Get expert by ID' })
  async findOne(@Param('id') id: string): Promise<Expert> {
    return await this.expertService.findById(id);
  }
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  @ApiOperation({ summary: '[Admin] Create expert' })
  async create(@Body() dto: CreateExpertDto, @Request() req): Promise<Expert> {
    console.log(`[Admin] ${req.user.username} created: ${dto.name}`);
    return await this.expertService.create(dto);
  }
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  @ApiOperation({ summary: '[Admin] Update expert (partial)' })
  async update(@Param('id') id: string, @Body() dto: UpdateExpertDto, @Request() req): Promise<Expert> {
    console.log(`[Admin] ${req.user.username} updated: ${id}`);
    return await this.expertService.update(id, dto);
  }
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: '[Admin] Delete expert' })
  async remove(@Param('id') id: string, @Request() req): Promise<void> {
    console.log(`[Admin] ${req.user.username} deleted: ${id}`);
    await this.expertService.remove(id);
  }
}
