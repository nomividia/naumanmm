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
exports.PushService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const webpush = require("web-push");
const shared_constants_1 = require("../../../shared/shared-constants");
const push_subscription_entity_1 = require("../../entities/push-subscription.entity");
const constants_1 = require("../../environment/constants");
const generic_response_1 = require("../../models/responses/generic-response");
webpush.setVapidDetails('mailto:contact@nextalys.com', shared_constants_1.VapidPublicKey, constants_1.VapidPrivateKey);
let PushService = class PushService {
    constructor(pushSubscriptionsRepository) {
        this.pushSubscriptionsRepository = pushSubscriptionsRepository;
    }
    sendNotification(content, userIds, data, actions) {
        return __awaiter(this, void 0, void 0, function* () {
            const subsriptions = yield this.pushSubscriptionsRepository.find({
                where: { userId: (0, typeorm_2.In)(userIds) },
            });
            const subsriptionsDto = subsriptions.map((x) => x.toDto());
            const response = new generic_response_1.GenericResponse();
            const notificationPayload = {
                notification: {
                    title: 'Nextalys',
                    body: content,
                    icon: 'assets/logos/logo_menu.png',
                    vibrate: [100, 50, 100],
                    data,
                    actions: undefined,
                },
            };
            if (actions) {
                notificationPayload.notification.actions = actions;
            }
            try {
                for (const subscription of subsriptionsDto) {
                    if (!subscription.endpoint)
                        continue;
                    yield webpush.sendNotification(subscription, JSON.stringify(notificationPayload));
                }
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    savePushSubscription(pushSubscription, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                const subInDb = yield this.pushSubscriptionsRepository.findOne({
                    userId: userId,
                    endpoint: pushSubscription.endpoint,
                });
                if (!subInDb) {
                    const newSub = new push_subscription_entity_1.AppPushSubscription();
                    newSub.userId = userId;
                    newSub.endpoint = pushSubscription.endpoint;
                    newSub.auth = pushSubscription.keys.auth;
                    newSub.p256dh = pushSubscription.keys.p256dh;
                    if (pushSubscription.options)
                        newSub.options = JSON.stringify(pushSubscription.options);
                    yield this.pushSubscriptionsRepository.save(newSub);
                    console.log(': UsersService -> publicsavePushSubscription -> pushSubscriptionsRepository', newSub);
                }
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
};
PushService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(push_subscription_entity_1.AppPushSubscription)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PushService);
exports.PushService = PushService;
//# sourceMappingURL=push.service.js.map