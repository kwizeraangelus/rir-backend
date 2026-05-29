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
        if (body.bio !== undefined)
            updateData.bio = body.bio;
        if (body.platformId !== undefined)
            updateData.orcid = body.platformId;
        if (body.qualification !== undefined)
            updateData.qualification = body.qualification;
        if (body.specialization !== undefined)
            updateData.specialization = body.specialization;
        if (file) {
            updateData.profile_image = `/uploads/profiles/${file.filename}`;
            console.log('✅ Image saved:', updateData.profile_image);
        }
        if (!userId) {
            throw new common_1.BadRequestException('User ID is missing');
        }
        console.log('Update Data:', updateData);
        if (Object.keys(updateData).length === 0) {
            return this.getProfile(userId);
        }
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
    async getAllResearchers(search) {
        try {
            const query = this.userRepo
                .createQueryBuilder('user')
                .where('user.user_category = :category AND user.is_active = true AND user.isExpert = false', {
                category: 'researcher',
            })
                .select([
                'user.id',
                'user.first_name',
                'user.last_name',
                'user.email',
                'user.phone_number',
                'user.qualification',
                'user.specialization',
                'user.bio',
                'user.profile_image',
                'user.orcid',
            ]);
            if (search) {
                query.andWhere('(user.first_name LIKE :search OR user.last_name LIKE :search OR user.specialization LIKE :search)', { search: `%${search}%` });
            }
            const users = await query.getMany();
            return users.map((user) => ({
                id: user.id,
                name: `${user.first_name} ${user.last_name}`.trim(),
                qualification: user.qualification || 'Not Specified',
                email: user.email,
                contact: user.phone_number || 'N/A',
                specialization: user.specialization || user.bio?.slice(0, 150) || 'Not Specified',
                image: user.profile_image
                    ? `http://localhost:8000${user.profile_image.startsWith('/') ? '' : '/'}${user.profile_image}`
                    : 'https://via.placeholder.com/120x150/003087/ffffff?text=Researcher',
            }));
        }
        catch (error) {
            console.error('Error in getAllResearchers:', error);
            throw error;
        }
    }
    async getResearcherDetail(id) {
        try {
            const user = await this.userRepo.findOne({
                where: { id, user_category: 'researcher', is_active: true },
                select: [
                    'id',
                    'first_name',
                    'last_name',
                    'email',
                    'phone_number',
                    'qualification',
                    'specialization',
                    'bio',
                    'profile_image',
                    'orcid',
                    'university_name',
                ],
            });
            if (!user) {
                throw new common_1.NotFoundException('Researcher not found');
            }
            const publications = await this.pubRepo.find({
                where: { user: { id }, status: true },
                order: { created_at: 'DESC' },
                take: 10,
            });
            return {
                id: user.id,
                name: `${user.first_name} ${user.last_name}`.trim(),
                qualification: user.qualification || 'Not Specified',
                email: user.email,
                contact: user.phone_number || 'N/A',
                specialization: user.specialization || 'Not Specified',
                bio: user.bio || '',
                image: user.profile_image
                    ? `/uploads/profiles/${user.profile_image.split('/').pop()}`
                    : 'https://via.placeholder.com/300x400/003087/ffffff?text=Researcher',
                orcid: user.orcid,
                university: user.university_name,
                publications: publications || [],
            };
        }
        catch (error) {
            console.error('Error in getResearcherDetail:', error);
            throw error;
        }
    }
    async getAllExperts(search) {
        const query = this.userRepo
            .createQueryBuilder('user')
            .where('user.user_category = :category AND user.is_active = true AND user.isExpert = true', {
            category: 'researcher',
        })
            .select([
            'user.id',
            'user.first_name',
            'user.last_name',
            'user.email',
            'user.phone_number',
            'user.qualification', 'user.specialization',
            'user.bio',
            'user.profile_image',
            'user.orcid'
        ]);
        if (search) {
            query.andWhere('(user.first_name LIKE :search OR user.last_name LIKE :search OR user.specialization LIKE :search)', { search: `%${search}%` });
        }
        const users = await query.getMany();
        return users.map(user => ({
            id: user.id,
            name: `${user.first_name} ${user.last_name}`.trim(),
            qualification: user.qualification || 'Not Specified',
            email: user.email,
            contact: user.phone_number || 'N/A',
            specialization: user.specialization || user.bio?.slice(0, 150) || 'Not Specified',
            image: user.profile_image
                ? `http://localhost:8000${user.profile_image.startsWith('/') ? '' : '/'}${user.profile_image}`
                : 'https://via.placeholder.com/120x150/003087/ffffff?text=Expert',
        }));
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