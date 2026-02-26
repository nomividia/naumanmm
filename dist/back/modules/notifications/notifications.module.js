"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const notification_entity_1 = require("../../entities/notification.entity");
const auth_tools_service_1 = require("../../services/auth-tools.service");
const app_common_module_1 = require("../../shared/app-common.module");
const shared_module_1 = require("../../shared/shared-module");
const socket_module_1 = require("../../sockets/socket-module");
const key_value_module_1 = require("../key-value-db/key-value.module");
const mail_module_1 = require("../mail/mail.module");
const users_module_1 = require("../users/users.module");
const notifications_controller_1 = require("./notifications.controller");
const notifications_service_1 = require("./notifications.service");
let NotificationsModule = class NotificationsModule {
};
NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => app_common_module_1.AppCommonModule),
            (0, common_1.forwardRef)(() => shared_module_1.SharedModule),
            (0, common_1.forwardRef)(() => socket_module_1.SocketModule),
            (0, common_1.forwardRef)(() => mail_module_1.MailModule),
            (0, common_1.forwardRef)(() => key_value_module_1.KeyValueModule),
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
            typeorm_1.TypeOrmModule.forFeature([notification_entity_1.AppNotification]),
        ],
        controllers: [notifications_controller_1.NotificationsController],
        providers: [notifications_service_1.NotificationsService, auth_tools_service_1.AuthToolsService],
        exports: [notifications_service_1.NotificationsService],
    })
], NotificationsModule);
exports.NotificationsModule = NotificationsModule;
//# sourceMappingURL=notifications.module.js.map