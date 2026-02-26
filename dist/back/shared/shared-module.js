"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_controller_1 = require("../controllers/auth.controller");
const socket_module_1 = require("../sockets/socket-module");
const image_controller_1 = require("../controllers/image.controller");
const pdf_controller_1 = require("../controllers/pdf.controller");
const app_image_entity_1 = require("../entities/app-image.entity");
const push_subscription_entity_1 = require("../entities/push-subscription.entity");
const translation_entity_1 = require("../entities/translation.entity");
const activity_logs_module_1 = require("../modules/activity-logs/activity-logs.module");
const key_value_module_1 = require("../modules/key-value-db/key-value.module");
const mail_module_1 = require("../modules/mail/mail.module");
const auth_service_1 = require("../services/auth.service");
const roles_guard_1 = require("../services/guards/roles-guard");
const images_service_1 = require("../services/images.service");
const pdf_service_1 = require("../services/tools/pdf.service");
const push_service_1 = require("../services/tools/push.service");
const app_common_module_1 = require("./app-common.module");
let SharedModule = class SharedModule {
};
SharedModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => app_common_module_1.AppCommonModule),
            typeorm_1.TypeOrmModule.forFeature([push_subscription_entity_1.AppPushSubscription, translation_entity_1.Translation, app_image_entity_1.AppImage]),
            socket_module_1.SocketModule,
            activity_logs_module_1.ActivityLogsModule,
            (0, common_1.forwardRef)(() => key_value_module_1.KeyValueModule),
            (0, common_1.forwardRef)(() => mail_module_1.MailModule),
        ],
        controllers: [auth_controller_1.AuthController, pdf_controller_1.PdfController, image_controller_1.ImageController],
        providers: [
            auth_service_1.AuthService,
            roles_guard_1.RolesGuard,
            pdf_service_1.PdfService,
            push_service_1.PushService,
            images_service_1.ImagesService,
        ],
        exports: [app_common_module_1.AppCommonModule, pdf_service_1.PdfService, push_service_1.PushService, auth_service_1.AuthService],
    })
], SharedModule);
exports.SharedModule = SharedModule;
//# sourceMappingURL=shared-module.js.map