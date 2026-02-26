"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const users_controller_1 = require("../../controllers/users.controller");
const app_right_entity_1 = require("../../entities/app-right.entity");
const user_role_entity_1 = require("../../entities/user-role.entity");
const user_entity_1 = require("../../entities/user.entity");
const app_rights_service_1 = require("../../services/app-rights.service");
const user_roles_service_1 = require("../../services/user-roles.service");
const users_service_1 = require("../../services/users.service");
const app_common_module_1 = require("../../shared/app-common.module");
const candidates_module_1 = require("../candidates/candidates.module");
const file_module_1 = require("../file/file.module");
const job_offers_module_1 = require("../job-offers/job-offers.module");
let UsersModule = class UsersModule {
};
UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => app_common_module_1.AppCommonModule),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, user_role_entity_1.UserRole, app_right_entity_1.AppRight]),
            file_module_1.FileModule,
            job_offers_module_1.JobOfferModule,
            (0, common_1.forwardRef)(() => candidates_module_1.CandidateModule),
        ],
        controllers: [users_controller_1.UsersController, users_controller_1.UsersRolesController, users_controller_1.AppRightsController],
        providers: [users_service_1.UsersService, user_roles_service_1.UserRoleService, app_rights_service_1.AppRightsService],
        exports: [users_service_1.UsersService, user_roles_service_1.UserRoleService, app_rights_service_1.AppRightsService],
    })
], UsersModule);
exports.UsersModule = UsersModule;
//# sourceMappingURL=users.module.js.map