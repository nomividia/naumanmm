import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { VapidPublicKey } from '../../../shared/shared-constants';
import { NotificationsService } from './api-client.generated';

@Injectable()
export class WebPushProvider {
    constructor(
        private swPush: SwPush,
        private notificationsService: NotificationsService,
    ) {}

    public async subscribeToPush() {
        try {
            const pushSubscription = await this.swPush.requestSubscription({
                serverPublicKey: VapidPublicKey,
            });

            if (!pushSubscription) {
                return;
            }

            const response = await this.notificationsService
                .savePushSubscription({ pushSubscriptionDto: pushSubscription })
                .toPromise();

            if (!response.success) {
                console.error(response.message);
            } else {
                console.log('push subscription sent to server');
            }
        } catch (err) {
            console.log('Log: WebPushProvider -> subscribeToPush -> err', err);
        }
    }
}
