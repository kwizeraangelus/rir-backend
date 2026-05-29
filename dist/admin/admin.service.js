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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const university_upload_entity_1 = require("../university/entities/university-upload.entity");
const event_entity_1 = require("../event/entities/event.entity");
const publication_entity_1 = require("../researcher/entities/publication.entity");
const innovation_entity_1 = require("../innovation/entities/innovation.entity");
let AdminService = class AdminService {
    userRepo;
    uploadRepo;
    eventRepo;
    pubRepo;
    innovationRepo;
    constructor(userRepo, uploadRepo, eventRepo, pubRepo, innovationRepo) {
        this.userRepo = userRepo;
        this.uploadRepo = uploadRepo;
        this.eventRepo = eventRepo;
        this.pubRepo = pubRepo;
        this.innovationRepo = innovationRepo;
    }
    async getDashboardData() {
        const [pendingList, userCount, approvedBookCount, eventCount] = await Promise.all([
            this.uploadRepo.find({
                where: { status: 'pending' },
                relations: ['user'],
                select: {
                    id: true,
                    title: true,
                    file_path: true,
                    cover_image: true,
                    submission_type: true,
                    authors: true,
                    status: true,
                    user: {
                        id: true,
                        first_name: true,
                    },
                },
            }),
            this.userRepo.count(),
            this.uploadRepo.count({
                where: { status: 'approved' },
                relations: ['user'],
            }),
            this.eventRepo.count(),
        ]);
        return {
            kpis: {
                total_users: userCount,
                total_books: approvedBookCount,
                total_events: eventCount,
                pending_count: pendingList.length,
            },
            pending: pendingList.map((item) => ({
                ...item,
                author_name: item.user?.first_name ?? 'Unknown',
            })),
        };
    }
    async processUpload(id, action, feedback) {
        const updateData = {
            status: action === 'approve' ? 'approved' : 'rejected',
            feedback: action === 'reject' ? feedback || 'No feedback provided' : null,
        };
        await this.uploadRepo.update(id, updateData);
        return {
            message: `Upload ${updateData.status} successfully`,
            status: updateData.status,
        };
    }
    async getUsers() {
        return this.userRepo.find();
    }
    async updateUser(id, data) {
        await this.userRepo.update(id, data);
        return { message: 'User updated' };
    }
    async deleteUser(id) {
        await this.uploadRepo.delete({ user: { id: id } });
        await this.eventRepo.delete({ user: { id: id } });
        await this.userRepo.delete(id);
        return { message: 'User and all their data deleted successfully' };
    }
    async getApprovedBooks(filters) {
        const where = { status: 'approved' };
        if (filters.title)
            where.title = (0, typeorm_2.Like)(`%${filters.title}%`);
        if (filters.university)
            where.university = (0, typeorm_2.Like)(`%${filters.university}%`);
        const books = await this.uploadRepo.find({ where });
        return { books };
    }
    async createUser(data) {
        const { email, username, password } = data;
        const existing = await this.userRepo.findOne({
            where: [{ email }, { username }],
        });
        if (existing) {
            throw new common_1.ConflictException('Email or Username already exists');
        }
        const newUser = this.userRepo.create(data);
        await this.userRepo.save(newUser);
        return { message: 'User created successfully by Admin' };
    }
    async createEvent(adminId, data, photoPath) {
        const newEvent = this.eventRepo.create({
            ...data,
            photo: photoPath,
            user: { id: adminId },
        });
        await this.eventRepo.save(newEvent);
        return { message: 'Event created successfully by Admin' };
    }
    async getAllEvents() {
        return this.eventRepo.find({
            relations: ['user'],
            order: { created_at: 'DESC' },
        });
    }
    async deleteEvent(id) {
        const event = await this.eventRepo.findOneBy({ id });
        if (!event) {
            throw new common_1.NotFoundException(`Event with ID ${id} not found`);
        }
        await this.eventRepo.remove(event);
        return { message: 'Event deleted successfully' };
    }
    async updateEvent(id, data, photoPath) {
        const event = await this.eventRepo.findOneBy({ id });
        if (!event)
            throw new common_1.NotFoundException('Event not found');
        const updateData = { ...data };
        if (photoPath) {
            updateData.photo = photoPath;
        }
        await this.eventRepo.update(id, updateData);
        return { message: 'Event updated successfully' };
    }
    async deleteBook(id) {
        const book = await this.uploadRepo.findOneBy({ id });
        if (!book) {
            throw new common_1.NotFoundException(`Book with ID ${id} not found`);
        }
        await this.uploadRepo.remove(book);
        return { message: 'Book deleted successfully' };
    }
    async findPending() {
        return this.eventRepo.find({
            where: { status: false },
            order: { created_at: 'DESC' },
        });
    }
    async updateStatus(id, status) {
        await this.eventRepo.update(id, { status, rejection_feedback: undefined });
        return { message: 'Status updated' };
    }
    async rejectEvent(id, feedback) {
        await this.eventRepo.update(id, {
            rejection_feedback: feedback,
            status: false,
        });
        return { message: 'Event rejected with feedback' };
    }
    async remove(id) {
        return this.eventRepo.delete(id);
    }
    async getPendingPublications() {
        return this.pubRepo.find({
            where: { status: false },
            relations: ['user'],
            order: { created_at: 'DESC' },
        });
    }
    async approvePublication(id) {
        return this.pubRepo.update(id, { status: true });
    }
    async rejectPublication(id, feedback) {
        return this.pubRepo.update(id, { status: false });
    }
    async deletePublication(id) {
        return this.pubRepo.delete(id);
    }
    async getPendingInnovations() {
        return this.innovationRepo.find({
            where: { status: false },
            relations: ['user'],
            order: { created_at: 'DESC' },
        });
    }
    async approveInnovation(id) {
        return this.innovationRepo.update(id, { status: true });
    }
    async rejectInnovation(id, feedback) {
        return this.innovationRepo.update(id, { status: false });
    }
    async deleteInnovation(id) {
        return this.innovationRepo.delete(id);
    }
    async createResearch(adminId, data) {
        const assignedToExpertId = data.assignedToExpertId && data.assignedToExpertId.trim() !== ''
            ? data.assignedToExpertId
            : null;
        const publication = this.pubRepo.create({
            title: data.title,
            authors: data.authors || [],
            journal_name: data.journal_name,
            conference_info: data.conference_info,
            doi: data.doi,
            url: data.url,
            publisher: data.publisher,
            book_title: data.book_title,
            publication_type: data.publication_type || 'journal',
            status: data.status ?? true,
            assignedToExpertId: assignedToExpertId,
            userId: adminId,
        });
        const savedPub = await this.pubRepo.save(publication);
        return {
            message: 'Research created successfully',
            publication: savedPub,
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(university_upload_entity_1.UniversityUpload)),
    __param(2, (0, typeorm_1.InjectRepository)(event_entity_1.Event)),
    __param(3, (0, typeorm_1.InjectRepository)(publication_entity_1.Publication)),
    __param(4, (0, typeorm_1.InjectRepository)(innovation_entity_1.Innovation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map