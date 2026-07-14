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
const r2_storage_1 = require("../storage/r2.storage");
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
    getImageUrl(profile_image) {
        if (!profile_image)
            return '';
        if (profile_image.startsWith('http'))
            return profile_image;
        const baseUrl = process.env.NODE_ENV === 'production'
            ? 'https://api.riri.rw'
            : 'http://localhost:8000';
        return `${baseUrl}/${profile_image.replace(/^\/+/, '')}`;
    }
    async createPublication(userId, data, file) {
        if (!data.title || data.title.trim() === '') {
            throw new common_1.BadRequestException('Title is required');
        }
        const pubData = { ...data, user: { id: userId } };
        if (file) {
            pubData.pdf_path = await (0, r2_storage_1.uploadFileToR2)(file, 'publications');
        }
        const pub = this.pubRepo.create(pubData);
        return this.pubRepo.save(pub);
    }
    async updateProfile(userId, body, file) {
        const updateData = {};
        if (body.bio !== undefined)
            updateData.bio = body.bio;
        if (body.orcid !== undefined)
            updateData.orcid = body.orcid;
        if (body.platformId !== undefined)
            updateData.orcid = body.platformId;
        if (body.qualification !== undefined)
            updateData.qualification = body.qualification;
        if (body.Graduation_university !== undefined)
            updateData.Graduation_university = body.Graduation_university;
        if (body.Field !== undefined)
            updateData.Field = body.Field;
        if (body.Position !== undefined)
            updateData.Position = body.Position;
        if (body.institution !== undefined)
            updateData.institution = body.institution;
        if (body.location !== undefined)
            updateData.location = body.location;
        if (body.ResearchArea !== undefined)
            updateData.ResearchArea = body.ResearchArea;
        if (file) {
            updateData.profile_image = await (0, r2_storage_1.uploadFileToR2)(file, 'profiles');
        }
        else if (body.remove_profile_image === 'true') {
            updateData.profile_image = null;
        }
        if (!userId)
            throw new common_1.BadRequestException('User ID is missing');
        if (Object.keys(updateData).length === 0)
            return this.getProfile(userId);
        await this.userRepo.update(userId, updateData);
        return this.getProfile(userId);
    }
    async findAllApproved() {
        return this.pubRepo.find({
            where: { status: true },
            relations: ['user'],
            order: { created_at: 'DESC' },
        });
    }
    async getAllResearchers(search) {
        try {
            const query = this.userRepo
                .createQueryBuilder('user')
                .where('user.user_category = :category AND user.is_active = true AND user.isExpert = false', { category: 'researcher' })
                .select([
                'user.id', 'user.first_name', 'user.last_name', 'user.email',
                'user.phone_number', 'user.qualification', 'user.Position', 'user.location', 'institution',
                'user.Field', 'user.ResearchArea', 'user.bio', 'user.profile_image', 'user.orcid', 'user.graduation_university'
            ]);
            if (search) {
                query.andWhere('(user.first_name LIKE :search OR user.last_name LIKE :search OR user.Position LIKE :search)', { search: `%${search}%` });
            }
            const users = await query.getMany();
            return users.map((user) => ({
                id: user.id,
                name: `${user.first_name} ${user.last_name}`.trim(),
                qualification: user.qualification || 'Not Specified',
                Field: user.Field || 'Not Specified',
                email: user.email,
                contact: user.phone_number || 'N/A',
                ResearchArea: user.ResearchArea || 'not specified',
                Position: user.Position || user.bio?.slice(0, 150) || 'Not Specified',
                image: this.getImageUrl(user.profile_image),
                location: user.location || 'Not Specified',
                institution: user.institution || 'Not specified',
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
                    'id', 'first_name', 'last_name', 'email', 'phone_number',
                    'qualification', 'Field', 'Position', 'ResearchArea', 'bio',
                    'profile_image', 'orcid', 'university_name', 'graduation_university', 'location', 'institution',
                ],
            });
            if (!user)
                throw new common_1.NotFoundException('Researcher not found');
            const publications = await this.pubRepo.find({
                where: { user: { id }, status: true },
                order: { created_at: 'DESC' },
                take: 10,
            });
            return {
                id: user.id,
                name: `${user.first_name} ${user.last_name}`.trim(),
                qualification: user.qualification || 'Not Specified',
                Field: user.Field || 'Not Specified',
                email: user.email,
                contact: user.phone_number || 'N/A',
                Position: user.Position || 'Not Specified',
                institution: user.institution || 'Not specified',
                ResearchArea: user.ResearchArea || 'not specified',
                bio: user.bio || '',
                image: this.getImageUrl(user.profile_image),
                orcid: user.orcid,
                university: user.university_name,
                graduation_university: user.graduation_university,
                location: user.location || 'Not Specified',
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
            .where('user.user_category = :category AND user.is_active = true AND user.isExpert = true', { category: 'researcher' })
            .select([
            'user.id', 'user.first_name', 'user.last_name', 'user.email',
            'user.phone_number', 'user.qualification', 'user.ResearchArea',
            'user.Position', 'user.Field', 'user.bio', 'user.profile_image', 'user.orcid',
            'user.graduation_university', 'user.location', 'user.institution',
        ]);
        if (search) {
            query.andWhere('(user.first_name LIKE :search OR user.last_name LIKE :search OR user.Position LIKE :search)', { search: `%${search}%` });
        }
        const users = await query.getMany();
        return users.map((user) => ({
            id: user.id,
            name: `${user.first_name} ${user.last_name}`.trim(),
            qualification: user.qualification || 'Not Specified',
            Field: user.Field || 'Not Specified',
            ResearchArea: user.ResearchArea || 'not specified',
            email: user.email,
            contact: user.phone_number || 'N/A',
            Position: user.Position || user.bio?.slice(0, 150) || 'Not Specified',
            location: user.location || 'Not Specified',
            institution: user.institution || 'not specified',
            image: this.getImageUrl(user.profile_image),
        }));
    }
    async updatePublication(userId, pubId, data, file) {
        const pub = await this.pubRepo.findOne({
            where: { id: pubId },
            relations: ['user'],
        });
        if (!pub)
            throw new common_1.NotFoundException('Publication not found');
        if (pub.user?.id !== userId) {
            throw new common_1.UnauthorizedException('You are not allowed to edit this publication');
        }
        const { id, userId: _uid, user, created_at, status, assignedToExpertId, assignedToExpert, pdf_path, ...updatable } = data;
        Object.assign(pub, updatable);
        const shouldRemovePdf = data.remove_pdf === 'true' || data.remove_pdf === true;
        if (file) {
            pub.pdf_path = await (0, r2_storage_1.uploadFileToR2)(file, 'publications');
        }
        else if (shouldRemovePdf) {
            pub.pdf_path = undefined;
        }
        return this.pubRepo.save(pub);
    }
    async deletePublication(userId, pubId) {
        const pub = await this.pubRepo.findOne({
            where: { id: pubId },
            relations: ['user'],
        });
        if (!pub)
            throw new common_1.NotFoundException('Publication not found');
        if (pub.user?.id !== userId) {
            throw new common_1.UnauthorizedException('You are not allowed to delete this publication');
        }
        await this.pubRepo.remove(pub);
        return { success: true, id: pubId };
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