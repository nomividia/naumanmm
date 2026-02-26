import { AppValueDto } from '../../models/dto/app-value-dto';
import { UserDto } from '../../models/dto/user-dto';
import { BaseSearchResponse } from '../../models/responses/base-search-responses';
import { GenericResponse } from '../../models/responses/generic-response';
export declare class ActivityLogDto {
    id?: string;
    user?: UserDto;
    userId: string;
    type?: AppValueDto;
    typeId: string;
    date: Date;
    meta?: string;
}
export declare class GetActivityLogResponse extends GenericResponse {
    log: ActivityLogDto;
}
export declare class GetActivityLogsResponse extends BaseSearchResponse {
    logs: ActivityLogDto[];
}
