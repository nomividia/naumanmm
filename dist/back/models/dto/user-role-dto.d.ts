import { BaseSearchResponse } from '../responses/base-search-responses';
import { GenericResponse } from '../responses/generic-response';
import { AppRightDto } from './app-right-dto';
export declare class UserRoleDto {
    id?: number;
    role: string;
    rights?: AppRightDto[];
    label?: string;
    enabled: boolean;
}
export declare class GetUserRoleResponse extends GenericResponse {
    userRole: UserRoleDto;
}
export declare class GetUserRolesResponse extends BaseSearchResponse {
    userRoles: UserRoleDto[];
}
