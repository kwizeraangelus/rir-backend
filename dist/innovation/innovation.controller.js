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
exports.InnovationController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const innovation_service_1 = require("./innovation.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth/jwt-auth.guard");
const r2_storage_1 = require("../storage/r2.storage");
const memory = (0, multer_1.memoryStorage)();
let InnovationController = class InnovationController {
    innovationService;
    constructor(innovationService) {
        this.innovationService = innovationService;
    }
    async getMyInnovations(req) {
        return this.innovationService.findMyInnovations(req.user.userId);
    }
    async createInnovation(req, body, file) {
        const photoPath = file ? await (0, r2_storage_1.uploadFileToR2)(file, 'innovations') : null;
        return this.innovationService.create(req.user.userId, body, photoPath);
    }
    async updateInnovation(req, id, body, file) {
        const photoPath = file ? await (0, r2_storage_1.uploadFileToR2)(file, 'innovations') : undefined;
        return this.innovationService.updateInnovation(req.user.userId, id, body, photoPath);
    }
    async deleteInnovation(req, id) {
        return this.innovationService.deleteInnovation(req.user.userId, id);
    }
    async getPublicList(search, sponsorship) {
        return this.innovationService.findAllPublic(search, sponsorship);
    }
    async getCounts() {
        return this.innovationService.getPublicCounts();
    }
    async getOne(id) {
        const innovation = await this.innovationService.findOne(id);
        if (!innovation)
            throw new common_1.NotFoundException('Innovation not found or not approved');
        return innovation;
    }
};
exports.InnovationController = InnovationController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my-innovations'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InnovationController.prototype, "getMyInnovations", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('innovations/create'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', { storage: memory })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], InnovationController.prototype, "createInnovation", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('innovations/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', { storage: (0, multer_1.memoryStorage)() })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], InnovationController.prototype, "updateInnovation", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('innovations/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InnovationController.prototype, "deleteInnovation", null);
__decorate([
    (0, common_1.Get)('innovations/public-lists'),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('sponsorship_needed')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InnovationController.prototype, "getPublicList", null);
__decorate([
    (0, common_1.Get)('innovations/public-countss'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InnovationController.prototype, "getCounts", null);
__decorate([
    (0, common_1.Get)('innovation/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InnovationController.prototype, "getOne", null);
exports.InnovationController = InnovationController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [innovation_service_1.InnovationService])
], InnovationController);
//# sourceMappingURL=innovation.controller.js.map