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
exports.AdminController = void 0;
const jwt_auth_guard_1 = require("../auth/jwt-auth/jwt-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
const admin_guard_1 = require("../auth/admin.guard");
const multer_1 = require("multer");
const r2_storage_1 = require("../storage/r2.storage");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const expert_service_1 = require("../expert/expert.service");
const create_expert_dto_1 = require("../expert/dto/create-expert.dto");
const update_expert_dto_1 = require("../expert/dto/update-expert.dto");
const memory = (0, multer_1.memoryStorage)();
let AdminController = class AdminController {
    adminService;
    expertService;
    constructor(adminService, expertService) {
        this.adminService = adminService;
        this.expertService = expertService;
    }
    async getDashboard() {
        return this.adminService.getDashboardData();
    }
    async updateUploadStatus(id, body) {
        return this.adminService.processUpload(id, body.action, body.feedback);
    }
    async getAllUsers() {
        return this.adminService.getUsers();
    }
    async updateUser(id, body) {
        return this.adminService.updateUser(id, body);
    }
    async deleteUser(id) {
        return this.adminService.deleteUser(id);
    }
    async getApproved(filters) {
        return this.adminService.getApprovedBooks(filters);
    }
    async createUser(body) {
        return this.adminService.createUser(body);
    }
    async createAdminEvent(req, body, file) {
        const photoPath = file ? await (0, r2_storage_1.uploadFileToR2)(file, 'events') : null;
        return this.adminService.createEvent(req.user.userId, body, photoPath);
    }
    async getAllEvents() {
        return this.adminService.getAllEvents();
    }
    async deleteEvent(id) {
        return this.adminService.deleteEvent(id);
    }
    async updateAdminEvent(id, body, file) {
        const photoPath = file ? await (0, r2_storage_1.uploadFileToR2)(file, 'events') : undefined;
        return this.adminService.updateEvent(id, body, photoPath);
    }
    async deleteBook(id) {
        return this.adminService.deleteBook(id);
    }
    async getPending() {
        return this.adminService.findPending();
    }
    async approve(id) {
        return this.adminService.updateStatus(id, true);
    }
    async reject(id, feedback) {
        return this.adminService.rejectEvent(id, feedback);
    }
    async delete(id) {
        return this.adminService.remove(id);
    }
    async getPendingPubs() {
        return this.adminService.getPendingPublications();
    }
    async approvePub(id) {
        return this.adminService.approvePublication(id);
    }
    async rejectPub(id, feedback) {
        return this.adminService.rejectPublication(id, feedback);
    }
    async deletePub(id) {
        return this.adminService.deletePublication(id);
    }
    async getPendingInnovations() {
        return this.adminService.getPendingInnovations();
    }
    async approveInnovation(id) {
        return this.adminService.approveInnovation(id);
    }
    async rejectInnovation(id, feedback) {
        return this.adminService.rejectInnovation(id, feedback);
    }
    async deleteInnovation(id) {
        return this.adminService.deleteInnovation(id);
    }
    async createResearch(req, body) {
        const adminId = req.user.userId;
        return this.adminService.createResearch(adminId, body);
    }
    findAll() {
        return this.expertService.findAll();
    }
    async findOne(id) {
        return await this.expertService.findById(id);
    }
    async create(dto, req) {
        console.log(`[Admin] ${req.user.username} created: ${dto.name}`);
        return await this.expertService.create(dto);
    }
    async update(id, dto, req) {
        console.log(`[Admin] ${req.user.username} updated: ${id}`);
        return await this.expertService.update(id, dto);
    }
    async remove(id, req) {
        console.log(`[Admin] ${req.user.username} deleted: ${id}`);
        await this.expertService.remove(id);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Post)('upload/:id/update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUploadStatus", null);
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Put)('users/:id/update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)('users/:id/delete'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)('approved-books'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getApproved", null);
__decorate([
    (0, common_1.Post)('users/create'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createUser", null);
__decorate([
    (0, common_1.Post)('events/create'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', { storage: memory })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createAdminEvent", null);
__decorate([
    (0, common_1.Get)('events'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllEvents", null);
__decorate([
    (0, common_1.Delete)('events/:id/delete'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteEvent", null);
__decorate([
    (0, common_1.Put)('events/:id/update'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', { storage: memory })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateAdminEvent", null);
__decorate([
    (0, common_1.Delete)('books/:id/delete'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteBook", null);
__decorate([
    (0, common_1.Get)('events/pending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getPending", null);
__decorate([
    (0, common_1.Post)('events/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)('events/:id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('feedback')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "reject", null);
__decorate([
    (0, common_1.Delete)('events/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)('publications/pending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getPendingPubs", null);
__decorate([
    (0, common_1.Post)('publications/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approvePub", null);
__decorate([
    (0, common_1.Post)('publications/:id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('feedback')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "rejectPub", null);
__decorate([
    (0, common_1.Delete)('publications/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deletePub", null);
__decorate([
    (0, common_1.Get)('innovations/pending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getPendingInnovations", null);
__decorate([
    (0, common_1.Post)('innovations/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approveInnovation", null);
__decorate([
    (0, common_1.Post)('innovations/:id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('feedback')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "rejectInnovation", null);
__decorate([
    (0, common_1.Delete)('innovations/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteInnovation", null);
__decorate([
    (0, common_1.Post)('create-research'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createResearch", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] List all experts' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Get expert by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Create expert' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_expert_dto_1.CreateExpertDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Update expert (partial)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_expert_dto_1.UpdateExpertDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(204),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Delete expert' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "remove", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('api/admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        expert_service_1.ExpertService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map