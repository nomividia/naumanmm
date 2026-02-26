"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRightsController = exports.UsersRolesController = exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const typeorm_linq_repository_1 = require("typeorm-linq-repository");
const shared_constants_1 = require("../../shared/shared-constants");
const shared_service_1 = require("../../shared/shared-service");
const user_entity_1 = require("../entities/user.entity");
const app_error_1 = require("../models/app-error");
const app_right_dto_1 = require("../models/dto/app-right-dto");
const user_dto_1 = require("../models/dto/user-dto");
const user_role_dto_1 = require("../models/dto/user-role-dto");
const base_search_requests_1 = require("../models/requests/base-search-requests");
const user_requests_1 = require("../models/requests/user-requests");
const generic_response_1 = require("../models/responses/generic-response");
const app_rights_service_1 = require("../services/app-rights.service");
const auth_tools_service_1 = require("../services/auth-tools.service");
const roles_guard_1 = require("../services/guards/roles-guard");
const referential_service_1 = require("../services/referential.service");
const roles_decorator_1 = require("../services/roles.decorator");
const user_roles_service_1 = require("../services/user-roles.service");
const users_service_1 = require("../services/users.service");
const base_controller_1 = require("../shared/base.controller");
let UsersController = class UsersController extends base_controller_1.BaseController {
    constructor(usersService, authToolsService, referentialService) {
        super();
        this.usersService = usersService;
        this.authToolsService = authToolsService;
        this.referentialService = referentialService;
    }
    get(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUserPayload = this.authToolsService.getCurrentPayload(false);
            const isAdmin = shared_service_1.SharedService.userIsAdmin(currentUserPayload);
            const isConsultant = shared_service_1.SharedService.userIsConsultant(currentUserPayload);
            const isAdminTech = shared_service_1.SharedService.userIsAdminTech(currentUserPayload);
            const isRH = shared_service_1.SharedService.userIsRH(currentUserPayload);
            if (!isAdmin &&
                !isConsultant &&
                !isAdminTech &&
                !isRH &&
                currentUserPayload.userName !== userName) {
                throw new common_1.ForbiddenException('Forbidden');
            }
            const query = new typeorm_linq_repository_1.LinqRepository(user_entity_1.User)
                .getOne()
                .where((x) => x.userName)
                .equal(userName);
            return yield this.usersService.findOne({
                query,
                relations: [
                    { include: (x) => x.language },
                    { include: (x) => x.pushSubscriptions },
                    { include: (x) => x.translations },
                    { include: (x) => x.image },
                    { include: (x) => x.gender },
                ],
            }, false);
        });
    }
    getAll(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.usersService.getUsers(request);
        });
    }
    createOrUpdate(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let getUserResponse = new user_dto_1.GetUserResponse();
            try {
                if (!user) {
                    throw new app_error_1.AppErrorWithMessage('Requête invalide !');
                }
                const payload = this.authToolsService.getCurrentPayload(false);
                if (!shared_service_1.SharedService.userIsAdmin(payload) &&
                    !shared_service_1.SharedService.userIsConsultant(payload) &&
                    !shared_service_1.SharedService.userIsAdminTech(payload) &&
                    payload.id !== user.id) {
                    throw new app_error_1.AppErrorWithMessage("Vous n'avez pas l'autorisation de faire cela.", 403);
                }
                let mustGenerateToken = false;
                if (payload && user && payload.id === user.id) {
                    mustGenerateToken = true;
                }
                if (!user.id) {
                    user.roles = [{ role: shared_constants_1.RolesList.Consultant, enabled: true }];
                }
                getUserResponse = yield this.usersService.createOrUpdate(user, mustGenerateToken, payload);
            }
            catch (err) {
                getUserResponse.handleError(err);
            }
            return getUserResponse;
        });
    }
    updateMyUserProfile(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let getUserResponse = new user_dto_1.GetUserResponse();
            try {
                if (!user) {
                    throw new app_error_1.AppErrorWithMessage('Requête invalide !');
                }
                const payload = this.authToolsService.getCurrentPayload(false);
                if (payload.id !== user.id) {
                    throw new app_error_1.AppErrorWithMessage("Vous n'avez pas l'autorisation de faire cela.", 403);
                }
                getUserResponse = yield this.usersService.createOrUpdate(user, true, payload);
            }
            catch (err) {
                getUserResponse.handleError(err);
            }
            return getUserResponse;
        });
    }
    deleteUsers(userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.usersService.delete(userIds.split(','));
        });
    }
    archiveUsers(userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.usersService.archive(userIds.split(','));
        });
    }
    hasUserAcceptedTOS() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new user_dto_1.GetHasUserAcceptedTOSResponse();
            try {
                const payload = this.authToolsService.getCurrentPayload(false);
                if (!(payload === null || payload === void 0 ? void 0 : payload.id)) {
                    throw new app_error_1.AppErrorWithMessage('Unable to find user');
                }
                const getUserResponse = yield this.usersService.findOne({
                    where: { id: payload.id },
                });
                response.hasAcceptedTOS = (_a = getUserResponse.user.TOSAccepted) !== null && _a !== void 0 ? _a : false;
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    acceptTOS() {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = this.authToolsService.getCurrentPayload(false);
            if (!(payload === null || payload === void 0 ? void 0 : payload.id)) {
                throw new app_error_1.AppErrorWithMessage('Unable to find user');
            }
            const getResponse = yield this.usersService.findOne({
                where: { id: payload.id },
            });
            const userToUpdate = getResponse.user;
            userToUpdate.TOSAccepted = true;
            delete userToUpdate.roles;
            return this.usersService.createOrUpdateWithoutRelations(userToUpdate);
        });
    }
    getConsultantStats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.usersService.getConsultantStats(userId);
        });
    }
    getConnectedConsultants() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.usersService.getConnectedConsultants();
        });
    }
    updateMyLanguage(langCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                if (!langCode) {
                    throw new app_error_1.AppError('Invalid parameters');
                }
                const appLanguagesResponse = yield this.referentialService.getAllLanguages();
                const appLanguage = appLanguagesResponse.languages.find((x) => x.code === langCode);
                if (appLanguage) {
                    const payload = this.authToolsService.getCurrentPayload(false);
                    yield this.usersService
                        .getRepository()
                        .update({ id: payload.id }, { languageId: appLanguage.id });
                    response.success = true;
                }
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
};
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH, shared_constants_1.RolesList.Candidate),
    (0, common_1.Get)('get/:userName'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user', operationId: 'getUser' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get user',
        type: user_dto_1.GetUserResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('userName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "get", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users', operationId: 'getAllUsers' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get all users',
        type: user_dto_1.GetUsersResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_requests_1.FindUsersRequest]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAll", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create or update user',
        operationId: 'createOrUpdateUser',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Create or update user',
        type: user_dto_1.GetUserResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createOrUpdate", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Post)('updateMyUserProfile'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'updateMyUserProfile',
        operationId: 'updateMyUserProfile',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'updateMyUserProfile',
        type: user_dto_1.GetUserResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateMyUserProfile", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin),
    (0, common_1.Delete)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete users', operationId: 'deleteUsers' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Delete users from ID',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)('userIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUsers", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Post)('archiveUsers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Archive user', operationId: 'archiveUsers' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Archive users from ID',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)('userIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "archiveUsers", null);
__decorate([
    (0, common_1.Get)('hasUserAcceptedTOS'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Candidate),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'has user accepted TOS',
        operationId: 'hasUserAcceptedTOS',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'has user accepted TOS',
        type: user_dto_1.GetHasUserAcceptedTOSResponse,
    }),
    (0, common_1.HttpCode)(200),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "hasUserAcceptedTOS", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Candidate),
    (0, common_1.Post)('acceptTOS'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'accept therm of use', operationId: 'acceptTOS' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'accept therm of use',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "acceptTOS", null);
__decorate([
    (0, common_1.Get)('getConsultantStats'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.RH, shared_constants_1.RolesList.AdminTech),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'getConsultantStats',
        operationId: 'getConsultantStats',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'getConsultantStats',
        type: user_dto_1.GetUserStatsResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getConsultantStats", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Get)('getConnectedConsultants'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'getConnectedConsultants',
        operationId: 'getConnectedConsultants',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'getConnectedConsultants',
        type: user_dto_1.GetConnectedConsultantsResponse,
    }),
    (0, common_1.HttpCode)(200),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getConnectedConsultants", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Post)('updateMyLanguage/:langCode'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'updateMyLanguage',
        operationId: 'updateMyLanguage',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'updateMyLanguage',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('langCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateMyLanguage", null);
UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, swagger_1.ApiTags)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        auth_tools_service_1.AuthToolsService,
        referential_service_1.ReferentialService])
], UsersController);
exports.UsersController = UsersController;
let UsersRolesController = class UsersRolesController extends base_controller_1.BaseController {
    constructor(userRoleService) {
        super();
        this.userRoleService = userRoleService;
    }
    getUserRole(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRoleService.findOne({ where: { id: id } });
        });
    }
    getUserRoles(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOptions = base_search_requests_1.BaseSearchRequest.getDefaultFindOptions(request);
            if (request.includeDisabled !== 'true') {
                findOptions.where = { enabled: true };
            }
            if (request.includeRights === 'true') {
                findOptions.relations = ['rights'];
            }
            return yield this.userRoleService.findAll(findOptions);
        });
    }
    createOrUpdateRole(userRole) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRoleService.createOrUpdate(userRole);
        });
    }
    deleteRoles(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRoleService.delete(ids.split(','));
        });
    }
    archiveRoles(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRoleService.archive(ids.split(','));
        });
    }
};
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'get role detail', operationId: 'getUserRole' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'get roles response',
        type: user_role_dto_1.GetUserRoleResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersRolesController.prototype, "getUserRole", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'get list of roles', operationId: 'getUserRoles' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'get roles response',
        type: user_role_dto_1.GetUserRolesResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_requests_1.GetUserRolesRequest]),
    __metadata("design:returntype", Promise)
], UsersRolesController.prototype, "getUserRoles", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin),
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'createOrUpdateRole',
        operationId: 'createOrUpdateRole',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'get role response',
        type: user_role_dto_1.GetUserRoleResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_role_dto_1.UserRoleDto]),
    __metadata("design:returntype", Promise)
], UsersRolesController.prototype, "createOrUpdateRole", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin),
    (0, common_1.Delete)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete roles', operationId: 'deleteRoles' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Delete roles',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersRolesController.prototype, "deleteRoles", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin),
    (0, common_1.Post)('archiveRoles'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Archive roles', operationId: 'archiveRoles' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Archive roles',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersRolesController.prototype, "archiveRoles", null);
UsersRolesController = __decorate([
    (0, common_1.Controller)('users-roles'),
    (0, swagger_1.ApiTags)('users-roles'),
    __metadata("design:paramtypes", [user_roles_service_1.UserRoleService])
], UsersRolesController);
exports.UsersRolesController = UsersRolesController;
let AppRightsController = class AppRightsController extends base_controller_1.BaseController {
    constructor(appRightsService) {
        super();
        this.appRightsService = appRightsService;
    }
    getAppRights(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOptions = base_search_requests_1.BaseSearchRequest.getDefaultFindOptions(request);
            return yield this.appRightsService.findAll(findOptions);
        });
    }
};
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin),
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'get list of rights',
        operationId: 'getAppRights',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'get rights response',
        type: app_right_dto_1.GetAppRightsResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_search_requests_1.BaseSearchRequest]),
    __metadata("design:returntype", Promise)
], AppRightsController.prototype, "getAppRights", null);
AppRightsController = __decorate([
    (0, common_1.Controller)('app-rights'),
    (0, swagger_1.ApiTags)('app-rights'),
    __metadata("design:paramtypes", [app_rights_service_1.AppRightsService])
], AppRightsController);
exports.AppRightsController = AppRightsController;
//# sourceMappingURL=users.controller.js.map