import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UpdateProfileDto, ChangePasswordDto } from './profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  private stripPassword(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safe } = user;
    return safe;
  }

  private guard(requesterId: string, targetId: string, isStaff: boolean) {
    if (String(requesterId) !== String(targetId) && !isStaff) {
      throw new ForbiddenException('You can only access your own profile');
    }
  }

  private async findOrFail(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // GET /profile/:id
  async getProfile(targetId: string, requesterId: string, isStaff: boolean) {
    this.guard(requesterId, targetId, isStaff);
    const user = await this.findOrFail(targetId);
    return this.stripPassword(user);
  }

  // PATCH /profile/:id
  async updateProfile(
    targetId: string,
    requesterId: string,
    isStaff: boolean,
    dto: UpdateProfileDto) {
    this.guard(requesterId, targetId, isStaff);
    const user = await this.findOrFail(targetId);

    const fields: (keyof UpdateProfileDto)[] = [
      'first_name',
      'last_name',
      'phone_number',
      'age',
      'location',
      'details',
      'bio',
      'orcid',
      'university_name',
    ];
    for (const key of fields) {
      if (dto[key] !== undefined) (user as unknown as Record<string, unknown>)[key] = dto[key];
    }

    return this.stripPassword(await this.userRepo.save(user));
  }

  // PATCH /profile/:id/photo
  async updatePhoto(
    targetId: string,
    requesterId: string,
    isStaff: boolean,
    filePath: string) {
    this.guard(requesterId, targetId, isStaff);
    const user = await this.findOrFail(targetId);
    user.profile_image = filePath;
    return this.stripPassword(await this.userRepo.save(user));
  }

  // PATCH /profile/:id/cv
  async updateCv(
    targetId: string,
    requesterId: string,
    isStaff: boolean,
    filePath: string) {
    this.guard(requesterId, targetId, isStaff);
    const user = await this.findOrFail(targetId);
    user.cv = filePath;
    return this.stripPassword(await this.userRepo.save(user));
  }

  // PATCH /profile/:id/resume
  async updateResume(
    targetId: string,
    requesterId: string,
    isStaff: boolean,
    filePath: string) {
    this.guard(requesterId, targetId, isStaff);
    const user = await this.findOrFail(targetId);
    user.resume = filePath;
    return this.stripPassword(await this.userRepo.save(user));
  }

  // POST /profile/:id/change-password
  async changePassword(
    targetId: string,
    requesterId: string,
    isStaff: boolean,
    dto: ChangePasswordDto) {
    this.guard(requesterId, targetId, isStaff);
    const user = await this.findOrFail(targetId);

    const valid = await bcrypt.compare(dto.current_password, user.password);
    if (!valid) throw new UnauthorizedException('Current password is incorrect');

    user.password = await bcrypt.hash(dto.new_password, 10);
    await this.userRepo.save(user);
    return { message: 'Password changed successfully' };
  }
}