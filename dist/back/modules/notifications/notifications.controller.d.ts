import { GetNotificationsResponse } from '../../models/dto/notification-dto';
import { PushSubscriptionDto } from '../../models/dto/push-subscription-dto';
import { GenericResponse } from '../../models/responses/generic-response';
import { AuthToolsService } from '../../services/auth-tools.service';
import { PushService } from '../../services/tools/push.service';
import { BaseController } from '../../shared/base.controller';
import { SocketGateway } from '../../sockets/socket-gateway';
import { NotificationsService } from './notifications.service';
export declare class NotificationsController extends BaseController {
    private notificationsService;
    private authToolsService;
    private pushService;
    private socketGateway;
    constructor(notificationsService: NotificationsService, authToolsService: AuthToolsService, pushService: PushService, socketGateway: SocketGateway);
    getMyNotifications(): Promise<GetNotificationsResponse>;
    setNotificationsSeen(): Promise<GenericResponse>;
    sendNotificationTest(userId: string, sendToAllSocket?: 'true' | 'false'): Promise<GenericResponse>;
    savePushSubscription(subscription: PushSubscriptionDto): Promise<GenericResponse>;
    sendEventTest(userId: string): Promise<GenericResponse>;
    sendEventTestSocket(userId: string, fromFirebase: string, sendToAllSocket?: 'true' | 'false'): Promise<GenericResponse>;
}
