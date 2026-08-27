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
exports.ExpertController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const expert_service_1 = require("./expert.service");
const create_expert_dto_1 = require("./dto/create-expert.dto");
const update_expert_dto_1 = require("./dto/update-expert.dto");
const admin_guard_1 = require("../auth/admin.guard");
const multer_1 = require("multer");
const jwt_auth_guard_1 = require("../auth/jwt-auth/jwt-auth.guard");
const memory = (0, multer_1.memoryStorage)();
let ExpertController = class ExpertController {
    expertService;
    constructor(expertService) {
        this.expertService = expertService;
    }
    async findAll() {
        return await this.expertService.findAll();
    }
    async findOne(id) {
        return await this.expertService.findById(id);
    }
    async create(createExpertDto) {
        return await this.expertService.create(createExpertDto);
    }
    async update(id, updateExpertDto) {
        return await this.expertService.update(id, updateExpertDto);
    }
    async remove(id) {
        return await this.expertService.remove(id);
    }
    async verify(id) {
        return await this.expertService.verify(id);
    }
    async unverify(id) {
        return await this.expertService.unverify(id);
    }
    async uploadStandaloneImage(file) {
        if (!file) {
            throw new Error('No file uploaded');
        }
        return await this.expertService.uploadImage(file);
    }
    async uploadProfileImage(id, file) {
        if (!file) {
            throw new Error('No file uploaded');
        }
        return await this.expertService.uploadProfileImage(id, file);
    }
};
exports.ExpertController = ExpertController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExpertController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExpertController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_expert_dto_1.CreateExpertDto]),
    __metadata("design:returntype", Promise)
], ExpertController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_expert_dto_1.UpdateExpertDto]),
    __metadata("design:returntype", Promise)
], ExpertController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExpertController.prototype, "remove", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Patch)(':id/verify'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExpertController.prototype, "verify", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Patch)(':id/unverify'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExpertController.prototype, "unverify", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Post)('upload-profile-image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage: memory })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExpertController.prototype, "uploadStandaloneImage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Post)(':id/upload-profile-image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage: memory })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ExpertController.prototype, "uploadProfileImage", null);
exports.ExpertController = ExpertController = __decorate([
    (0, common_1.Controller)('experts'),
    __metadata("design:paramtypes", [expert_service_1.ExpertService])
], ExpertController);
//# sourceMappingURL=expert.controller.js.map