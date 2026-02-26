import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseSearchResponse } from '../responses/base-search-responses';
import { GenericResponse } from '../responses/generic-response';
import { UserDto } from './user-dto';

export class NotificationDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiPropertyOptional({ type: () => UserDto, isArray: false })
    public user?: UserDto;

    @ApiProperty()
    public userId: string;

    @ApiProperty({ type: String, format: 'date-time' })
    public creationDate: Date;

    @ApiProperty()
    public title: string;

    @ApiProperty()
    public seen: boolean;

    @ApiPropertyOptional()
    public url?: string;
}

export class GetNotificationResponse extends GenericResponse {
    @ApiPropertyOptional({ type: () => NotificationDto, isArray: false })
    notification: NotificationDto;
}
export class GetNotificationsResponse extends BaseSearchResponse {
    @ApiPropertyOptional({ type: () => NotificationDto, isArray: true })
    notifications: NotificationDto[];
}
