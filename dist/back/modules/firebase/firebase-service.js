"use strict";
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
exports.FirebaseService = void 0;
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
const firebase_helpers_1 = require("nextalys-node-helpers/dist/firebase-helpers");
const shared_types_1 = require("../../../shared/shared-types");
const environment_1 = require("../../environment/environment");
const logger_service_1 = require("../../services/tools/logger.service");
const path = require('path');
class FirebaseService {
    static init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!environment_1.Environment.FirebaseEnabled) {
                return;
            }
            yield firebase_helpers_1.FirebaseCommonManager.init({
                certFilePath: path.join(environment_1.Environment.ApiBasePath, 'firebase-adminsdk.json'),
                databaseURL: environment_1.Environment.FirebaseDbUrl,
                debug: true,
                logger: logger_service_1.AppLogger.loggerInstance,
            });
        });
    }
    static sendNotification(receiverIds, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!receiverIds) {
                return;
            }
            for (const receiverId of receiverIds) {
                const evt = {
                    data: data,
                    eventType: 'Notification',
                    id: nextalys_js_helpers_1.MainHelpers.generateGuid(),
                    receiverId: receiverId,
                    seen: false,
                    time: new Date().getTime(),
                };
                yield firebase_helpers_1.FirebaseRealtimeDbManager.setRef(shared_types_1.FirebaseRefs.NxsEvents + '/' + receiverId + '/' + evt.id, evt);
            }
        });
    }
    static sendEvent(receiverIds, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!receiverIds) {
                return;
            }
            for (const receiverId of receiverIds) {
                const evt = {
                    data: data,
                    eventType: 'SingleEvent',
                    id: nextalys_js_helpers_1.MainHelpers.generateGuid(),
                    receiverId: receiverId,
                    time: new Date().getTime(),
                };
                yield firebase_helpers_1.FirebaseRealtimeDbManager.setRef(shared_types_1.FirebaseRefs.NxsEvents + '/' + receiverId + '/' + evt.id, evt);
            }
        });
    }
    static getUsersData(userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userIds) {
                return [];
            }
            const users = [];
            const usersWrapper = yield firebase_helpers_1.FirebaseRealtimeDbManager.getOnce(shared_types_1.FirebaseRefs.NxsLoggedUsers);
            for (const userId in usersWrapper) {
                const user = usersWrapper[userId];
                if (user.appUserId && userIds.indexOf(user.appUserId) !== -1) {
                    users.push(user);
                }
            }
            return users;
        });
    }
    static cleanOldConnections() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!environment_1.Environment.FirebaseEnabled) {
                return;
            }
            const anonymousUsers = yield firebase_helpers_1.FirebaseRealtimeDbManager.getOnce(shared_types_1.FirebaseRefs.NxsUsers);
            const usersToRemove = [];
            for (const userId in anonymousUsers) {
                const user = anonymousUsers[userId];
                if (!user.connections || !user.connections.length) {
                    usersToRemove.push(userId);
                }
            }
            for (const userId of usersToRemove) {
                if (!!userId) {
                    yield firebase_helpers_1.FirebaseRealtimeDbManager.removeRef(shared_types_1.FirebaseRefs.NxsUsers + '/' + userId);
                }
            }
            const usersWrapper = yield firebase_helpers_1.FirebaseRealtimeDbManager.getOnce(shared_types_1.FirebaseRefs.NxsLoggedUsers);
            for (const userId in usersWrapper) {
                const user = usersWrapper[userId];
                if (user.connections) {
                    const newUserConnections = {};
                    for (const connectionKey in user.connections) {
                        const connection = user.connections[connectionKey];
                        if (connection.date) {
                            const date = nextalys_js_helpers_1.DateHelpers.parseDateTimeFromISO8601Format(connection.date);
                            const diff = nextalys_js_helpers_1.DateHelpers.daysDiff(date, new Date());
                            if (diff < 2) {
                                newUserConnections[connectionKey] = connection;
                            }
                        }
                    }
                    user.connections = newUserConnections;
                }
            }
            yield firebase_helpers_1.FirebaseRealtimeDbManager.updateRef(shared_types_1.FirebaseRefs.NxsLoggedUsers, usersWrapper);
        });
    }
    static cleanOldNotifications() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!environment_1.Environment.FirebaseEnabled) {
                return;
            }
            const notifications = yield firebase_helpers_1.FirebaseRealtimeDbManager.getOnce(shared_types_1.FirebaseRefs.NxsEvents);
            const dateNow = new Date();
            const oneWeek = 7 * 24 * 3600 * 1000;
            const fiveWeeks = 5 * oneWeek;
            const nofiticationsToKeep = {};
            for (const userId in notifications) {
                const userNotifications = notifications[userId];
                for (const notifId in userNotifications) {
                    const notif = userNotifications[notifId];
                    if (notif.eventType !== 'Notification' ||
                        (notif.time &&
                            dateNow.getTime() - new Date(notif.time).getTime() <
                                fiveWeeks)) {
                        if (!nofiticationsToKeep[userId]) {
                            nofiticationsToKeep[userId] = {};
                        }
                        nofiticationsToKeep[userId][notifId] = notif;
                    }
                }
            }
            yield firebase_helpers_1.FirebaseRealtimeDbManager.setRef(shared_types_1.FirebaseRefs.NxsEvents, nofiticationsToKeep);
        });
    }
}
exports.FirebaseService = FirebaseService;
//# sourceMappingURL=firebase-service.js.map