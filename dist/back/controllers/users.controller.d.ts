import { GetAppRightsResponse } from '../models/dto/app-right-dto';
import { GetConnectedConsultantsResponse, GetHasUserAcceptedTOSResponse, GetUserResponse, GetUsersResponse, GetUserStatsResponse, UserDto } from '../models/dto/user-dto';
import { GetUserRoleResponse, GetUserRolesResponse, UserRoleDto } from '../models/dto/user-role-dto';
import { BaseSearchRequest } from '../models/requests/base-search-requests';
import { FindUsersRequest, GetUserRolesRequest } from '../models/requests/user-requests';
import { GenericResponse } from '../models/responses/generic-response';
import { AppRightsService } from '../services/app-rights.service';
import { AuthToolsService } from '../services/auth-tools.service';
import { ReferentialService } from '../services/referential.service';
import { UserRoleService } from '../services/user-roles.service';
import { UsersService } from '../services/users.service';
import { BaseController } from '../shared/base.controller';
export declare class UsersController extends BaseController {
    private readonly usersService;
    private readonly authToolsService;
    private referentialService;
    constructor(usersService: UsersService, authToolsService: AuthToolsService, referentialService: ReferentialService);
    get(userName: string): Promise<GetUserResponse>;
    getAll(request: FindUsersRequest): Promise<GetUsersResponse>;
    createOrUpdate(user: UserDto): Promise<GetUserResponse>;
    updateMyUserProfile(user: UserDto): Promise<GetUserResponse>;
    deleteUsers(userIds: string): Promise<GenericResponse>;
    archiveUsers(userIds: string): Promise<GenericResponse>;
    hasUserAcceptedTOS(): Promise<GetHasUserAcceptedTOSResponse>;
    acceptTOS(): Promise<GenericResponse>;
    getConsultantStats(userId: string): Promise<GetUserStatsResponse>;
    getConnectedConsultants(): Promise<GetConnectedConsultantsResponse>;
    updateMyLanguage(langCode: string): Promise<GenericResponse>;
}
export declare class UsersRolesController extends BaseController {
    private readonly userRoleService;
    constructor(userRoleService: UserRoleService);
    getUserRole(id: string): Promise<GetUserRoleResponse>;
    getUserRoles(request: GetUserRolesRequest): Promise<GetUserRolesResponse>;
    createOrUpdateRole(userRole: UserRoleDto): Promise<GetUserRoleResponse>;
    deleteRoles(ids: string): Promise<GenericResponse>;
    archiveRoles(ids: string): Promise<GenericResponse>;
}
export declare class AppRightsController extends BaseController {
    private readonly appRightsService;
    constructor(appRightsService: AppRightsService);
    getAppRights(request: BaseSearchRequest): Promise<GetAppRightsResponse>;
}
