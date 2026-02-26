"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppCommonModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const referential_controller_1 = require("../controllers/referential.controller");
const app_language_entity_1 = require("../entities/app-language.entity");
const app_type_entity_1 = require("../entities/app-type.entity");
const app_value_entity_1 = require("../entities/app-value.entity");
const constants_1 = require("../environment/constants");
const users_module_1 = require("../modules/users/users.module");
const auth_tools_service_1 = require("../services/auth-tools.service");
const roles_guard_1 = require("../services/guards/roles-guard");
const referential_service_1 = require("../services/referential.service");
const logger_service_1 = require("../services/tools/logger.service");
let AppCommonModule = class AppCommonModule {
};
AppCommonModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secret: constants_1.JwtSecretKey,
                signOptions: {
                    expiresIn: '3650d',
                },
            }),
            typeorm_1.TypeOrmModule.forFeature([app_value_entity_1.AppValue, app_type_entity_1.AppType, app_language_entity_1.AppLanguage]),
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
        ],
        controllers: [referential_controller_1.ReferentialController],
        providers: [referential_service_1.ReferentialService, logger_service_1.AppLogger, roles_guard_1.RolesGuard, auth_tools_service_1.AuthToolsService],
        exports: [
            jwt_1.JwtModule,
            referential_service_1.ReferentialService,
            logger_service_1.AppLogger,
            roles_guard_1.RolesGuard,
            auth_tools_service_1.AuthToolsService,
            users_module_1.UsersModule,
        ],
    })
], AppCommonModule);
exports.AppCommonModule = AppCommonModule;
//# sourceMappingURL=app-common.module.js.map