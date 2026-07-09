"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniversityController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const university_service_1 = require("./university.service");
const multer_1 = require("multer");
const jwt_auth_guard_1 = require("../auth/jwt-auth/jwt-auth.guard");
const r2_storage_1 = require("../storage/r2.storage");
const memory = (0, multer_1.memoryStorage)();
let UniversityController = class UniversityController {
    universityService;
    constructor(universityService) {
        this.universityService = universityService;
    }
    async getMe(req) {
        const userId = req.user.userId;
        const user = await this.universityService.getUserById(userId);
        if (!user)
            throw new common_1.UnauthorizedException();
        return user;
    }
    async updateProfile(req, body, file) {
        const userId = req.user.userId;
        const updateData = { ...body };
        if (!userId) {
            throw new common_1.UnauthorizedException('User ID not found in request. Check JwtStrategy.');
        }
        if (body.university) {
            updateData.university_name = body.university;
            delete updateData.university;
        }
        if (file) {
            updateData.profile_image = await (0, r2_storage_1.uploadFileToR2)(file, 'profiles');
        }
        return this.universityService.updateProfile(userId, updateData);
    }
    async uploadResearch(req, body, file) {
        const fileUrl = await (0, r2_storage_1.uploadFileToR2)(file, 'research');
        return this.universityService.createUpload(req.user.userId, body, fileUrl);
    }
    async getMyUploads(req) {
        return this.universityService.getMyUploads(req.user.userId);
    }
    async getBook(id) {
        const book = await this.universityService.getUploadById(id);
        if (!book)
            throw new common_1.NotFoundException('Book not found');
        return {
            ...book,
            file_url: book.file_path.startsWith('http')
                ? book.file_path
                : (() => {
                    const baseUrl = process.env.NODE_ENV === 'production'
                        ? 'https://api.riri.rw'
                        : 'http://localhost:8000';
                    return `${baseUrl}/${book.file_path.replace(/^\/+/, '')}`;
                })(),
            status_display: book.status.toUpperCase(),
        };
    }
    async getPublicList(search, degreeType, fieldKeywords) {
        return this.universityService.findApproved(search, degreeType, fieldKeywords);
    }
    async getPublicCounts(degreeType) {
        return this.universityService.getCounts(degreeType);
    }
    async getPublicDetail(id) {
        const book = await this.universityService.getPublicBookDetail(id);
        if (!book)
            throw new common_1.NotFoundException('Article not found');
        return book;
    }
    async getPublicLists(userId) {
        return this.universityService.findApprovedPublic(userId);
    }
    async likeBook(id) {
        return this.universityService.updateLikes(id, 'increment');
    }
    async unlikeBook(id) {
        return this.universityService.updateLikes(id, 'decrement');
    }
    async rateBook(id, rating) {
        return this.universityService.addRating(id, rating);
    }
    async updateUpload(req, id, body, file) {
        const filePath = file ? await (0, r2_storage_1.uploadFileToR2)(file, 'research') : undefined;
        return this.universityService.updateUpload(req.user.userId, id, body, filePath);
    }
};
exports.UniversityController = UniversityController;
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "getMe", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('update'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profile_image', { storage: memory })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage: memory, limits: {
            fileSize: 100 * 1024 * 1024,
        } })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "uploadResearch", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my-uploads'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "getMyUploads", null);
__decorate([
    (0, common_1.Get)('book/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "getBook", null);
__decorate([
    (0, common_1.Get)('innovations/public-list'),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('degree_type')),
    __param(2, (0, common_1.Query)('field_keywords')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "getPublicList", null);
__decorate([
    (0, common_1.Get)('innovations/public-counts'),
    __param(0, (0, common_1.Query)('degree_type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "getPublicCounts", null);
__decorate([
    (0, common_1.Get)('university/public-detail/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "getPublicDetail", null);
__decorate([
    (0, common_1.Get)('university/public-list'),
    __param(0, (0, common_1.Query)('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "getPublicLists", null);
__decorate([
    (0, common_1.Post)('university/:id/like'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "likeBook", null);
__decorate([
    (0, common_1.Post)('university/:id/unlike'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "unlikeBook", null);
__decorate([
    (0, common_1.Post)('university/rate/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('rating')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "rateBook", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('upload/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage: memory, limits: {
            fileSize: 100 * 1024 * 1024,
        } })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "updateUpload", null);
exports.UniversityController = UniversityController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [university_service_1.UniversityService])
], UniversityController);
//# sourceMappingURL=university.controller.js.map