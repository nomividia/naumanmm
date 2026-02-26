import { NotificationDto } from '../models/dto/notification-dto';
import { AppBaseEntity } from './base-entity';
import { User } from './user.entity';
export declare class AppNotification extends AppBaseEntity {
    user: User;
    userId: string;
    title: string;
    seen: boolean;
    url?: string;
    toDto(): NotificationDto;
    fromDto(dto: NotificationDto): void;
}
