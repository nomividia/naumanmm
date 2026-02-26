import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    HttpCode,
    Param,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { LinqRepository } from 'typeorm-linq-repository';
import { RolesList } from '../../shared/shared-constants';
import { SharedService } from '../../shared/shared-service';
import { AppRight } from '../entities/app-right.entity';
import { UserRole } from '../entities/user-role.entity';
import { User } from '../entities/user.entity';
import { AppError, AppErrorWithMessage } from '../models/app-error';
import { GetAppRightsResponse } from '../models/dto/app-right-dto';
import {
    GetConnectedConsultantsResponse,
    GetHasUserAcceptedTOSResponse,
    GetUserResponse,
    GetUsersResponse,
    GetUserStatsResponse,
    UserDto,
} from '../models/dto/user-dto';
import {
    GetUserRoleResponse,
    GetUserRolesResponse,
    UserRoleDto,
} from '../models/dto/user-role-dto';
import { BaseSearchRequest } from '../models/requests/base-search-requests';
import {
    FindUsersRequest,
    GetUserRolesRequest,
} from '../models/requests/user-requests';
import { GenericResponse } from '../models/responses/generic-response';
import { AppRightsService } from '../services/app-rights.service';
import { AuthToolsService } from '../services/auth-tools.service';
import { RolesGuard } from '../services/guards/roles-guard';
import { ReferentialService } from '../services/referential.service';
import { Roles } from '../services/roles.decorator';
import { UserRoleService } from '../services/user-roles.service';
import { UsersService } from '../services/users.service';
import { BaseController } from '../shared/base.controller';

@Controller('users')
@ApiTags('users')
export class UsersController extends BaseController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authToolsService: AuthToolsService,
        private referentialService: ReferentialService,
    ) {
        super();
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
        RolesList.Candidate,
    )
    @Get('get/:userName')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user', operationId: 'getUser' })
    @ApiResponse({
        status: 200,
        description: 'Get user',
        type: GetUserResponse,
    })
    @HttpCode(200)
    async get(@Param('userName') userName: string): Promise<GetUserResponse> {
        const currentUserPayload =
            this.authToolsService.getCurrentPayload(false);
        //Not admin user can only access self data
        const isAdmin = SharedService.userIsAdmin(currentUserPayload);
        const isConsultant = SharedService.userIsConsultant(currentUserPayload);
        const isAdminTech = SharedService.userIsAdminTech(currentUserPayload);
        const isRH = SharedService.userIsRH(currentUserPayload);

        if (
            !isAdmin &&
            !isConsultant &&
            !isAdminTech &&
            !isRH &&
            currentUserPayload.userName !== userName
        ) {
            throw new ForbiddenException('Forbidden');
        }

        const query = new LinqRepository(User)
            .getOne()
            .where((x) => x.userName)
            .equal(userName);

        return await this.usersService.findOne(
            {
                query,
                relations: [
                    { include: (x) => x.language },
                    { include: (x) => x.pushSubscriptions },
                    { include: (x) => x.translations },
                    { include: (x) => x.image },
                    { include: (x) => x.gender },
                ],
            },
            false,
        );
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all users', operationId: 'getAllUsers' })
    @ApiResponse({
        status: 200,
        description: 'Get all users',
        type: GetUsersResponse,
    })
    @HttpCode(200)
    async getAll(
        @Query() request: FindUsersRequest,
    ): Promise<GetUsersResponse> {
        return await this.usersService.getUsers(request);
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Post()
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Create or update user',
        operationId: 'createOrUpdateUser',
    })
    @ApiResponse({
        status: 200,
        description: 'Create or update user',
        type: GetUserResponse,
    })
    @HttpCode(200)
    async createOrUpdate(@Body() user: UserDto): Promise<GetUserResponse> {
        let getUserResponse = new GetUserResponse();

        try {
            if (!user) {
                throw new AppErrorWithMessage('Requête invalide !');
            }

            const payload = this.authToolsService.getCurrentPayload(false);

            if (
                !SharedService.userIsAdmin(payload) &&
                !SharedService.userIsConsultant(payload) &&
                !SharedService.userIsAdminTech(payload) &&
                payload.id !== user.id
            ) {
                throw new AppErrorWithMessage(
                    "Vous n'avez pas l'autorisation de faire cela.",
                    403,
                );
            }

            let mustGenerateToken = false;

            if (payload && user && payload.id === user.id) {
                mustGenerateToken = true;
            }

            if (!user.id) {
                user.roles = [{ role: RolesList.Consultant, enabled: true }];
            }

            getUserResponse = await this.usersService.createOrUpdate(
                user,
                mustGenerateToken,
                payload,
            );
        } catch (err) {
            getUserResponse.handleError(err);
        }

        return getUserResponse;
    }

    @UseGuards(RolesGuard)
    @Post('updateMyUserProfile')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'updateMyUserProfile',
        operationId: 'updateMyUserProfile',
    })
    @ApiResponse({
        status: 200,
        description: 'updateMyUserProfile',
        type: GetUserResponse,
    })
    @HttpCode(200)
    async updateMyUserProfile(@Body() user: UserDto): Promise<GetUserResponse> {
        let getUserResponse = new GetUserResponse();

        try {
            if (!user) {
                throw new AppErrorWithMessage('Requête invalide !');
            }

            const payload = this.authToolsService.getCurrentPayload(false);

            if (payload.id !== user.id) {
                throw new AppErrorWithMessage(
                    "Vous n'avez pas l'autorisation de faire cela.",
                    403,
                );
            }
            getUserResponse = await this.usersService.createOrUpdate(
                user,
                true,
                payload,
            );
        } catch (err) {
            getUserResponse.handleError(err);
        }

        return getUserResponse;
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @Delete()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete users', operationId: 'deleteUsers' })
    @ApiResponse({
        status: 200,
        description: 'Delete users from ID',
        type: GenericResponse,
    })
    @HttpCode(200)
    async deleteUsers(
        @Query('userIds') userIds: string,
    ): Promise<GenericResponse> {
        return await this.usersService.delete(userIds.split(','));
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Post('archiveUsers')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Archive user', operationId: 'archiveUsers' })
    @ApiResponse({
        status: 200,
        description: 'Archive users from ID',
        type: GenericResponse,
    })
    @HttpCode(200)
    async archiveUsers(
        @Query('userIds') userIds: string,
    ): Promise<GenericResponse> {
        return await this.usersService.archive(userIds.split(','));
    }

    @Get('hasUserAcceptedTOS')
    @UseGuards(RolesGuard)
    @Roles(RolesList.Candidate)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'has user accepted TOS',
        operationId: 'hasUserAcceptedTOS',
    })
    @ApiResponse({
        status: 200,
        description: 'has user accepted TOS',
        type: GetHasUserAcceptedTOSResponse,
    })
    @HttpCode(200)
    async hasUserAcceptedTOS(): Promise<GetHasUserAcceptedTOSResponse> {
        const response = new GetHasUserAcceptedTOSResponse();

        try {
            const payload = this.authToolsService.getCurrentPayload(false);

            if (!payload?.id) {
                throw new AppErrorWithMessage('Unable to find user');
            }

            const getUserResponse = await this.usersService.findOne({
                where: { id: payload.id },
            });
            response.hasAcceptedTOS = getUserResponse.user.TOSAccepted ?? false;
            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Candidate)
    @Post('acceptTOS')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'accept therm of use', operationId: 'acceptTOS' })
    @ApiResponse({
        status: 200,
        description: 'accept therm of use',
        type: GenericResponse,
    })
    @HttpCode(200)
    async acceptTOS(): Promise<GenericResponse> {
        const payload = this.authToolsService.getCurrentPayload(false);

        if (!payload?.id) {
            throw new AppErrorWithMessage('Unable to find user');
        }

        const getResponse = await this.usersService.findOne({
            where: { id: payload.id },
        });

        const userToUpdate = getResponse.user;

        userToUpdate.TOSAccepted = true;
        delete userToUpdate.roles;

        return this.usersService.createOrUpdateWithoutRelations(userToUpdate);
    }

    @Get('getConsultantStats')
    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.RH,
        RolesList.AdminTech,
    )
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'getConsultantStats',
        operationId: 'getConsultantStats',
    })
    @ApiResponse({
        status: 200,
        description: 'getConsultantStats',
        type: GetUserStatsResponse,
    })
    @HttpCode(200)
    async getConsultantStats(
        @Query('userId') userId: string,
    ): Promise<GetUserStatsResponse> {
        return await this.usersService.getConsultantStats(userId);
    }

    @UseGuards(RolesGuard)
    @Get('getConnectedConsultants')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'getConnectedConsultants',
        operationId: 'getConnectedConsultants',
    })
    @ApiResponse({
        status: 200,
        description: 'getConnectedConsultants',
        type: GetConnectedConsultantsResponse,
    })
    @HttpCode(200)
    async getConnectedConsultants(): Promise<GetConnectedConsultantsResponse> {
        return await this.usersService.getConnectedConsultants();
    }

    @UseGuards(RolesGuard)
    @Post('updateMyLanguage/:langCode')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'updateMyLanguage',
        operationId: 'updateMyLanguage',
    })
    @ApiResponse({
        status: 200,
        description: 'updateMyLanguage',
        type: GenericResponse,
    })
    @HttpCode(200)
    async updateMyLanguage(
        @Param('langCode') langCode: string,
    ): Promise<GenericResponse> {
        const response = new GenericResponse();

        try {
            if (!langCode) {
                throw new AppError('Invalid parameters');
            }

            const appLanguagesResponse =
                await this.referentialService.getAllLanguages();
            const appLanguage = appLanguagesResponse.languages.find(
                (x) => x.code === langCode,
            );

            if (appLanguage) {
                const payload = this.authToolsService.getCurrentPayload(false);

                await this.usersService
                    .getRepository()
                    .update({ id: payload.id }, { languageId: appLanguage.id });
                response.success = true;
            }
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }
}

@Controller('users-roles')
@ApiTags('users-roles')
export class UsersRolesController extends BaseController {
    constructor(private readonly userRoleService: UserRoleService) {
        super();
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @Get(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'get role detail', operationId: 'getUserRole' })
    @ApiResponse({
        status: 200,
        description: 'get roles response',
        type: GetUserRoleResponse,
    })
    @HttpCode(200)
    async getUserRole(@Param('id') id: string): Promise<GetUserRoleResponse> {
        return await this.userRoleService.findOne({ where: { id: id } });
    }

    @UseGuards(RolesGuard)
    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'get list of roles', operationId: 'getUserRoles' })
    @ApiResponse({
        status: 200,
        description: 'get roles response',
        type: GetUserRolesResponse,
    })
    @HttpCode(200)
    async getUserRoles(
        @Query() request: GetUserRolesRequest,
    ): Promise<GetUserRolesResponse> {
        const findOptions =
            BaseSearchRequest.getDefaultFindOptions<UserRole>(request);

        if (request.includeDisabled !== 'true') {
            findOptions.where = { enabled: true };
        }

        if (request.includeRights === 'true') {
            findOptions.relations = ['rights'];
        }

        return await this.userRoleService.findAll(findOptions);
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @Post()
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'createOrUpdateRole',
        operationId: 'createOrUpdateRole',
    })
    @ApiResponse({
        status: 200,
        description: 'get role response',
        type: GetUserRoleResponse,
    })
    @HttpCode(200)
    async createOrUpdateRole(
        @Body() userRole: UserRoleDto,
    ): Promise<GetUserRoleResponse> {
        return await this.userRoleService.createOrUpdate(userRole);
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @Delete()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete roles', operationId: 'deleteRoles' })
    @ApiResponse({
        status: 200,
        description: 'Delete roles',
        type: GenericResponse,
    })
    @HttpCode(200)
    async deleteRoles(@Query('ids') ids: string): Promise<GenericResponse> {
        return await this.userRoleService.delete(ids.split(','));
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @Post('archiveRoles')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Archive roles', operationId: 'archiveRoles' })
    @ApiResponse({
        status: 200,
        description: 'Archive roles',
        type: GenericResponse,
    })
    @HttpCode(200)
    async archiveRoles(@Query('ids') ids: string): Promise<GenericResponse> {
        return await this.userRoleService.archive(ids.split(','));
    }
}

@Controller('app-rights')
@ApiTags('app-rights')
export class AppRightsController extends BaseController {
    constructor(private readonly appRightsService: AppRightsService) {
        super();
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @Get()
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'get list of rights',
        operationId: 'getAppRights',
    })
    @ApiResponse({
        status: 200,
        description: 'get rights response',
        type: GetAppRightsResponse,
    })
    @HttpCode(200)
    async getAppRights(
        @Query() request: BaseSearchRequest,
    ): Promise<GetAppRightsResponse> {
        const findOptions =
            BaseSearchRequest.getDefaultFindOptions<AppRight>(request);

        return await this.appRightsService.findAll(findOptions);
    }
}
