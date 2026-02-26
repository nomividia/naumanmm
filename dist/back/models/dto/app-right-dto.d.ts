import { BaseSearchResponse } from '../responses/base-search-responses';
import { GenericResponse } from '../responses/generic-response';
import { UserRoleDto } from './user-role-dto';
export declare class AppRightDto {
    id?: string;
    code: string;
    label?: string;
    roles?: UserRoleDto[];
    order?: number;
}
export declare class GetAppRightResponse extends GenericResponse {
    appRight: AppRightDto;
}
export declare class GetAppRightsResponse extends BaseSearchResponse {
    appRights: AppRightDto[];
}
