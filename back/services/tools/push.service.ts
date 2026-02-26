import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as webpush from 'web-push';
import { VapidPublicKey } from '../../../shared/shared-constants';
import { AppPushSubscription } from '../../entities/push-subscription.entity';
import { VapidPrivateKey } from '../../environment/constants';
import { PushSubscriptionDto } from '../../models/dto/push-subscription-dto';
import { GenericResponse } from '../../models/responses/generic-response';

webpush.setVapidDetails(
    'mailto:contact@nextalys.com',
    VapidPublicKey,
    VapidPrivateKey,
);

@Injectable()
export class PushService {
    constructor(
        @InjectRepository(AppPushSubscription)
        private readonly pushSubscriptionsRepository: Repository<AppPushSubscription>,
    ) {}

    public async sendNotification(
        content: string,
        userIds: string[],
        data?: any,
        actions?: { action: string; title: string }[],
    ): Promise<GenericResponse> {
        const subsriptions = await this.pushSubscriptionsRepository.find({
            where: { userId: In(userIds) },
        });
        //console.log(': PushService -> subs', subsriptions);
        const subsriptionsDto = subsriptions.map((x) => x.toDto());
        const response = new GenericResponse();
        const notificationPayload = {
            notification: {
                title: 'Nextalys',
                body: content,
                icon: 'assets/logos/logo_menu.png',
                vibrate: [100, 50, 100],
                data,
                actions: undefined,
            },
        };

        if (actions) {
            notificationPayload.notification.actions = actions;
        }
        try {
            for (const subscription of subsriptionsDto) {
                // console.log(': PushService -> subscription', subscription);
                if (!subscription.endpoint) continue;
                await webpush.sendNotification(
                    subscription,
                    JSON.stringify(notificationPayload),
                );
            }
            response.success = true;
        } catch (err) {
            response.handleError(err);
        }
        return response;
    }

    public async savePushSubscription(
        pushSubscription: PushSubscriptionDto,
        userId: string,
    ) {
        const response = new GenericResponse();
        try {
            const subInDb = await this.pushSubscriptionsRepository.findOne({
                userId: userId,
                endpoint: pushSubscription.endpoint,
                //  expirationTime:pushSubscription.expirationTime,
                //   options:pushSubscription.options,
            });
            if (!subInDb) {
                const newSub = new AppPushSubscription();
                // newSub.user = new User();
                // newSub.user.id = userId;
                newSub.userId = userId;
                // newSub.expirationTime = pushSubscription.expirationTime;
                newSub.endpoint = pushSubscription.endpoint;
                newSub.auth = pushSubscription.keys.auth;
                newSub.p256dh = pushSubscription.keys.p256dh;
                if (pushSubscription.options)
                    newSub.options = JSON.stringify(pushSubscription.options);
                await this.pushSubscriptionsRepository.save(newSub);
                console.log(
                    ': UsersService -> publicsavePushSubscription -> pushSubscriptionsRepository',
                    newSub,
                );
            }
            response.success = true;
        } catch (err) {
            response.handleError(err);
        }
        return response;
    }
}
