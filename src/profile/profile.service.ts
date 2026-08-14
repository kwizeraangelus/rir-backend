import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { User, UserCategory } from '../users/entities/user.entity';
import { UpdateProfileDto, ChangePasswordDto, UpdateResearcherProfileDto } from './profile.dto';


@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly mailService: MailService,
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
      'email',
      'institution',
      'graduation_university',
      'bio',
      'orcid',
      'university_name',
      'qualification',
      'ResearchArea',
      'Position',
      'Field',
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


  async completeResearcherProfile(targetId: string, dto: UpdateResearcherProfileDto) {
  const user = await this.findOrFail(targetId);

  if (user.user_category !== UserCategory.RESEARCHER) {
    throw new ForbiddenException('Only researcher accounts have this profile step');
  }

  const tokenValid =
    user.emailVerificationToken &&
    user.emailVerificationToken === dto.token &&
    user.emailVerificationExpires &&
    user.emailVerificationExpires > new Date();

  if (!tokenValid) {
    throw new UnauthorizedException(
      'This link has expired. Please sign up again or contact support.',
    );
  }

  const fields: (keyof UpdateResearcherProfileDto)[] = [
    'location', 'institution', 'graduation_university', 'graduation_country',
    'bio', 'orcid', 'qualification', 'ResearchArea', 'Position', 'Field',
  ];
  for (const key of fields) {
    if (dto[key] !== undefined) {
      (user as unknown as Record<string, unknown>)[key] = dto[key];
    }
  }

  await this.userRepo.save(user);

  // Signup form + profile form are both saved now — send confirmation email.
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${dto.token}`;
  try {
    await this.mailService.sendVerificationEmail(
      user.email,
      user.first_name || user.username,
      verifyUrl,
    );
  } catch (error) {
    console.error('EMAIL ERROR:', error);
  }

  return { message: 'Profile saved. Please check your email to verify your account.' };
}
}