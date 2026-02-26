import { Repository } from 'typeorm';
import { AppPushSubscription } from '../../entities/push-subscription.entity';
import { PushSubscriptionDto } from '../../models/dto/push-subscription-dto';
import { GenericResponse } from '../../models/responses/generic-response';
export declare class PushService {
    private readonly pushSubscriptionsRepository;
    constructor(pushSubscriptionsRepository: Repository<AppPushSubscription>);
    sendNotification(content: string, userIds: string[], data?: any, actions?: {
        action: string;
        title: string;
    }[]): Promise<GenericResponse>;
    savePushSubscription(pushSubscription: PushSubscriptionDto, userId: string): Promise<GenericResponse>;
}
