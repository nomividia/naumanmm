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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
const path = require("path");
const typeorm_2 = require("typeorm");
const shared_constants_1 = require("../../shared/shared-constants");
const shared_service_1 = require("../../shared/shared-service");
const user_entity_1 = require("../entities/user.entity");
const environment_1 = require("../environment/environment");
const app_error_1 = require("../models/app-error");
const user_dto_1 = require("../models/dto/user-dto");
const base_search_requests_1 = require("../models/requests/base-search-requests");
const generic_response_1 = require("../models/responses/generic-response");
const candidates_service_1 = require("../modules/candidates/candidates.service");
const job_offers_service_1 = require("../modules/job-offers/job-offers.service");
const socket_data_1 = require("../sockets/socket-data");
const auth_custom_rules_1 = require("./auth-custom-rules");
const auth_tools_service_1 = require("./auth-tools.service");
const base_model_service_1 = require("./base-model.service");
const referential_service_1 = require("./referential.service");
const file_service_1 = require("./tools/file.service");
const helpers_service_1 = require("./tools/helpers.service");
const user_roles_service_1 = require("./user-roles.service");
let UsersService = class UsersService extends base_model_service_1.ApplicationBaseModelService {
    constructor(usersRepository, userRoleService, jwtService, fileService, candidateService, jobOfferService, referentialService) {
        super();
        this.usersRepository = usersRepository;
        this.userRoleService = userRoleService;
        this.jwtService = jwtService;
        this.fileService = fileService;
        this.candidateService = candidateService;
        this.jobOfferService = jobOfferService;
        this.referentialService = referentialService;
        this.modelOptions = {
            getManyResponse: user_dto_1.GetUsersResponse,
            getOneResponse: user_dto_1.GetUserResponse,
            getManyResponseField: 'users',
            getOneResponseField: 'user',
            repository: this.usersRepository,
            getManyRelations: ['roles', 'image', 'gender'],
            getOneRelations: ['roles', 'image', 'gender'],
            entity: user_entity_1.User,
            getManyRelationsLinq: [{ include: (x) => x.roles }],
            getOneRelationsLinq: [{ include: (x) => x.roles }],
            archiveField: 'disabled',
            archiveFieldValue: true,
        };
    }
    getUsers(request) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
            let response = new user_dto_1.GetUsersResponse();
            try {
                const findOptions = base_search_requests_1.BaseSearchRequest.getDefaultFindOptions(request, ['language']);
                let rolesList = [];
                if (!!((_a = request.roles) === null || _a === void 0 ? void 0 : _a.length)) {
                    const rolesCodesList = request.roles.split(',');
                    if (rolesCodesList.some((x) => !!x)) {
                        const rolesResponse = yield this.userRoleService.findAll({
                            where: { role: (0, typeorm_2.In)(rolesCodesList) },
                        });
                        if ((_b = rolesResponse.userRoles) === null || _b === void 0 ? void 0 : _b.length) {
                            rolesList = rolesResponse.userRoles;
                        }
                    }
                }
                let baseQuery = this.usersRepository.createQueryBuilder('users');
                if (request.includeImage === 'true') {
                    baseQuery = baseQuery.leftJoinAndSelect('users.image', 'image');
                }
                if (request.includeGender === 'true') {
                    baseQuery = baseQuery.leftJoinAndSelect('users.gender', 'gender');
                }
                if (request.includeCandidate === 'true') {
                    baseQuery = baseQuery.leftJoinAndSelect('users.candidate', 'candidate');
                    baseQuery = baseQuery.leftJoinAndSelect('candidate.files', 'files');
                    baseQuery = baseQuery.leftJoinAndSelect('files.file', 'file');
                    baseQuery = baseQuery.leftJoinAndSelect('files.fileType', 'fileType');
                }
                const parameters = {};
                if (rolesList === null || rolesList === void 0 ? void 0 : rolesList.length) {
                    parameters.roleIds = rolesList.map((x) => x.id);
                    baseQuery = baseQuery.innerJoinAndSelect('users.roles', 'userRole', 'userRole.id IN (:...roleIds)');
                }
                else if (request.includeRoles === 'true') {
                    baseQuery = baseQuery.leftJoinAndSelect('users.roles', 'userRole');
                }
                if (request.search) {
                    parameters.search = `%${request.search}%`;
                    baseQuery = baseQuery.andWhere('(users.userName LIKE :search OR users.firstName LIKE :search OR users.lastName LIKE :search OR CONCAT(users.firstName, " ",users.lastName) LIKE :search' +
                        ' OR CONCAT(users.lastName, " ",users.firstName) LIKE :search)');
                }
                if (request.includeDisabled !== 'true') {
                    baseQuery = baseQuery.andWhere('(users.disabled = 0)');
                }
                baseQuery.setParameters(parameters);
                if (request.order && request.orderby) {
                    baseQuery = baseQuery.orderBy('users.' + request.orderby, request.order.toUpperCase());
                }
                response.filteredResults = yield baseQuery.getCount();
                baseQuery = baseQuery.skip(findOptions.skip).take(findOptions.take);
                const users = yield baseQuery.getMany();
                response.users = users.map((x) => x.toDto());
                const userIds = response.users.map((x) => x.id);
                if ((userIds === null || userIds === void 0 ? void 0 : userIds.length) && request.includeRoles === 'true') {
                    const manager = (0, typeorm_2.getManager)();
                    const userRolesRelations = (yield manager.query('select * from user_roles where usersId IN (?);', [userIds]));
                    if (userRolesRelations === null || userRolesRelations === void 0 ? void 0 : userRolesRelations.length) {
                        const userRolesList = yield this.userRoleService.findAll({
                            where: {
                                id: (0, typeorm_2.In)(userRolesRelations.map((x) => x.rolesId)),
                            },
                        });
                        if ((_c = userRolesList.userRoles) === null || _c === void 0 ? void 0 : _c.length) {
                            for (const userRolesRelation of userRolesRelations) {
                                const user = response.users.find((x) => x.id === userRolesRelation.usersId);
                                if (user &&
                                    !user.roles.some((x) => x.id === userRolesRelation.rolesId)) {
                                    const userRoleDto = userRolesList.userRoles.find((x) => x.id === userRolesRelation.rolesId);
                                    if (userRoleDto) {
                                        user.roles.push(userRoleDto);
                                    }
                                }
                            }
                        }
                    }
                }
                if ((_d = response.users) === null || _d === void 0 ? void 0 : _d.length) {
                    for (const user of response.users) {
                        if ((_f = (_e = user.candidate) === null || _e === void 0 ? void 0 : _e.files) === null || _f === void 0 ? void 0 : _f.length) {
                            const mainPhotoFile = (_g = user.candidate.files.find((x) => x.fileType &&
                                x.fileType.code === shared_constants_1.CandidateFileType.MainPhoto)) === null || _g === void 0 ? void 0 : _g.file;
                            if (mainPhotoFile) {
                                user.image = mainPhotoFile;
                            }
                        }
                    }
                }
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    findOne(conditions, getPassword = false) {
        const _super = Object.create(null, {
            findOne: { get: () => super.findOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.findOne.call(this, conditions, getPassword);
        });
    }
    generateUserNameFromUser(user) {
        var _a;
        let userName = nextalys_js_helpers_1.MainHelpers.formatToUrl((user.firstName ? user.firstName + '-' : '') +
            ((_a = user.lastName) !== null && _a !== void 0 ? _a : ''));
        if (!userName)
            userName = nextalys_js_helpers_1.MainHelpers.formatToUrl(user.mail);
        if (userName && userName.endsWith('-'))
            userName = userName.substring(0, userName.length - 1);
        if (userName && userName.length > 30) {
            userName = userName.substring(0, 30);
        }
        return userName;
    }
    createOrUpdate(user, mustGenerateToken = false, currentPayload = null) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new user_dto_1.GetUserResponse();
            try {
                let userEntity = yield this.usersRepository.findOne({
                    id: user.id,
                });
                if (!userEntity) {
                    userEntity = new user_entity_1.User();
                }
                if (user.password) {
                    userEntity.password = yield helpers_service_1.ApiMainHelpers.hashPassword(user.password);
                }
                if (user.id) {
                    yield this.fileService.handleFileUpload(userEntity, user, 'image', path.join(environment_1.Environment.UserPublicFilesDirectory, user.id));
                }
                for (const userRolesRule of auth_custom_rules_1.userRolesRules) {
                    if (((_a = user === null || user === void 0 ? void 0 : user.roles) === null || _a === void 0 ? void 0 : _a.some((x) => x.role === userRolesRule.roleToAdd)) &&
                        !shared_service_1.SharedService.userHasOneOfRoles(currentPayload, userRolesRule.allowedRoles)) {
                        user.roles = user.roles.filter((x) => x.role !== userRolesRule.roleToAdd);
                    }
                }
                userEntity.fromDto(user);
                if ((_b = userEntity === null || userEntity === void 0 ? void 0 : userEntity.roles) === null || _b === void 0 ? void 0 : _b.length) {
                    for (const role of userEntity.roles) {
                        const roleResponse = yield this.userRoleService.findOne({
                            where: { role: role.role },
                        });
                        if (roleResponse.success && roleResponse.userRole) {
                            role.id = roleResponse.userRole.id;
                        }
                    }
                }
                if (!userEntity.userName) {
                    let userName = this.generateUserNameFromUser(user);
                    if (!userName) {
                        throw new app_error_1.AppErrorWithMessage("Impossible de générer le nom d'utilisateur !");
                    }
                    const usersWithSameUserName = yield this.usersRepository.find({
                        where: { userName: userName },
                        select: ['userName'],
                    });
                    if (usersWithSameUserName.length) {
                        let userNameTmp = userName;
                        let userNameSuffixCount = 2;
                        while (usersWithSameUserName.some((x) => x.userName === userNameTmp)) {
                            userNameTmp = userName + '-' + userNameSuffixCount;
                            userNameSuffixCount++;
                        }
                        userName = userNameTmp;
                    }
                    userEntity.userName = userName;
                }
                userEntity = yield this.usersRepository.save(userEntity);
                const getUserResponse = yield this.findOne({
                    where: { id: userEntity.id },
                });
                if (getUserResponse.success && getUserResponse.user) {
                    response.user = getUserResponse.user;
                }
                if (mustGenerateToken) {
                    response.token = auth_tools_service_1.AuthToolsService.createUserToken(this.jwtService, response.user);
                }
                response.success = true;
            }
            catch (err) {
                if (err &&
                    err.message &&
                    err.message.indexOf('Duplicate entry') !== -1) {
                    err = new app_error_1.AppErrorWithMessage('Cet identifiant utilisateur est déjà utilisé !');
                }
                response.handleError(err);
            }
            return response;
        });
    }
    getConsultantStats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new user_dto_1.GetUserStatsResponse();
            try {
                const appValueResponse = yield this.referentialService.getOneAppValue(shared_constants_1.CandidateStatus.Placed);
                response.candidatePlaced = yield this.candidateService
                    .getRepository()
                    .count({
                    where: {
                        consultantId: userId,
                        candidateStatusId: appValueResponse.appValue.id,
                    },
                });
                response.jobOfferLinked = yield this.jobOfferService
                    .getRepository()
                    .count({ where: { consultantId: userId, disabled: false } });
                response.candidateLinked = yield this.candidateService
                    .getRepository()
                    .count({ where: { consultantId: userId } });
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    getConnectedConsultants() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new user_dto_1.GetConnectedConsultantsResponse();
            try {
                const connectionsList = socket_data_1.SocketData.UserConnectionsList;
                if (!(connectionsList === null || connectionsList === void 0 ? void 0 : connectionsList.length)) {
                    response.success = true;
                    return response;
                }
                const usersResponse = yield this.usersRepository.find({
                    where: {
                        id: (0, typeorm_2.In)(connectionsList
                            .filter((z) => { var _a; return !!((_a = z.connections) === null || _a === void 0 ? void 0 : _a.length); })
                            .map((x) => x.userId)),
                    },
                    select: ['id'],
                    relations: ['roles'],
                });
                if (usersResponse === null || usersResponse === void 0 ? void 0 : usersResponse.length) {
                    response.connectedConsultants = usersResponse.filter((x) => x.roles.some((y) => y.role === shared_constants_1.RolesList.Consultant)).length;
                }
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    setUsersLanguagesJob() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                const getLanguagesResponse = yield this.referentialService.getAllLanguages();
                const languageFR = getLanguagesResponse.languages.find((x) => x.code === 'fr');
                const languageEN = getLanguagesResponse.languages.find((x) => x.code === 'en');
                const maxUpdate = 6000;
                const users = yield this.usersRepository.find({
                    where: { languageId: (0, typeorm_2.IsNull)(), candidateId: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()) },
                    relations: ['candidate', 'candidate.addresses'],
                    order: { creationDate: 'DESC' },
                });
                let index = 0;
                for (const user of users) {
                    const candidateAdresse = (_b = (_a = user.candidate) === null || _a === void 0 ? void 0 : _a.addresses) === null || _b === void 0 ? void 0 : _b[0];
                    if (!(candidateAdresse === null || candidateAdresse === void 0 ? void 0 : candidateAdresse.country) ||
                        candidateAdresse.country.toLowerCase() === 'fr') {
                        user.languageId = languageFR.id;
                    }
                    else {
                        user.languageId = languageEN.id;
                    }
                    yield this.usersRepository.update({ id: user.id }, { languageId: user.languageId });
                    index++;
                    if (index >= maxUpdate) {
                        break;
                    }
                }
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => candidates_service_1.CandidateService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => job_offers_service_1.JobOfferService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_roles_service_1.UserRoleService,
        jwt_1.JwtService,
        file_service_1.FileService,
        candidates_service_1.CandidateService,
        job_offers_service_1.JobOfferService,
        referential_service_1.ReferentialService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map