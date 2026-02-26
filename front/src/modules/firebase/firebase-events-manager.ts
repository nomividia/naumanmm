import { MainHelpers } from 'nextalys-js-helpers';
import { Observable, Subject } from 'rxjs';
import {
    AppNotificationPayload,
    FirebaseNxsEvent,
    FirebaseNxsEventType,
    FirebaseNxsEventWrapper,
    FirebaseRefs,
} from '../../../../shared/shared-types';
import { AuthDataService } from '../../services/auth-data.service';
import { NxsFirebaseRealTimeDatabaseService } from './firebase-realtime-database.service';

export interface FirebaseNxsEventSubject {
    eventType: string;
    subject: Subject<FirebaseNxsEvent>;
}

export class FirebaseEventsManager {
    private static eventsSubjects: FirebaseNxsEventSubject[] = [];
    static eventsOrNotificatonsChanged: Subject<void> = new Subject();
    private static initialized = false;
    static notifications: FirebaseNxsEvent[] = [];
    static eventsList: FirebaseNxsEvent[] = [];
    static eventsListWrapper: FirebaseNxsEventWrapper = {};

    static init() {
        if (
            this.initialized ||
            !AuthDataService.currentUser ||
            !NxsFirebaseRealTimeDatabaseService.instance
        ) {
            return;
        }

        this.initialized = true;

        NxsFirebaseRealTimeDatabaseService.instance.angularFireDatabase
            .object<FirebaseNxsEventWrapper>(
                FirebaseRefs.NxsEvents + '/' + AuthDataService.currentUser.id,
            )
            .valueChanges()
            .subscribe((data) => {
                // this.eventsList = data.val();
                if (!data) {
                    return;
                }

                this.eventsListWrapper = {};
                this.eventsList.splice(0, this.eventsList.length);
                this.notifications.splice(0, this.notifications.length);
                let mustUpdateEvents = false;

                for (const key in data) {
                    const evt = data[key];
                    this.eventsList.push(evt);

                    if (evt.eventType === 'SingleEvent') {
                        const subj = this.eventsSubjects.find(
                            (x) => x.eventType === evt.eventType,
                        );
                        if (subj) subj.subject.next(evt);
                        mustUpdateEvents = true;
                    } else {
                        this.eventsListWrapper[key] = evt;
                    }

                    if (evt.eventType === 'Notification') {
                        this.notifications.push(evt);
                    }
                }

                this.notifications.sort((a, b) => b.time - a.time);

                if (mustUpdateEvents) {
                    this.setEventsList();
                }

                this.eventsOrNotificatonsChanged.next();
                // for (const eventId in this.eventsList) {
                //     const evt = this.eventsList[eventId];
                //     if (!evt.handled) {
                //         evt.handled = true;
                //         this.setEventHandled(evt);
                //     }
                // }
            });
    }

    static onEvent(
        eventType: FirebaseNxsEventType,
    ): Observable<FirebaseNxsEvent> {
        this.init();
        let evtWrapper = this.eventsSubjects.find(
            (x) => x.eventType === eventType,
        );

        if (!evtWrapper) {
            evtWrapper = {
                eventType: eventType,
                subject: new Subject<FirebaseNxsEvent>(),
            };
            this.eventsSubjects.push(evtWrapper);
        }

        return evtWrapper.subject.asObservable();
    }

    static async updateEvent(evt: FirebaseNxsEvent) {
        if (!NxsFirebaseRealTimeDatabaseService.instance) {
            return;
        }

        await NxsFirebaseRealTimeDatabaseService.instance.angularFireDatabase.database
            .ref(FirebaseRefs.NxsEvents + '/' + evt.receiverId + '/' + evt.id)
            .set(evt);
    }

    static async setEventsList() {
        if (!NxsFirebaseRealTimeDatabaseService.instance) {
            return;
        }

        await NxsFirebaseRealTimeDatabaseService.instance.angularFireDatabase.database
            .ref(FirebaseRefs.NxsEvents + '/' + AuthDataService.currentUser.id)
            .set(this.eventsListWrapper);
    }

    static async sendEvent(
        eventType: FirebaseNxsEventType,
        receiverId: string,
        data?: any,
    ) {
        if (!AuthDataService.currentUser) {
            return;
        }

        const newEvent: FirebaseNxsEvent = {
            receiverId: receiverId,
            senderId: AuthDataService.currentUser.id,
            data: data,
            eventType: eventType,
            time: new Date().getTime(),
            id: MainHelpers.generateGuid(),
            seen: false,
        };

        await NxsFirebaseRealTimeDatabaseService.instance.angularFireDatabase.database
            .ref(FirebaseRefs.NxsEvents + '/' + receiverId + '/' + newEvent.id)
            .set(newEvent);
    }

    static onNewNotification(): Observable<
        FirebaseNxsEvent<AppNotificationPayload>
    > {
        return this.onEvent('Notification');
    }
}
