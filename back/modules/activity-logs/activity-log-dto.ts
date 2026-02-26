import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppValueDto } from '../../models/dto/app-value-dto';
import { UserDto } from '../../models/dto/user-dto';
import { BaseSearchResponse } from '../../models/responses/base-search-responses';
import { GenericResponse } from '../../models/responses/generic-response';

export class ActivityLogDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiPropertyOptional()
    public user?: UserDto;

    @ApiProperty()
    public userId: string;

    @ApiPropertyOptional()
    public type?: AppValueDto;

    @ApiProperty()
    public typeId: string;

    @ApiProperty({ type: String, format: 'date-time' })
    date: Date;

    @ApiPropertyOptional()
    public meta?: string;
}

export class GetActivityLogResponse extends GenericResponse {
    @ApiProperty({ type: () => ActivityLogDto })
    log: ActivityLogDto = null;
}

export class GetActivityLogsResponse extends BaseSearchResponse {
    @ApiProperty({ type: () => ActivityLogDto, isArray: true })
    logs: ActivityLogDto[] = [];
}
