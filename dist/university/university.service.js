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
exports.UniversityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const university_upload_entity_1 = require("./entities/university-upload.entity");
let UniversityService = class UniversityService {
    userRepo;
    uploadRepo;
    constructor(userRepo, uploadRepo) {
        this.userRepo = userRepo;
        this.uploadRepo = uploadRepo;
    }
    async updateProfile(userId, updateData) {
        await this.userRepo.update(userId, updateData);
        return this.userRepo.findOneBy({ id: userId });
    }
    async createUpload(userId, data, filePath) {
        const user = await this.userRepo.findOneBy({ id: userId });
        const upload = this.uploadRepo.create({
            ...data,
            file_path: filePath,
            user,
        });
        return this.uploadRepo.save(upload);
    }
    async getMyUploads(userId) {
        return this.uploadRepo.find({
            where: { user: { id: userId } },
            order: { created_at: 'DESC' },
        });
    }
    async getUserById(userId) {
        return this.userRepo.findOneBy({ id: userId });
    }
    async getUploadById(id) {
        return this.uploadRepo.findOne({
            where: { id },
            relations: ['user'],
        });
    }
    async findApproved(search, degreeType, fieldKeywords) {
        const query = this.uploadRepo
            .createQueryBuilder('p')
            .where('p.status = :status', { status: 'approved' });
        if (search) {
            query.andWhere(new typeorm_2.Brackets((qb) => {
                qb.where('p.title LIKE :s', { s: `%${search}%` })
                    .orWhere('p.authors LIKE :s', { s: `%${search}%` })
                    .orWhere('p.description LIKE :s', { s: `%${search}%` });
            }));
        }
        if (degreeType && degreeType !== 'all') {
            query.andWhere('p.degree_type = :dt', { dt: degreeType });
        }
        if (fieldKeywords) {
            const keywords = fieldKeywords.split(',');
            query.andWhere(new typeorm_2.Brackets((qb) => {
                keywords.forEach((k, i) => {
                    qb.orWhere(`p.submission_type LIKE :k${i}`, {
                        [`k${i}`]: `%${k}%`,
                    });
                });
            }));
        }
        const results = await query.getMany();
        return results.map((p) => ({
            ...p,
            file_url: `http://localhost:8000${p.file_path}`,
            cover_image: p.cover_image
                ? `http://localhost:8000${p.cover_image}`
                : null,
        }));
    }
    async getCounts(degreeType) {
        const query = this.uploadRepo
            .createQueryBuilder('p')
            .where('p.status = :status', { status: 'approved' });
        if (degreeType && degreeType !== 'all') {
            query.andWhere('p.degree_type = :dt', { dt: degreeType });
        }
        const items = await query.getMany();
        return {
            thesis: items.filter((i) => i.degree_type === 'thesis').length,
            dissertation: items.filter((i) => i.degree_type === 'dissertation')
                .length,
            engineering: items.filter((i) => i.submission_type.includes('engineering')).length,
            medicine_health_sciences: items.filter((i) => i.submission_type.match(/medicine|health|nursing/)).length,
            arts_humanities: items.filter((i) => i.submission_type.match(/law|arts|history/)).length,
            natural_sciences: items.filter((i) => i.submission_type.match(/biology|physics|chemistry/)).length,
            social_sciences: items.filter((i) => i.submission_type.match(/sociology|psychology|social/)).length,
            business_economics: items.filter((i) => i.submission_type.match(/business|economics|finance/)).length,
            computer_science_it: items.filter((i) => i.submission_type.match(/computer|it|software/)).length,
            education: items.filter((i) => i.submission_type.includes('education'))
                .length,
        };
    }
    async getPublicBookDetail(id) {
        const book = await this.uploadRepo.findOne({
            where: { id, status: 'approved' },
            relations: ['user'],
        });
        if (book) {
            await this.uploadRepo.increment({ id }, 'views_count', 1);
        }
        return book;
    }
    async findApprovedPublic(userId) {
        const where = { status: 'approved' };
        if (userId) {
            where.userId = userId;
        }
        return this.uploadRepo.find({
            where,
            relations: ['user'],
            order: { created_at: 'DESC' },
            take: 10,
        });
    }
    async updateLikes(id, action) {
        if (action === 'increment') {
            await this.uploadRepo.increment({ id }, 'likes_count', 1);
        }
        else {
            const book = await this.uploadRepo.findOneBy({ id });
            if (book && (book.likes_count ?? 0) > 0) {
                await this.uploadRepo.decrement({ id }, 'likes_count', 1);
            }
        }
        return { success: true };
    }
    async addRating(id, rating) {
        const book = await this.uploadRepo.findOneBy({ id });
        if (!book)
            throw new common_1.NotFoundException();
        const newSum = book.rating_sum ?? +rating;
        const newCount = book.rating_count ?? +1;
        const newAverage = newSum / newCount;
        await this.uploadRepo.update(id, {
            rating_sum: newSum,
            rating_count: newCount,
            average_rating: parseFloat(newAverage.toFixed(1)),
        });
        return { success: true, average: newAverage };
    }
    async getPublicBookDetails(id) {
        const book = await this.uploadRepo.findOne({
            where: { id, status: 'approved' },
        });
        if (book) {
            return {
                ...book,
                file_url: `http://localhost:8000${book.file_path}`,
            };
        }
        return null;
    }
};
exports.UniversityService = UniversityService;
exports.UniversityService = UniversityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(university_upload_entity_1.UniversityUpload)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UniversityService);
//# sourceMappingURL=university.service.js.map