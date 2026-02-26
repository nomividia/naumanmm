import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserDto } from '../../models/dto/user-dto';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { BaseSearchResponse } from '../../models/responses/base-search-responses';
import { GenericResponse } from '../../models/responses/generic-response';

export class HistoryDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiPropertyOptional()
    entity?: string;

    @ApiPropertyOptional()
    entityId?: string;

    @ApiPropertyOptional()
    field?: string;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    date?: Date;

    @ApiPropertyOptional()
    valueBefore?: string;

    @ApiPropertyOptional()
    valueAfter?: string;

    @ApiPropertyOptional()
    userId?: string;

    @ApiPropertyOptional({ type: () => UserDto })
    user?: UserDto;
}

export class GetHistoryResponse extends GenericResponse {
    @ApiPropertyOptional({ type: () => HistoryDto })
    history: HistoryDto;
}

export class GetHistoriesResponse extends BaseSearchResponse {
    @ApiPropertyOptional({ type: () => HistoryDto, isArray: true })
    histories: HistoryDto[];
}

export class GetHistoryRequest extends BaseSearchRequest {
    @ApiPropertyOptional()
    id?: string;

    @ApiPropertyOptional({ description: 'get history by entityId' })
    entityId?: string;
}
