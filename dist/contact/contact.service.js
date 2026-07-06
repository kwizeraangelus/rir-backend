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
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contact_entity_1 = require("./contact.entity");
const mail_service_1 = require("../mail/mail.service");
let ContactService = class ContactService {
    contactRepo;
    mailService;
    constructor(contactRepo, mailService) {
        this.contactRepo = contactRepo;
        this.mailService = mailService;
    }
    async create(dto) {
        const contact = this.contactRepo.create(dto);
        const saved = await this.contactRepo.save(contact);
        await this.mailService.sendContactNotification(dto);
        return saved;
    }
    findAll() {
        return this.contactRepo.find({ order: { created_at: 'DESC' } });
    }
    markAsRead(id) {
        return this.contactRepo.update(id, { is_read: true });
    }
    remove(id) {
        return this.contactRepo.delete(id);
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contact_entity_1.Contact)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        mail_service_1.MailService])
], ContactService);
//# sourceMappingURL=contact.service.js.map