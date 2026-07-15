"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const mail_service_1 = require("../mail/mail.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const uuid_1 = require("uuid");
let AuthService = class AuthService {
    userRepository;
    jwtService;
    mailService;
    constructor(userRepository, jwtService, mailService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async signup(dto) {
        if (dto.password !== dto.confirmPassword) {
            throw new common_1.BadRequestException('Passwords do not match');
        }
        const existing = await this.userRepository.findOne({
            where: [{ email: dto.email }, { username: dto.username }],
        });
        if (existing) {
            throw new common_1.ConflictException('Email or Username already in use');
        }
        const newUser = this.userRepository.create({
            username: dto.username,
            email: dto.email,
            password: dto.password,
            first_name: dto.first_name,
            last_name: dto.last_name,
            user_category: dto.user_category,
        });
        await this.userRepository.save(newUser);
        return { message: 'Signup successful' };
    }
    async register(dto) {
        if (dto.password !== dto.password_confirmation) {
            throw new common_1.BadRequestException('Passwords do not match');
        }
        const existing = await this.userRepository.findOne({
            where: [{ email: dto.email }, { username: dto.username }],
        });
        if (existing) {
            throw new common_1.ConflictException(existing.email === dto.email
                ? 'Email already in use'
                : 'Username already taken');
        }
        const user = this.userRepository.create(dto);
        await this.userRepository.save(user);
        return { message: 'User registered successfully' };
    }
    async login(loginDto) {
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
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.is_active) {
            throw new common_1.UnauthorizedException('Account is inactive');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        let redirect = '/';
        if (user.user_category === user_entity_1.UserCategory.ADMIN || user.is_staff) {
            redirect = '/admin-dashboard';
        }
        else {
            switch (user.user_category) {
                case user_entity_1.UserCategory.UNIVERSITY:
                    redirect = '/university';
                    break;
                case user_entity_1.UserCategory.RESEARCHER:
                    redirect = '/researcher';
                    break;
                case user_entity_1.UserCategory.CONF_ORGANIZER:
                    redirect = '/organizer';
                    break;
                case user_entity_1.UserCategory.PUBLIC_VISITOR:
                    redirect = '/';
                    break;
                case user_entity_1.UserCategory.INNOVATOR:
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
        const payload = {
            sub: user.id,
            email: user.email,
            category: user.user_category,
            is_staff: user.is_staff,
        };
        const token = this.jwtService.sign(payload);
        return {
            access_token: token,
            redirect: redirect,
        };
    }
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
                user_category: user_entity_1.UserCategory.ADMIN,
                is_staff: true,
                is_active: true,
            });
            await this.userRepository.save(admin);
            console.log(' ✅ NEW ADMIN SEEDED: admin123');
        }
    }
    async forgotPassword(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user)
            return;
        const token = (0, uuid_1.v4)();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
        user.resetPasswordToken = token;
        user.resetPasswordExpires = expiresAt;
        await this.userRepository.save(user);
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        try {
            await this.mailService.sendPasswordReset(user.email, user.first_name || user.username, resetUrl);
        }
        catch (error) {
            console.error('EMAIL ERROR:', error);
        }
    }
    async verifyResetToken(token) {
        const cleanToken = token?.trim();
        const user = await this.userRepository.findOne({
            where: { resetPasswordToken: cleanToken },
        });
        console.log('── verifyResetToken debug ──');
        console.log('token from URL:', cleanToken);
        console.log('user found:', !!user);
        console.log('expiresAt:', user?.resetPasswordExpires, user?.resetPasswordExpires?.toISOString());
        console.log('Node now:', new Date(), new Date().toISOString());
        if (!user || !user.resetPasswordExpires)
            return false;
        if (user.resetPasswordExpires < new Date())
            return false;
        return true;
    }
    async resetPassword(token, newPassword) {
        const cleanToken = token?.trim();
        const user = await this.userRepository.findOne({
            where: { resetPasswordToken: cleanToken },
        });
        if (!user)
            throw new common_1.BadRequestException('Invalid or expired reset token');
        if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
            throw new common_1.BadRequestException('Reset token has expired. Please request a new one.');
        }
        const hashed = await bcrypt.hash(newPassword, 12);
        user.password = hashed;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await this.userRepository.save(user);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map