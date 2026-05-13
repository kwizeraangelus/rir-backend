"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniversityModule = void 0;
const common_1 = require("@nestjs/common");
const university_service_1 = require("./university.service");
const typeorm_1 = require("@nestjs/typeorm");
const university_controller_1 = require("./university.controller");
const university_upload_entity_1 = require("./entities/university-upload.entity");
const user_entity_1 = require("../users/entities/user.entity");
const jwt_1 = require("@nestjs/jwt");
const jwt_auth_guard_1 = require("../auth/jwt-auth/jwt-auth.guard");
let UniversityModule = class UniversityModule {
};
exports.UniversityModule = UniversityModule;
exports.UniversityModule = UniversityModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([university_upload_entity_1.UniversityUpload, user_entity_1.User]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET ||
                    'super-secret-key-change-this-in-production-very-long-random-string-987654321',
            }),
        ],
        controllers: [university_controller_1.UniversityController],
        providers: [university_service_1.UniversityService, jwt_auth_guard_1.JwtAuthGuard],
    })
], UniversityModule);
//# sourceMappingURL=university.module.js.map