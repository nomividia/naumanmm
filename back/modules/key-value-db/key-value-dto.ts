import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { BaseSearchResponse } from '../../models/responses/base-search-responses';
import { GenericResponse } from '../../models/responses/generic-response';

export class KeyValueDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiProperty()
    key: string;

    @ApiPropertyOptional()
    value?: string;

    @ApiProperty()
    frontEditable: boolean;
}

export class GetKeyValueResponse extends GenericResponse {
    @ApiProperty({ type: () => KeyValueDto })
    keyValue: KeyValueDto = null;
}

export class GetKeyValuesResponse extends BaseSearchResponse {
    @ApiProperty({ type: () => KeyValueDto, isArray: true })
    keyValues: KeyValueDto[] = [];
}

export class GetKeyValuesRequest extends BaseSearchRequest {
    @ApiPropertyOptional()
    keys?: string;

    @ApiPropertyOptional({ type: String })
    onlyFrontEditable?: 'true' | 'false';
}
