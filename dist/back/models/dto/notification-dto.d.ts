import { BaseSearchResponse } from '../responses/base-search-responses';
import { GenericResponse } from '../responses/generic-response';
import { UserDto } from './user-dto';
export declare class NotificationDto {
    id?: string;
    user?: UserDto;
    userId: string;
    creationDate: Date;
    title: string;
    seen: boolean;
    url?: string;
}
export declare class GetNotificationResponse extends GenericResponse {
    notification: NotificationDto;
}
export declare class GetNotificationsResponse extends BaseSearchResponse {
    notifications: NotificationDto[];
}
