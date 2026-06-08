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
    // 1. Password Confirmation Check
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // 2. Check if user exists
    const existing = await this.userRepository.findOne({
      where: [{ email: dto.email }, { username: dto.username }],
    });
    if (existing) {
      throw new ConflictException('Email or Username already in use');
    }

    // 3. Map Frontend names to Database Entity names
    const newUser = this.userRepository.create({
      username: dto.username,
      email: dto.email,
      password: dto.password,
      first_name: dto.first_name, // Mapping here
      last_name: dto.last_name, // Mapping here
      user_category: dto.user_category, // Mapping here
    });

    // 4. Save (ID and Hash are handled by @BeforeInsert in Entity)
    await this.userRepository.save(newUser);

    return { message: 'Signup successful' };
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

    // Always return success even if email not found (security best practice)
    if (!user) return;

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expiresAt;
    await this.userRepository.save(user);

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await this.mailService.sendPasswordReset(user.email, user.first_name || user.username, resetUrl);
  }

  // ─── VERIFY RESET TOKEN ───────────────────────────────────────────────────
  async verifyResetToken(token: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { resetPasswordToken: token },
    });

    if (!user || !user.resetPasswordExpires) return false;
    if (user.resetPasswordExpires < new Date()) return false;

    return true;
  }

  // ─── RESET PASSWORD ───────────────────────────────────────────────────────
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { resetPasswordToken: token },
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
