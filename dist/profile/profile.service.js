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
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../users/entities/user.entity");
let ProfileService = class ProfileService {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    stripPassword(user) {
        const { password, ...safe } = user;
        return safe;
    }
    guard(requesterId, targetId, isStaff) {
        if (String(requesterId) !== String(targetId) && !isStaff) {
            throw new common_1.ForbiddenException('You can only access your own profile');
        }
    }
    async findOrFail(id) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async getProfile(targetId, requesterId, isStaff) {
        this.guard(requesterId, targetId, isStaff);
        const user = await this.findOrFail(targetId);
        return this.stripPassword(user);
    }
    async updateProfile(targetId, requesterId, isStaff, dto) {
        this.guard(requesterId, targetId, isStaff);
        const user = await this.findOrFail(targetId);
        const fields = [
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
        ];
        for (const key of fields) {
            if (dto[key] !== undefined)
                user[key] = dto[key];
        }
        return this.stripPassword(await this.userRepo.save(user));
    }
    async updatePhoto(targetId, requesterId, isStaff, filePath) {
        this.guard(requesterId, targetId, isStaff);
        const user = await this.findOrFail(targetId);
        user.profile_image = filePath;
        return this.stripPassword(await this.userRepo.save(user));
    }
    async updateCv(targetId, requesterId, isStaff, filePath) {
        this.guard(requesterId, targetId, isStaff);
        const user = await this.findOrFail(targetId);
        user.cv = filePath;
        return this.stripPassword(await this.userRepo.save(user));
    }
    async updateResume(targetId, requesterId, isStaff, filePath) {
        this.guard(requesterId, targetId, isStaff);
        const user = await this.findOrFail(targetId);
        user.resume = filePath;
        return this.stripPassword(await this.userRepo.save(user));
    }
    async changePassword(targetId, requesterId, isStaff, dto) {
        this.guard(requesterId, targetId, isStaff);
        const user = await this.findOrFail(targetId);
        const valid = await bcrypt.compare(dto.current_password, user.password);
        if (!valid)
            throw new common_1.UnauthorizedException('Current password is incorrect');
        user.password = await bcrypt.hash(dto.new_password, 10);
        await this.userRepo.save(user);
        return { message: 'Password changed successfully' };
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProfileService);
//# sourceMappingURL=profile.service.js.map