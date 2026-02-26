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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
const shared_constants_1 = require("../../../shared/shared-constants");
const notification_dto_1 = require("../../models/dto/notification-dto");
const push_subscription_dto_1 = require("../../models/dto/push-subscription-dto");
const generic_response_1 = require("../../models/responses/generic-response");
const auth_tools_service_1 = require("../../services/auth-tools.service");
const roles_guard_1 = require("../../services/guards/roles-guard");
const roles_decorator_1 = require("../../services/roles.decorator");
const push_service_1 = require("../../services/tools/push.service");
const base_controller_1 = require("../../shared/base.controller");
const socket_gateway_1 = require("../../sockets/socket-gateway");
const notifications_service_1 = require("./notifications.service");
let NotificationsController = class NotificationsController extends base_controller_1.BaseController {
    constructor(notificationsService, authToolsService, pushService, socketGateway) {
        super();
        this.notificationsService = notificationsService;
        this.authToolsService = authToolsService;
        this.pushService = pushService;
        this.socketGateway = socketGateway;
    }
    getMyNotifications() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUserPayload = this.authToolsService.getCurrentPayload(false);
            const fiveWeeksPast = nextalys_js_helpers_1.DateHelpers.addDaysToDate(new Date(), -35);
            return yield this.notificationsService.getUserNotifications(currentUserPayload === null || currentUserPayload === void 0 ? void 0 : currentUserPayload.id, fiveWeeksPast);
        });
    }
    setNotificationsSeen() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUserPayload = this.authToolsService.getCurrentPayload(false);
            return yield this.notificationsService.setNotificationsSeen(currentUserPayload.id);
        });
    }
    sendNotificationTest(userId, sendToAllSocket = 'false') {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.notificationsService.sendNotification('test notif  - ' + new Date().getTime(), [userId], ['Push', 'Mail'], sendToAllSocket === 'true', 'https://www.nextalys.com');
        });
    }
    savePushSubscription(subscription) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.pushService.savePushSubscription(subscription, this.authToolsService.getCurrentPayload(false).id);
        });
    }
    sendEventTest(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.notificationsService.sendEvent('test event  - ' + new Date().getTime(), [userId]);
        });
    }
    sendEventTestSocket(userId, fromFirebase, sendToAllSocket = 'false') {
        return __awaiter(this, void 0, void 0, function* () {
            let userIds;
            if (userId && sendToAllSocket !== 'true') {
                userIds = [userId];
            }
            yield this.socketGateway.sendEventToClient(shared_constants_1.CustomSocketEventType.NewMessage, {
                data: 'test event socket - ' + new Date().getTime(),
                date: new Date(),
            }, userIds);
            return new generic_response_1.GenericResponse(true);
        });
    }
};
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Get)('getMyNotifications'),
    (0, swagger_1.ApiOperation)({
        summary: 'getMyNotifications',
        operationId: 'getMyNotifications',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'getMyNotifications',
        type: notification_dto_1.GetNotificationsResponse,
    }),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getMyNotifications", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Post)('set-my-notifications-seen'),
    (0, swagger_1.ApiOperation)({
        summary: 'setNotificationsSeen',
        operationId: 'setNotificationsSeen',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'setNotificationsSeen',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "setNotificationsSeen", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.AdminTech),
    (0, common_1.Post)('send-notification-test/:userId'),
    (0, swagger_1.ApiOperation)({
        summary: 'sendNotificationTest',
        operationId: 'sendNotificationTest',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'sendNotification',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('sendToAllSocket')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendNotificationTest", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('save-push-subscription'),
    (0, swagger_1.ApiOperation)({
        summary: 'savePushSubscription',
        operationId: 'savePushSubscription',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'savePushSubscription',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [push_subscription_dto_1.PushSubscriptionDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "savePushSubscription", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.AdminTech),
    (0, common_1.Post)('send-event-test/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'sendEventTest', operationId: 'sendEventTest' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'sendEventTest',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendEventTest", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.AdminTech),
    (0, common_1.Post)('send-event-test-socket/:userId'),
    (0, swagger_1.ApiOperation)({
        summary: 'sendEventTestSocket',
        operationId: 'sendEventTestSocket',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'sendEventTestSocket',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('fromFirebase')),
    __param(2, (0, common_1.Query)('sendToAllSocket')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendEventTestSocket", null);
NotificationsController = __decorate([
    (0, common_1.Controller)('notifications'),
    (0, swagger_1.ApiTags)('notifications'),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService,
        auth_tools_service_1.AuthToolsService,
        push_service_1.PushService,
        socket_gateway_1.SocketGateway])
], NotificationsController);
exports.NotificationsController = NotificationsController;
//# sourceMappingURL=notifications.controller.js.map