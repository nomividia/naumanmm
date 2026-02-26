import { NgModule } from '@angular/core';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { FirebaseRealTimeAuthService } from './firebase-realtime-auth.service';
import { NxsFirebaseRealTimeDatabaseService } from './firebase-realtime-database.service';

@NgModule({
    imports: [AngularFireDatabaseModule],
    providers: [NxsFirebaseRealTimeDatabaseService],
    exports: [],
})
export class NxsFirebaseRealTimeDatabaseModule {
    constructor(sv: NxsFirebaseRealTimeDatabaseService) {
        FirebaseRealTimeAuthService.init({
            saveAnonymousConnection: true,
            watchFullUsersListChange: true,
        });
    }
}
