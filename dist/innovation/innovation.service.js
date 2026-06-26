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
exports.InnovationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const innovation_entity_1 = require("./entities/innovation.entity");
const user_entity_1 = require("../users/entities/user.entity");
let InnovationService = class InnovationService {
    innovationRepo;
    userRepo;
    constructor(innovationRepo, userRepo) {
        this.innovationRepo = innovationRepo;
        this.userRepo = userRepo;
    }
    async create(userId, data, photoPath) {
        const innovation = this.innovationRepo.create({
            ...data,
            userId,
            photo: photoPath,
        });
        return this.innovationRepo.save(innovation);
    }
    async findMyInnovations(userId) {
        return this.innovationRepo.find({
            where: { userId },
            order: { created_at: 'DESC' },
        });
    }
    async findAllPublic(searchTerm, sponsorship) {
        const query = this.innovationRepo
            .createQueryBuilder('innovation')
            .leftJoinAndSelect('innovation.user', 'user')
            .where('innovation.status = :status', { status: true });
        if (searchTerm) {
            query.andWhere('(innovation.name LIKE :term OR innovation.description LIKE :term)', { term: `%${searchTerm}%` });
        }
        if (sponsorship) {
            query.andWhere('innovation.sponsorship_needed = :sponsorship', {
                sponsorship,
            });
        }
        return await query.orderBy('innovation.created_at', 'DESC').getMany();
    }
    async getPublicCounts() {
        const total = await this.innovationRepo.count({ where: { status: true } });
        const sponsored = await this.innovationRepo.count({
            where: { status: true, sponsorship_needed: 'sponsored' },
        });
        const unsponsored = await this.innovationRepo.count({
            where: { status: true, sponsorship_needed: 'unsponsored' },
        });
        const no_need = await this.innovationRepo.count({
            where: { status: true, sponsorship_needed: 'no-need' },
        });
        return { total, sponsored, unsponsored, no_need };
    }
    async findOne(id) {
        const innovation = await this.innovationRepo.findOne({
            where: { id, status: true },
            relations: ['user'],
        });
        if (!innovation) {
            return null;
        }
        return innovation;
    }
    async updateInnovation(userId, innovationId, updateData, photoPath) {
        const innovation = await this.innovationRepo.findOne({
            where: { id: innovationId, userId },
        });
        if (!innovation) {
            throw new common_1.NotFoundException('Innovation not found or unauthorized');
        }
        const allowedFields = ['name', 'description', 'sponsorship_needed'];
        const dataToUpdate = {};
        allowedFields.forEach(field => {
            if (updateData[field] !== undefined && updateData[field] !== null) {
                dataToUpdate[field] = updateData[field];
            }
        });
        if (photoPath) {
            dataToUpdate.photo = photoPath;
        }
        await this.innovationRepo.update(innovationId, dataToUpdate);
        return this.innovationRepo.findOneBy({ id: innovationId });
    }
    async deleteInnovation(userId, innovationId) {
        const innovation = await this.innovationRepo.findOne({
            where: { id: innovationId, userId },
        });
        if (!innovation) {
            throw new common_1.NotFoundException('Innovation not found or unauthorized');
        }
        await this.innovationRepo.delete(innovationId);
        return { success: true, message: 'Innovation deleted successfully' };
    }
};
exports.InnovationService = InnovationService;
exports.InnovationService = InnovationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(innovation_entity_1.Innovation)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], InnovationService);
//# sourceMappingURL=innovation.service.js.map