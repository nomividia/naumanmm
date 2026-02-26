import { BaseSearchRequest } from '../requests/base-search-requests';
import { GenericResponse } from '../responses/generic-response';
import { AppValueDto } from './app-value-dto';
import { TranslationDto } from './translation-dto';
export declare class AppTypeDto {
    id?: string;
    label: string;
    code: string;
    appValues: AppValueDto[];
    translations?: TranslationDto[];
}
export declare class GetAppTypesResponse extends GenericResponse {
    appTypes: AppTypeDto[];
}
export declare class GetAppTypeResponse extends GenericResponse {
    appType: AppTypeDto;
}
export declare class FindAppTypesRequest extends BaseSearchRequest {
    appTypesCodes: string;
    includeTranslations?: 'true' | 'false';
}
export declare class GetTypeValuesRequest extends BaseSearchRequest {
    appTypeCode: string;
    alsoDisabled?: string;
    includeTranslations?: 'true' | 'false';
}
export declare class GetAppTypeRequest {
    id: string;
    includeDisabled?: 'true' | 'false';
}
