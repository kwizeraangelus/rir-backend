import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from '../auth/admin.guard';
import { memoryStorage } from 'multer';
import { uploadFileToR2 } from '../storage/r2.storage';

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

const memory = memoryStorage();

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

@Controller('api/admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly expertService: ExpertService,
  ) {}

  @Get('dashboard')
  async getDashboard() {
    return this.adminService.getDashboardData();
  }

  @Post('upload/:id/update')
  async updateUploadStatus(
    @Param('id') id: string,
    @Body() body: { action: string; feedback?: string },
  ) {
    return this.adminService.processUpload(id, body.action, body.feedback);
  }

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

  @Get('approved-books')
  async getApproved(@Query() filters: AdminFilters) {
    return this.adminService.getApprovedBooks(filters);
  }

  @Post('users/create')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async createUser(@Body() body: CreateUserDto) {
    return this.adminService.createUser(body);
  }

  // ← photo upload now goes to R2
  @Post('events/create')
  @UseInterceptors(FileInterceptor('photo', { storage: memory }))
  async createAdminEvent(
    @Req() req: RequestWithUser,
    @Body() body: CreateEventDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const photoPath = file ? await uploadFileToR2(file, 'events') : null;
    return this.adminService.createEvent(req.user.userId, body, photoPath);
  }

  @Get('events')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getAllEvents() {
    return this.adminService.getAllEvents();
  }

  @Delete('events/:id/delete')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deleteEvent(@Param('id') id: string) {
    return this.adminService.deleteEvent(id);
  }

  // ← photo upload now goes to R2
  @Put('events/:id/update')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('photo', { storage: memory }))
  async updateAdminEvent(
    @Param('id') id: string,
    @Body() body: UpdateEventDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const photoPath = file ? await uploadFileToR2(file, 'events') : undefined;
    return this.adminService.updateEvent(id, body, photoPath);
  }

  @Delete('books/:id/delete')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deleteBook(@Param('id') id: string) {
    return this.adminService.deleteBook(id);
  }

  @Get('events/pending')
  async getPending() {
    return this.adminService.findPending();
  }

  @Post('events/:id/approve')
  async approve(@Param('id') id: string) {
    return this.adminService.updateStatus(id, true);
  }

  @Post('events/:id/reject')
  async reject(@Param('id') id: string, @Body('feedback') feedback: string) {
    return this.adminService.rejectEvent(id, feedback);
  }

  @Delete('events/:id')
  async delete(@Param('id') id: string) {
    return this.adminService.remove(id);
  }

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
  async createResearch(@Req() req, @Body() body: any) {
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