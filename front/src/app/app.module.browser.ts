import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NxsFirebaseAnalyticsModule } from '../modules/firebase/firebase-analytics.module';
import { NxsFirebaseAuthModule } from '../modules/firebase/firebase-auth.module';
import { NxsFirebaseRealTimeDatabaseModule } from '../modules/firebase/firebase-realtime-database.module';
import { WindowService } from '../services/window.service';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

const firebaseModules: any[] = [];

if (environment.firebaseEnabled) {
  firebaseModules.push(...[
    NxsFirebaseRealTimeDatabaseModule,
    NxsFirebaseAuthModule,
  ]);

  if (environment.analyticsEnabled && environment.production) {
    firebaseModules.push(NxsFirebaseAnalyticsModule);
  }
}
export function getToken() {
  return '';
}
// For AoT compilation:
export function getWindow() {
  return window;
}

@NgModule({
  imports: [
    AppModule,
    BrowserTransferStateModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production, registrationStrategy: 'registerImmediately' }),
    HttpClientModule,
    ...firebaseModules,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: WindowService,
      useFactory: getWindow,
    },
  ],
})
export class AppBrowserModule { }