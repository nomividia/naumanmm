import { BaseSearchRequest } from './base-search-requests';
export declare class FindUsersRequest extends BaseSearchRequest {
    roles?: string;
    includeDisabled?: 'true' | 'false';
    includeCandidate?: 'true' | 'false';
    includeGender?: 'true' | 'false';
    includeImage?: 'true' | 'false';
    includeRoles?: 'true' | 'false';
}
export declare class GetUserRolesRequest extends BaseSearchRequest {
    includeDisabled?: string;
    includeRights?: string;
}
