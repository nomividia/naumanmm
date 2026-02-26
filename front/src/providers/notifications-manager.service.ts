import { Injectable } from '@angular/core';
import {
    AppLocalNotificationsEnabled,
    CustomSocketEventType,
    FirebaseNotificationsEnabled,
} from '../../../shared/shared-constants';
import {
    AppNotificationPayload,
    FirebaseNxsEvent,
} from '../../../shared/shared-types';
import { BaseComponent } from '../components/base/base.component';
import { FirebaseEventsManager } from '../modules/firebase/firebase-events-manager';
import { SocketService } from '../services/socket.service';
import { NotificationDto, NotificationsService } from './api-client.generated';
import { StackedSnackBarService } from './stacked-snackbar.service';

@Injectable()
export class NotificationsManager extends BaseComponent {
    public notificationsList: NotificationDto[] = [];

    constructor(
        private stackedSnackBarService: StackedSnackBarService,
        private notificationsService: NotificationsService,
    ) {
        super();

        if (FirebaseNotificationsEnabled && !AppLocalNotificationsEnabled) {
            this.subscribeToObservable(
                FirebaseEventsManager.onNewNotification(),
                (notif) => {
                    this.onNewNotification(notif.data);
                },
            );
            this.subscribeToEvent(
                FirebaseEventsManager.eventsOrNotificatonsChanged,
                () => {
                    this.setNotificationsFromFirebaseNotifications();
                },
            );
            this.setNotificationsFromFirebaseNotifications();
        }

        if (AppLocalNotificationsEnabled) {
            SocketService.subscribeToEvent<AppNotificationPayload>(
                CustomSocketEventType.AppNotification,
                this.eventsCollector,
                (data) => {
                    if (data?.data?.userIds?.length) {
                        const userIds = data.data?.userIds;
                        if (
                            userIds?.some(
                                (x) =>
                                    x &&
                                    x === this.AuthDataService.currentUser.id,
                            )
                        ) {
                            this.onNewNotification(data.data);
                            this.loadUserLocalNotifications();
                        }
                    }
                },
            );
            this.initLoadNotifications();
        }
    }

    private async initLoadNotifications() {
        await this.AuthDataService.waitForAuthServiceInitialized();
        this.loadUserLocalNotifications();
    }

    private setNotificationsFromFirebaseNotifications() {
        if (AppLocalNotificationsEnabled || !FirebaseNotificationsEnabled) {
            return;
        }

        this.notificationsList =
            FirebaseEventsManager.notifications.map((x) =>
                this.firebaseEventToNotificationDto(x),
            ) || [];
    }

    private firebaseEventToNotificationDto(
        firebaseEvt: FirebaseNxsEvent<AppNotificationPayload>,
    ): NotificationDto {
        return {
            creationDate: new Date(firebaseEvt.time),
            seen: !!firebaseEvt.seen,
            title: firebaseEvt.data.title,
            userId: firebaseEvt.receiverId,
        };
    }

    private async loadUserLocalNotifications() {
        if (!AppLocalNotificationsEnabled) {
            return;
        }

        this.notificationsList = [];
        const response = await this.notificationsService
            .getMyNotifications()
            .toPromise();

        if (response.success) {
            this.notificationsList = response.notifications || [];
            this.notificationsList.sort(
                (a, b) => b.creationDate.getTime() - a.creationDate.getTime(),
            );
        }
    }

    public onNewNotification(data: AppNotificationPayload) {
        if (!this.AuthDataService.currentUser) {
            return;
        }

        this.stackedSnackBarService.openSnackbar(data.title, {
            duration: 10000,
        });

        if (!AppLocalNotificationsEnabled && FirebaseNotificationsEnabled) {
            this.setNotificationsFromFirebaseNotifications();
        }
    }

    public setNotificationsSeen() {
        if (
            !this.AuthDataService.currentUser ||
            !this.notificationsList.some((x) => !x.seen)
        ) {
            return;
        }

        this.notificationsList.forEach((x) => (x.seen = true));

        if (!AppLocalNotificationsEnabled && FirebaseNotificationsEnabled) {
            FirebaseEventsManager.setEventsList();
            this.setNotificationsFromFirebaseNotifications();
        } else if (AppLocalNotificationsEnabled) {
            this.notificationsService.setNotificationsSeen().toPromise();
        }
    }
}
