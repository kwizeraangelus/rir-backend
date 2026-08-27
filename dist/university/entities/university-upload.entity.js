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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniversityUpload = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let UniversityUpload = class UniversityUpload {
    id;
    submission_type = '';
    university = '';
    title = '';
    authors = '';
    cover_image;
    year;
    description;
    supervisor_name = '';
    degree_type;
    file_path = '';
    status = 'pending';
    userId;
    user;
    created_at = new Date();
    views_count;
    likes_count;
    feedback;
    rating_sum;
    rating_count;
    average_rating;
    updated_at;
};
exports.UniversityUpload = UniversityUpload;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UniversityUpload.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UniversityUpload.prototype, "submission_type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UniversityUpload.prototype, "university", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UniversityUpload.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UniversityUpload.prototype, "authors", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], UniversityUpload.prototype, "cover_image", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UniversityUpload.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)('longtext'),
    __metadata("design:type", String)
], UniversityUpload.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UniversityUpload.prototype, "supervisor_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UniversityUpload.prototype, "degree_type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UniversityUpload.prototype, "file_path", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], UniversityUpload.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UniversityUpload.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.id, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.User)
], UniversityUpload.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UniversityUpload.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], UniversityUpload.prototype, "views_count", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], UniversityUpload.prototype, "likes_count", void 0);
__decorate([
    (0, typeorm_1.Column)('longtext', { nullable: true }),
    __metadata("design:type", String)
], UniversityUpload.prototype, "feedback", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], UniversityUpload.prototype, "rating_sum", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], UniversityUpload.prototype, "rating_count", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], UniversityUpload.prototype, "average_rating", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UniversityUpload.prototype, "updated_at", void 0);
exports.UniversityUpload = UniversityUpload = __decorate([
    (0, typeorm_1.Entity)('university_uploads')
], UniversityUpload);
//# sourceMappingURL=university-upload.entity.js.map