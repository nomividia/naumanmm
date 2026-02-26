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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
const typeorm_2 = require("typeorm");
const candidates_helpers_1 = require("../../../shared/candidates-helpers");
const shared_constants_1 = require("../../../shared/shared-constants");
const notification_entity_1 = require("../../entities/notification.entity");
const app_error_1 = require("../../models/app-error");
const notification_dto_1 = require("../../models/dto/notification-dto");
const generic_response_1 = require("../../models/responses/generic-response");
const firebase_service_1 = require("../../modules/firebase/firebase-service");
const base_model_service_1 = require("../../services/base-model.service");
const mail_service_1 = require("../../services/tools/mail.service");
const push_service_1 = require("../../services/tools/push.service");
const users_service_1 = require("../../services/users.service");
const socket_gateway_1 = require("../../sockets/socket-gateway");
const key_value_service_1 = require("../key-value-db/key-value.service");
let NotificationsService = class NotificationsService extends base_model_service_1.ApplicationBaseModelService {
    constructor(notificationsRepository, pushService, mailService, usersService, keyValueService, socketGateway) {
        super();
        this.notificationsRepository = notificationsRepository;
        this.pushService = pushService;
        this.mailService = mailService;
        this.usersService = usersService;
        this.keyValueService = keyValueService;
        this.socketGateway = socketGateway;
        this.modelOptions = {
            getManyResponse: notification_dto_1.GetNotificationsResponse,
            getOneResponse: notification_dto_1.GetNotificationResponse,
            getManyResponseField: 'notifications',
            getOneResponseField: 'notification',
            repository: this.notificationsRepository,
            entity: notification_entity_1.AppNotification,
        };
    }
    sendNotification(data, userIds, transports, sendSocketToAllUsers, notifUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                if (transports === null || transports === void 0 ? void 0 : transports.length) {
                    for (const transport of transports) {
                        switch (transport) {
                            case 'Mail':
                                if (userIds) {
                                    const mailSender = yield candidates_helpers_1.SharedCandidatesHelpers.getMailSenderFromCandidate(null, null, null, undefined);
                                    for (const userId of userIds) {
                                        const userResponse = yield this.usersService.findOne({
                                            where: { id: userId },
                                        });
                                        if (userResponse.success &&
                                            userResponse.user &&
                                            userResponse.user.mail) {
                                            this.mailService.sendMail({
                                                subject: 'Notification',
                                                to: [
                                                    {
                                                        address: userResponse.user.mail,
                                                    },
                                                ],
                                                from: { address: mailSender },
                                                htmlBody: data,
                                                templateName: 'mail_auto',
                                            });
                                            nextalys_js_helpers_1.MainHelpers.sleep(1000);
                                        }
                                    }
                                }
                                break;
                            case 'Push':
                                if (userIds) {
                                    yield this.pushService.sendNotification(data, userIds);
                                }
                                break;
                            case 'SMS':
                                break;
                        }
                    }
                }
                if (shared_constants_1.AppLocalNotificationsEnabled) {
                    const dateNow = new Date();
                    if (sendSocketToAllUsers) {
                        yield this.socketGateway.sendEventToClient(shared_constants_1.CustomSocketEventType.AppNotification, {
                            data: { title: data, userIds: userIds },
                            date: dateNow,
                        });
                    }
                    else {
                        yield this.socketGateway.sendEventToClient(shared_constants_1.CustomSocketEventType.AppNotification, {
                            data: { title: data, userIds: userIds },
                            date: dateNow,
                        }, userIds);
                    }
                    if (userIds === null || userIds === void 0 ? void 0 : userIds.length) {
                        for (const userId of userIds) {
                            const newNotification = new notification_entity_1.AppNotification();
                            newNotification.userId = userId;
                            newNotification.title = data;
                            newNotification.seen = false;
                            newNotification.url = notifUrl;
                            yield this.notificationsRepository.save(newNotification);
                        }
                    }
                }
                else if (shared_constants_1.FirebaseNotificationsEnabled) {
                    yield firebase_service_1.FirebaseService.sendNotification(userIds, {
                        title: data,
                        userIds: userIds,
                    });
                }
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    getUserNotifications(userId, untilDate) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = new notification_dto_1.GetNotificationsResponse();
            try {
                if (!userId) {
                    throw app_error_1.AppError.getForbiddenError('Unable to get user notifications : no payload');
                }
                response = yield this.findAll({
                    where: { userId: userId, creationDate: (0, typeorm_2.MoreThan)(untilDate) },
                });
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    setNotificationsSeen(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                if (!userId) {
                    throw app_error_1.AppError.getBadRequestError();
                }
                const notifications = yield this.notificationsRepository.find({
                    where: { userId: userId, seen: false },
                });
                if (notifications) {
                    for (const notification of notifications) {
                        notification.seen = true;
                        yield this.notificationsRepository.save(notification);
                    }
                }
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    sendEvent(data, userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                yield firebase_service_1.FirebaseService.sendEvent(userIds, data);
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    cleanOldNotifications() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                const dateNow = new Date();
                const daysToKeepDefault = 35;
                let daysToKeep = daysToKeepDefault;
                const daysToKeepStr = yield this.keyValueService.getKeyValue('DaysToKeepNotifications');
                if (!daysToKeepStr) {
                    yield this.keyValueService.saveKeyValue('DaysToKeepNotifications', daysToKeep);
                }
                else {
                    daysToKeep = parseInt(daysToKeepStr, 10);
                    if (!daysToKeep || isNaN(daysToKeep)) {
                        daysToKeep = daysToKeepDefault;
                    }
                }
                const fiveWeeksPast = nextalys_js_helpers_1.DateHelpers.addDaysToDate(dateNow, -daysToKeep);
                const notificationsList = yield this.notificationsRepository.find({
                    where: { creationDate: (0, typeorm_2.LessThan)(fiveWeeksPast) },
                    select: ['id'],
                });
                if (notificationsList.length) {
                    yield this.delete(notificationsList.map((x) => x.id));
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
NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.AppNotification)),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        push_service_1.PushService,
        mail_service_1.MailService,
        users_service_1.UsersService,
        key_value_service_1.KeyValueService,
        socket_gateway_1.SocketGateway])
], NotificationsService);
exports.NotificationsService = NotificationsService;
//# sourceMappingURL=notifications.service.js.map