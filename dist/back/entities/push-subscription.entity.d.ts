import { PushSubscriptionDto } from '../models/dto/push-subscription-dto';
import { User } from './user.entity';
export declare class AppPushSubscription {
    id: string;
    user: User;
    userId: string;
    endpoint: string;
    options?: string;
    auth: string;
    p256dh: string;
    toDto(): PushSubscriptionDto;
}
