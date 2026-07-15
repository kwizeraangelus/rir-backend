import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserCategory } from '../users/entities/user.entity';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  // src/auth/auth.service.ts

  async signup(dto: SignupDto) {
  if (dto.password !== dto.confirmPassword) {
    throw new BadRequestException('Passwords do not match');
  }

  const existing = await this.userRepository.findOne({
    where: [{ email: dto.email }, { username: dto.username }],
  });
  if (existing) {
    throw new ConflictException('Email or Username already in use');
  }

  const token = uuidv4();

  const newUser = this.userRepository.create({
    username: dto.username,
    email: dto.email,
    password: dto.password,
    first_name: dto.first_name,
    last_name: dto.last_name,
    user_category: dto.user_category,
    is_active: false,
    emailVerificationToken: token,
    emailVerificationExpires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
  });

  await this.userRepository.save(newUser);

  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  try {
    await this.mailService.sendVerificationEmail(
      newUser.email,
      newUser.first_name || newUser.username,
      verifyUrl,
    );
  } catch (error) {
    console.error('EMAIL ERROR:', error);
  }

  return { message: 'Signup successful. Please check your email to verify your account.' };
}

// ─── VERIFY EMAIL ──────────────────────────────────────────────
async verifyEmail(token: string): Promise<void> {
  const cleanToken = token?.trim();
  const user = await this.userRepository.findOne({
    where: { emailVerificationToken: cleanToken },
  });

  if (!user) {
    throw new BadRequestException('Invalid or expired verification link');
  }
  if (!user.emailVerificationExpires || user.emailVerificationExpires < new Date()) {
    throw new BadRequestException('Verification link has expired. Please sign up again or request a new link.');
  }

  user.is_active = true;
  user.emailVerificationToken = null;
  user.emailVerificationExpires = null;
  await this.userRepository.save(user);
}

// Optional: let a user request a fresh link if theirs expired
async resendVerification(email: string): Promise<void> {
  const user = await this.userRepository.findOne({ where: { email } });
  if (!user || user.is_active) return; // stay silent either way

  const token = uuidv4();
  user.emailVerificationToken = token;
  user.emailVerificationExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);
  await this.userRepository.save(user);

  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  await this.mailService.sendVerificationEmail(
    user.email,
    user.first_name || user.username,
    verifyUrl,
  );
}

  async register(dto: RegisterDto): Promise<{ message: string }> {
    if (dto.password !== dto.password_confirmation) {
      throw new BadRequestException('Passwords do not match');
    }

    const existing = await this.userRepository.findOne({
      where: [{ email: dto.email }, { username: dto.username }],
    });
    if (existing) {
      throw new ConflictException(
        existing.email === dto.email
          ? 'Email already in use'
          : 'Username already taken',
      );
    }

    const user = this.userRepository.create(dto);
    await this.userRepository.save(user);

    return { message: 'User registered successfully' };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; redirect: string }> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'password',
        'user_category',
        'is_active',
        'is_staff',
      ],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('Account is inactive');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Decide redirect based on user category

    let redirect = '/';

    if (user.user_category === UserCategory.ADMIN || user.is_staff) {
      redirect = '/admin-dashboard'; // Matches your Admin folder
    } else {
      switch (user.user_category) {
        case UserCategory.UNIVERSITY:
          redirect = '/university';
          break;
        case UserCategory.RESEARCHER:
          redirect = '/researcher';
          break;
        case UserCategory.CONF_ORGANIZER:
          redirect = '/organizer';
          break;
        case UserCategory.PUBLIC_VISITOR:
          redirect = '/';
          break;
        case UserCategory.INNOVATOR:
          redirect = '/innovator';
          break;
        default:
          redirect = '/dashboard';
      }
    }
    console.log('User found:', user ? 'YES' : 'NO');
    console.log('Is Staff:', user?.is_staff);

    console.log('Password from form:', password);
    console.log('Password from DB:', user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Does it match?:', isMatch);

    // Generate JWT
    const payload = {
      sub: user.id,
      email: user.email,
      category: user.user_category,
      is_staff: user.is_staff,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token, // Now the variable is being "read"
      redirect: redirect,
    };
  }

  // You can add validateUser if you want to use it with Passport local strategy later

  // src/auth/auth.service.ts

  async onModuleInit() {
    await this.seedAdmin();
  }

  async seedAdmin() {
    const adminEmail = 'kwizeraangelus@gmail.com';
    const existingAdmin = await this.userRepository.findOneBy({
      email: adminEmail,
    });

    if (!existingAdmin) {
      const admin = this.userRepository.create({
        username: 'admin',
        email: adminEmail,
        password: 'admin123',
        first_name: 'System',
        last_name: 'Admin',
        phone_number: '+250782020044',
        user_category: UserCategory.ADMIN, // Use your Enum
        is_staff: true,
        is_active: true,
      });
      await this.userRepository.save(admin);
      console.log(' ✅ NEW ADMIN SEEDED: admin123');
    }
  }

  async forgotPassword(email: string): Promise<void> {
  const user = await this.userRepository.findOne({ where: { email } });
  if (!user) return;

  // Reuse existing token if it's still valid — avoids invalidating
  // an email link that's already been sent, if the user (or a double
  // click) triggers this again before the first link is used.
  const stillValid =
    user.resetPasswordToken &&
    user.resetPasswordExpires &&
    user.resetPasswordExpires > new Date();

  let token = user.resetPasswordToken;

  if (!stillValid) {
    token = uuidv4();
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 60);
    await this.userRepository.save(user);
  }

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  try {
    await this.mailService.sendPasswordReset(
      user.email,
      user.first_name || user.username,
      resetUrl,
    );
  } catch (error) {
    console.error('EMAIL ERROR:', error);
  }
}

  // ─── VERIFY RESET TOKEN ───────────────────────────────────────────────────
  async verifyResetToken(token: string): Promise<boolean> {
    const cleanToken = token?.trim();
    const user = await this.userRepository.findOne({
      where: { resetPasswordToken: cleanToken },
    });

     console.log('── verifyResetToken debug ──');
  console.log('token from URL:', cleanToken);
  console.log('user found:', !!user);
  console.log('expiresAt:', user?.resetPasswordExpires, user?.resetPasswordExpires?.toISOString());
  console.log('Node now:', new Date(), new Date().toISOString());

    if (!user || !user.resetPasswordExpires) return false;
    if (user.resetPasswordExpires < new Date()) return false;

    return true;
  }

  // ─── RESET PASSWORD ───────────────────────────────────────────────────────
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const cleanToken = token?.trim();
    const user = await this.userRepository.findOne({
      where: { resetPasswordToken: cleanToken },
    });

    if (!user) throw new BadRequestException('Invalid or expired reset token');
    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Reset token has expired. Please request a new one.');
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    user.password = hashed;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.userRepository.save(user);
  }
}
