import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
export declare class AuthService {
    private userRepository;
    private jwtService;
    private readonly mailService;
    constructor(userRepository: Repository<User>, jwtService: JwtService, mailService: MailService);
    signup(dto: SignupDto): Promise<{
        message: string;
    }>;
    verifyEmail(token: string): Promise<void>;
    resendVerification(email: string): Promise<void>;
    register(dto: RegisterDto): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        redirect: string;
    }>;
    onModuleInit(): Promise<void>;
    seedAdmin(): Promise<void>;
    forgotPassword(email: string): Promise<void>;
    verifyResetToken(token: string): Promise<boolean>;
    resetPassword(token: string, newPassword: string): Promise<void>;
}
