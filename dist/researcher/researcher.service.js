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
exports.ResearcherService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const publication_entity_1 = require("./entities/publication.entity");
let ResearcherService = class ResearcherService {
    userRepo;
    pubRepo;
    constructor(userRepo, pubRepo) {
        this.userRepo = userRepo;
        this.pubRepo = pubRepo;
    }
    async getProfile(userId) {
        return this.userRepo.findOne({ where: { id: userId } });
    }
    async getPublications(userId) {
        return this.pubRepo.find({
            where: { user: { id: userId } },
            order: { created_at: 'DESC' },
        });
    }
    async createPublication(userId, data) {
        const pub = this.pubRepo.create({ ...data, user: { id: userId } });
        return this.pubRepo.save(pub);
    }
    async updateProfile(userId, body, file) {
        const updateData = {};
        if (body.bio)
            updateData.bio = body.bio;
        if (body.platformId)
            updateData.orcid = body.platformId;
        if (file) {
            updateData.profile_image = `/uploads/profiles/${file.filename}`;
        }
        if (!userId)
            throw new common_1.BadRequestException('User ID is missing');
        await this.userRepo.update(userId, updateData);
        return this.getProfile(userId);
    }
    async findAllApproved() {
        const publications = await this.pubRepo.find({
            where: { status: true },
            relations: ['user'],
            order: { created_at: 'DESC' },
        });
        return publications;
    }
};
exports.ResearcherService = ResearcherService;
exports.ResearcherService = ResearcherService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(publication_entity_1.Publication)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ResearcherService);
//# sourceMappingURL=researcher.service.js.map