import { NgModule } from '@angular/core';
import {
    AngularFireAnalyticsModule,
    CONFIG,
    ScreenTrackingService,
} from '@angular/fire/analytics';
import { NxsFirebaseAnalyticsService } from './firebase-analytics.service';

const analyticsConfig = {
    send_page_view: true,
    // allow_ad_personalization_signals: false,
    // anonymize_ip: true,
};
@NgModule({
    imports: [AngularFireAnalyticsModule],
    providers: [
        {
            provide: CONFIG,
            useValue: analyticsConfig,
        },
        ScreenTrackingService,
        NxsFirebaseAnalyticsService,
    ],
    exports: [],
})
export class NxsFirebaseAnalyticsModule {
    constructor(sv: NxsFirebaseAnalyticsService, sv2: ScreenTrackingService) {}
}
