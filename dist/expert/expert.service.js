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
exports.ExpertService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const expert_entity_1 = require("./entities/expert.entity");
const uuid_1 = require("uuid");
let ExpertService = class ExpertService {
    expertRepository;
    constructor(expertRepository) {
        this.expertRepository = expertRepository;
    }
    async create(createExpertDto) {
        const id = (0, uuid_1.v4)();
        const formattedCertifications = (createExpertDto.certifications || []).map(cert => ({
            ...cert,
            dateObtained: typeof cert.dateObtained === 'string'
                ? new Date(cert.dateObtained)
                : cert.dateObtained,
        }));
        const expert = this.expertRepository.create({
            id,
            ...createExpertDto,
            certifications: formattedCertifications,
            verified: createExpertDto.verified || false,
        });
        return await this.expertRepository.save(expert);
    }
    async findAll() {
        return await this.expertRepository.find();
    }
    async findOne(id) {
        const expert = await this.expertRepository.findOneBy({ id });
        if (!expert) {
            throw new common_1.NotFoundException(`Expert with id ${id} not found`);
        }
        return expert;
    }
    async findById(id) {
        return await this.findOne(id);
    }
    async update(id, updateExpertDto) {
        const expert = await this.findOne(id);
        let formattedCertifications = expert.certifications;
        if (updateExpertDto.certifications) {
            formattedCertifications = updateExpertDto.certifications.map(cert => ({
                ...cert,
                dateObtained: typeof cert.dateObtained === 'string'
                    ? new Date(cert.dateObtained)
                    : cert.dateObtained,
            }));
        }
        const updatedData = this.expertRepository.merge(expert, {
            ...updateExpertDto,
            certifications: formattedCertifications,
        });
        return await this.expertRepository.save(updatedData);
    }
    async remove(id) {
        const expert = await this.findOne(id);
        await this.expertRepository.delete(id);
        return { message: `Expert ${expert.name} deleted successfully` };
    }
    async verify(id) {
        const expert = await this.findOne(id);
        expert.verified = true;
        return await this.expertRepository.save(expert);
    }
    async unverify(id) {
        const expert = await this.findOne(id);
        expert.verified = false;
        return await this.expertRepository.save(expert);
    }
    async uploadProfileImage(id, filePath) {
        const expert = await this.findOne(id);
        expert.profileImage = filePath;
        return await this.expertRepository.save(expert);
    }
};
exports.ExpertService = ExpertService;
exports.ExpertService = ExpertService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(expert_entity_1.Expert)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ExpertService);
//# sourceMappingURL=expert.service.js.map