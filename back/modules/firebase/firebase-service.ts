import { DateHelpers, MainHelpers } from 'nextalys-js-helpers';
import {
    FirebaseCommonManager,
    FirebaseRealtimeDbManager,
} from 'nextalys-node-helpers/dist/firebase-helpers';
import {
    AppNotificationPayload,
    FirebaseNxsEvent,
    FirebaseRefs,
    INxsFireConnectedUsers,
    NxsFirebaseUser,
} from '../../../shared/shared-types';
import { Environment } from '../../environment/environment';
import { AppLogger } from '../../services/tools/logger.service';
const path = require('path');

export class FirebaseService {
    static async init() {
        if (!Environment.FirebaseEnabled) {
            return;
        }

        await FirebaseCommonManager.init({
            certFilePath: path.join(
                Environment.ApiBasePath,
                'firebase-adminsdk.json',
            ),
            databaseURL: Environment.FirebaseDbUrl,
            debug: true,
            logger: AppLogger.loggerInstance,
        });
    }

    static async sendNotification(
        receiverIds: string[],
        data?: AppNotificationPayload,
    ) {
        if (!receiverIds) {
            return;
        }

        for (const receiverId of receiverIds) {
            const evt: FirebaseNxsEvent<AppNotificationPayload> = {
                data: data,
                eventType: 'Notification',
                id: MainHelpers.generateGuid(),
                receiverId: receiverId,
                seen: false,
                time: new Date().getTime(),
            };

            await FirebaseRealtimeDbManager.setRef(
                FirebaseRefs.NxsEvents + '/' + receiverId + '/' + evt.id,
                evt,
            );
        }
    }

    static async sendEvent(receiverIds: string[], data?: any) {
        if (!receiverIds) {
            return;
        }

        for (const receiverId of receiverIds) {
            const evt: FirebaseNxsEvent = {
                data: data,
                eventType: 'SingleEvent',
                id: MainHelpers.generateGuid(),
                receiverId: receiverId,
                time: new Date().getTime(),
            };

            await FirebaseRealtimeDbManager.setRef(
                FirebaseRefs.NxsEvents + '/' + receiverId + '/' + evt.id,
                evt,
            );
        }
    }

    static async getUsersData(userIds: string[]) {
        if (!userIds) {
            return [];
        }

        const users: NxsFirebaseUser[] = [];
        const usersWrapper: INxsFireConnectedUsers =
            await FirebaseRealtimeDbManager.getOnce(
                FirebaseRefs.NxsLoggedUsers,
            );

        for (const userId in usersWrapper) {
            const user = usersWrapper[userId];

            if (user.appUserId && userIds.indexOf(user.appUserId) !== -1) {
                users.push(user);
            }
        }

        return users;
    }

    static async cleanOldConnections() {
        if (!Environment.FirebaseEnabled) {
            return;
        }

        const anonymousUsers: INxsFireConnectedUsers =
            await FirebaseRealtimeDbManager.getOnce(FirebaseRefs.NxsUsers);
        const usersToRemove: string[] = [];

        for (const userId in anonymousUsers) {
            const user = anonymousUsers[userId];

            if (!user.connections || !user.connections.length) {
                usersToRemove.push(userId);
            }
        }

        for (const userId of usersToRemove) {
            if (!!userId) {
                await FirebaseRealtimeDbManager.removeRef(
                    FirebaseRefs.NxsUsers + '/' + userId,
                );
            }
        }

        const usersWrapper: INxsFireConnectedUsers =
            await FirebaseRealtimeDbManager.getOnce(
                FirebaseRefs.NxsLoggedUsers,
            );

        for (const userId in usersWrapper) {
            const user = usersWrapper[userId];

            if (user.connections) {
                const newUserConnections = {};

                for (const connectionKey in user.connections) {
                    const connection = user.connections[connectionKey];

                    if (connection.date) {
                        const date = DateHelpers.parseDateTimeFromISO8601Format(
                            connection.date as string,
                        );
                        const diff = DateHelpers.daysDiff(date, new Date());

                        if (diff < 2) {
                            newUserConnections[connectionKey] = connection;
                        }
                    }
                }
                user.connections = newUserConnections;
            }
        }

        await FirebaseRealtimeDbManager.updateRef(
            FirebaseRefs.NxsLoggedUsers,
            usersWrapper,
        );
    }

    static async cleanOldNotifications() {
        if (!Environment.FirebaseEnabled) {
            return;
        }

        type NotificationDataModel = {
            [userId: string]: {
                [notifId: string]: FirebaseNxsEvent<AppNotificationPayload>;
            };
        };

        const notifications =
            await FirebaseRealtimeDbManager.getOnce<NotificationDataModel>(
                FirebaseRefs.NxsEvents,
            );
        const dateNow = new Date();
        const oneWeek = 7 * 24 * 3600 * 1000;
        const fiveWeeks = 5 * oneWeek;
        const nofiticationsToKeep: NotificationDataModel = {};

        for (const userId in notifications) {
            const userNotifications = notifications[userId];

            for (const notifId in userNotifications) {
                const notif = userNotifications[notifId];

                if (
                    notif.eventType !== 'Notification' ||
                    (notif.time &&
                        dateNow.getTime() - new Date(notif.time).getTime() <
                            fiveWeeks)
                ) {
                    if (!nofiticationsToKeep[userId]) {
                        nofiticationsToKeep[userId] = {};
                    }

                    nofiticationsToKeep[userId][notifId] = notif;
                }
            }
        }

        await FirebaseRealtimeDbManager.setRef(
            FirebaseRefs.NxsEvents,
            nofiticationsToKeep,
        );
    }
}
