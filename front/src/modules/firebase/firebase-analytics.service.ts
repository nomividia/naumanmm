import { Injectable } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { EventsCollector } from 'nextalys-js-helpers/dist/events';
import { AuthDataService } from '../../services/auth-data.service';

@Injectable()
export class NxsFirebaseAnalyticsService {
    static angularFireAnalytics: AngularFireAnalytics;
    private eventsCollector = new EventsCollector();

    constructor(angularFireAnalytics: AngularFireAnalytics) {
        NxsFirebaseAnalyticsService.angularFireAnalytics = angularFireAnalytics;
        const sub = AuthDataService.currentUserChanged.subscribe(() => {
            if (AuthDataService.currentUser) {
                NxsFirebaseAnalyticsService.setUserId(
                    AuthDataService.currentUser.id,
                );
            } else {
                NxsFirebaseAnalyticsService.setUserId(null);
            }
        });

        this.eventsCollector.collect(sub);

        if (AuthDataService.currentUser) {
            NxsFirebaseAnalyticsService.setUserId(
                AuthDataService.currentUser.id,
            );
        }
    }

    static setUserId(userId: string) {
        if (!this.angularFireAnalytics) {
            return;
        }
        this.angularFireAnalytics.setUserId(userId);
    }

    ngOnDestroy(): void {
        this.eventsCollector.unsubscribeAll();
    }
}
