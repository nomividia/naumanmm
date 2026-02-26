import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseSearchRequest } from '../requests/base-search-requests';
import { GenericResponse } from '../responses/generic-response';
import { AppValueDto } from './app-value-dto';
import { TranslationDto } from './translation-dto';

export class AppTypeDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiProperty()
    label: string;

    @ApiProperty()
    code: string;

    @ApiProperty({ type: () => AppValueDto, isArray: true })
    appValues: AppValueDto[];

    @ApiPropertyOptional({ type: () => TranslationDto, isArray: true })
    translations?: TranslationDto[];
}

export class GetAppTypesResponse extends GenericResponse {
    @ApiProperty({ type: () => AppTypeDto, isArray: true })
    appTypes: AppTypeDto[] = [];
}

export class GetAppTypeResponse extends GenericResponse {
    @ApiProperty({ type: () => AppTypeDto })
    appType: AppTypeDto = null;
}

export class FindAppTypesRequest extends BaseSearchRequest {
    @ApiProperty({
        description: 'Get with AppTypesCodes',
        required: true,
        type: String,
    })
    appTypesCodes: string;

    @ApiPropertyOptional({ type: String })
    includeTranslations?: 'true' | 'false';
}

export class GetTypeValuesRequest extends BaseSearchRequest {
    @ApiProperty()
    appTypeCode: string;

    @ApiPropertyOptional()
    alsoDisabled?: string;

    @ApiPropertyOptional({ type: String })
    includeTranslations?: 'true' | 'false';
}

export class GetAppTypeRequest {
    @ApiProperty({ type: () => String })
    id: string;

    @ApiPropertyOptional({ type: () => String })
    includeDisabled?: 'true' | 'false';
}
