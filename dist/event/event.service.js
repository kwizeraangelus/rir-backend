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
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_entity_1 = require("./entities/event.entity");
let EventsService = class EventsService {
    eventRepo;
    constructor(eventRepo) {
        this.eventRepo = eventRepo;
    }
    async create(userId, data, photoPath) {
        const event = this.eventRepo.create({
            ...data,
            photo: photoPath,
            user: { id: userId },
        });
        return this.eventRepo.save(event);
    }
    async getMyEvents(userId) {
        const events = await this.eventRepo.find({
            where: { user: { id: userId } },
            order: { created_at: 'DESC' },
        });
        return events.map((event) => ({
            ...event,
            photo_url: event.photo
                ? event.photo.startsWith('http')
                    ? event.photo
                    : (() => {
                        const baseUrl = process.env.NODE_ENV === 'production'
                            ? 'https://api.riri.rw'
                            : 'http://localhost:8000';
                        return `${baseUrl}/${event.photo.replace(/^\/+/, '')}`;
                    })()
                : null,
        }));
    }
    async findAll() {
        const events = await this.eventRepo.find({
            where: { status: true },
            order: { date: 'ASC' },
        });
        return events.map((event) => ({
            ...event,
            photo_url: event.photo
                ? event.photo.startsWith('http')
                    ? event.photo
                    : (() => {
                        const baseUrl = process.env.NODE_ENV === 'production'
                            ? 'https://api.riri.rw'
                            : 'http://localhost:8000';
                        return `${baseUrl}/${event.photo.replace(/^\/+/, '')}`;
                    })()
                : null,
        }));
    }
    async updateEvent(userId, eventId, updateData, photoPath) {
        const event = await this.eventRepo.findOne({
            where: { id: eventId, user: { id: userId } },
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or unauthorized');
        }
        const allowedFields = ['title', 'description', 'date', 'location', 'link', 'icon'];
        const dataToUpdate = {};
        allowedFields.forEach(field => {
            if (updateData[field] !== undefined && updateData[field] !== null) {
                dataToUpdate[field] = updateData[field];
            }
        });
        const shouldRemovePhoto = updateData.remove_photo === 'true' || updateData.remove_photo === true;
        if (photoPath) {
            dataToUpdate.photo = photoPath;
        }
        else if (shouldRemovePhoto) {
            dataToUpdate.photo = null;
        }
        await this.eventRepo.update(eventId, dataToUpdate);
        return this.eventRepo.findOne({
            where: { id: eventId },
            relations: ['user'],
        });
    }
    async deleteEvent(userId, eventId) {
        const event = await this.eventRepo.findOne({
            where: { id: eventId, user: { id: userId } },
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or unauthorized');
        }
        await this.eventRepo.delete(eventId);
        return { success: true, message: 'Event deleted successfully' };
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(event_entity_1.Event)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EventsService);
//# sourceMappingURL=event.service.js.map