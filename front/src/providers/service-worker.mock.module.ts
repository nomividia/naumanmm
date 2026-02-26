import { NgModule } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { SwPushServerMock } from './sw-push-server.mock.service';
import { SwUpdateServerMock } from './sw-update-server.mock.service';

@NgModule({
    providers: [
        { provide: SwUpdate, useClass: SwUpdateServerMock },
        { provide: SwPush, useClass: SwPushServerMock },
    ],
})
export class ServiceWorkerModuleMock {}
