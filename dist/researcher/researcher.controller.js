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
exports.ResearcherController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth/jwt-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
const researcher_service_1 = require("./researcher.service");
const multer_1 = require("multer");
const path_1 = require("path");
let ResearcherController = class ResearcherController {
    researcherService;
    constructor(researcherService) {
        this.researcherService = researcherService;
    }
    getMe(req) {
        return this.researcherService.getProfile(req.user.userId);
    }
    getMyResearches(req) {
        return this.researcherService.getPublications(req.user.userId);
    }
    async addPublication(req, body) {
        const userId = req.user?.userId;
        if (!userId) {
            console.error('User context missing from request:', req.user);
            throw new common_1.UnauthorizedException('User ID not found in token payload');
        }
        return this.researcherService.createPublication(userId, body);
    }
    async updateProfile(req, body, file) {
        const userId = req.user.userId;
        return this.researcherService.updateProfile(userId, body, file);
    }
    async getPublicPublications() {
        return this.researcherService.findAllApproved();
    }
    async getAllResearchers(search) {
        return this.researcherService.getAllResearchers(search);
    }
    async getResearcherDetail(id) {
        return this.researcherService.getResearcherDetail(id);
    }
    async getAllExperts(search) {
        return this.researcherService.getAllExperts(search);
    }
    async updatePublication(req, id, body, file) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new common_1.UnauthorizedException('User ID not found in token payload');
        }
        return this.researcherService.updatePublication(userId, id, body, file);
    }
    async deletePublication(req, id) {
        const userId = req.user?.userId;
        if (!userId)
            throw new common_1.UnauthorizedException('User ID not found in token payload');
        return this.researcherService.deletePublication(userId, id);
    }
    s;
};
exports.ResearcherController = ResearcherController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ResearcherController.prototype, "getMe", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my-researches'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ResearcherController.prototype, "getMyResearches", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('researches'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ResearcherController.prototype, "addPublication", null);
__decorate([
    (0, common_1.Patch)('update-profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profile_image', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/profiles',
            filename: (req, file, cb) => cb(null, `${Date.now()}${(0, path_1.extname)(file.originalname)}`),
        }),
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ResearcherController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)('publications/public'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ResearcherController.prototype, "getPublicPublications", null);
__decorate([
    (0, common_1.Get)('researchers'),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResearcherController.prototype, "getAllResearchers", null);
__decorate([
    (0, common_1.Get)('researchers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResearcherController.prototype, "getResearcherDetail", null);
__decorate([
    (0, common_1.Get)('experts'),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResearcherController.prototype, "getAllExperts", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('researches/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('pdf', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/publications',
            filename: (req, file, cb) => cb(null, `${Date.now()}${(0, path_1.extname)(file.originalname)}`),
        }),
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], ResearcherController.prototype, "updatePublication", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('researches/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ResearcherController.prototype, "deletePublication", null);
exports.ResearcherController = ResearcherController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [researcher_service_1.ResearcherService])
], ResearcherController);
//# sourceMappingURL=researcher.controller.js.map