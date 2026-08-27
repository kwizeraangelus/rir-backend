"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CleanupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleanupService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const university_upload_entity_1 = require("./entities/university-upload.entity");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let CleanupService = CleanupService_1 = class CleanupService {
    uploadRepo;
    logger = new common_1.Logger(CleanupService_1.name);
    constructor(uploadRepo) {
        this.uploadRepo = uploadRepo;
    }
    async deleteRejectedUploads() {
        const cutoff = new Date();
        cutoff.setHours(cutoff.getHours() - 48);
        const expiredUploads = await this.uploadRepo.find({
            where: {
                status: 'rejected',
                updated_at: (0, typeorm_2.LessThan)(cutoff),
            },
        });
        if (expiredUploads.length === 0)
            return;
        this.logger.log(`Found ${expiredUploads.length} rejected uploads to delete`);
        for (const upload of expiredUploads) {
            if (upload.file_path) {
                const fullPath = path.join(process.cwd(), upload.file_path);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                    this.logger.log(`Deleted file: ${fullPath}`);
                }
            }
            if (upload.cover_image) {
                const coverPath = path.join(process.cwd(), upload.cover_image);
                if (fs.existsSync(coverPath)) {
                    fs.unlinkSync(coverPath);
                }
            }
            await this.uploadRepo.remove(upload);
            this.logger.log(`Deleted upload record: ${upload.id}`);
        }
    }
};
exports.CleanupService = CleanupService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CleanupService.prototype, "deleteRejectedUploads", null);
exports.CleanupService = CleanupService = CleanupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(university_upload_entity_1.UniversityUpload)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CleanupService);
//# sourceMappingURL=cleanup.service.js.map