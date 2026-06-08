"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const admin_controller_1 = require("./admin.controller");
const admin_service_1 = require("./admin.service");
const user_entity_1 = require("../users/entities/user.entity");
const university_upload_entity_1 = require("../university/entities/university-upload.entity");
const event_entity_1 = require("../event/entities/event.entity");
const auth_module_1 = require("../auth/auth.module");
const event_module_1 = require("../event/event.module");
const publication_entity_1 = require("../researcher/entities/publication.entity");
const innovation_entity_1 = require("../innovation/entities/innovation.entity");
const expert_entity_1 = require("../expert/entities/expert.entity");
const expert_module_1 = require("../expert/expert.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                university_upload_entity_1.UniversityUpload,
                event_entity_1.Event,
                publication_entity_1.Publication,
                innovation_entity_1.Innovation,
                expert_entity_1.Expert,
            ]),
            expert_module_1.ExpertModule,
            auth_module_1.AuthModule,
            event_module_1.EventModule,
        ],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map