"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InnovationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const innovation_controller_1 = require("./innovation.controller");
const innovation_service_1 = require("./innovation.service");
const innovation_entity_1 = require("./entities/innovation.entity");
const user_entity_1 = require("../users/entities/user.entity");
const auth_module_1 = require("../auth/auth.module");
let InnovationModule = class InnovationModule {
};
exports.InnovationModule = InnovationModule;
exports.InnovationModule = InnovationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([innovation_entity_1.Innovation, user_entity_1.User]),
            auth_module_1.AuthModule,
        ],
        controllers: [innovation_controller_1.InnovationController],
        providers: [innovation_service_1.InnovationService],
        exports: [innovation_service_1.InnovationService],
    })
], InnovationModule);
//# sourceMappingURL=innovation.module.js.map