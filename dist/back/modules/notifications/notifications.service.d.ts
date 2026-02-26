import { Repository } from 'typeorm';
import { AppNotification } from '../../entities/notification.entity';
import { GetNotificationResponse, GetNotificationsResponse, NotificationDto } from '../../models/dto/notification-dto';
import { GenericResponse } from '../../models/responses/generic-response';
import { ApplicationBaseModelService } from '../../services/base-model.service';
import { MailService } from '../../services/tools/mail.service';
import { PushService } from '../../services/tools/push.service';
import { UsersService } from '../../services/users.service';
import { SocketGateway } from '../../sockets/socket-gateway';
import { KeyValueService } from '../key-value-db/key-value.service';
export declare class NotificationsService extends ApplicationBaseModelService<AppNotification, NotificationDto, GetNotificationResponse, GetNotificationsResponse> {
    private readonly notificationsRepository;
    private pushService;
    private mailService;
    private usersService;
    private keyValueService;
    private socketGateway;
    constructor(notificationsRepository: Repository<AppNotification>, pushService: PushService, mailService: MailService, usersService: UsersService, keyValueService: KeyValueService, socketGateway: SocketGateway);
    sendNotification(data: string, userIds: string[], transports: ('Push' | 'Mail' | 'SMS')[], sendSocketToAllUsers: boolean, notifUrl: string): Promise<GenericResponse>;
    getUserNotifications(userId: string, untilDate: Date): Promise<GetNotificationsResponse>;
    setNotificationsSeen(userId: string): Promise<GenericResponse>;
    sendEvent(data: string, userIds: string[]): Promise<GenericResponse>;
    cleanOldNotifications(): Promise<GenericResponse>;
}
