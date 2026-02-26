import { UserDto } from '../../models/dto/user-dto';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { BaseSearchResponse } from '../../models/responses/base-search-responses';
import { GenericResponse } from '../../models/responses/generic-response';
export declare class HistoryDto {
    id?: string;
    entity?: string;
    entityId?: string;
    field?: string;
    date?: Date;
    valueBefore?: string;
    valueAfter?: string;
    userId?: string;
    user?: UserDto;
}
export declare class GetHistoryResponse extends GenericResponse {
    history: HistoryDto;
}
export declare class GetHistoriesResponse extends BaseSearchResponse {
    histories: HistoryDto[];
}
export declare class GetHistoryRequest extends BaseSearchRequest {
    id?: string;
    entityId?: string;
}
