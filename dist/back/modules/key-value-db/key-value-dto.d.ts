import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { BaseSearchResponse } from '../../models/responses/base-search-responses';
import { GenericResponse } from '../../models/responses/generic-response';
export declare class KeyValueDto {
    id?: string;
    key: string;
    value?: string;
    frontEditable: boolean;
}
export declare class GetKeyValueResponse extends GenericResponse {
    keyValue: KeyValueDto;
}
export declare class GetKeyValuesResponse extends BaseSearchResponse {
    keyValues: KeyValueDto[];
}
export declare class GetKeyValuesRequest extends BaseSearchRequest {
    keys?: string;
    onlyFrontEditable?: 'true' | 'false';
}
