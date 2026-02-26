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
exports.ReferentialController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
const typeorm_1 = require("typeorm");
const shared_constants_1 = require("../../shared/shared-constants");
const app_type_dto_1 = require("../models/dto/app-type-dto");
const app_value_dto_1 = require("../models/dto/app-value-dto");
const base_search_requests_1 = require("../models/requests/base-search-requests");
const generic_response_1 = require("../models/responses/generic-response");
const languages_responses_1 = require("../models/responses/languages-responses");
const log_file_responses_1 = require("../models/responses/log-file.responses");
const auth_tools_service_1 = require("../services/auth-tools.service");
const roles_guard_1 = require("../services/guards/roles-guard");
const referential_service_1 = require("../services/referential.service");
const roles_decorator_1 = require("../services/roles.decorator");
const logger_service_1 = require("../services/tools/logger.service");
const base_controller_1 = require("../shared/base.controller");
let ReferentialController = class ReferentialController extends base_controller_1.BaseController {
    constructor(referentialService, appLogger, authToolsService) {
        super();
        this.referentialService = referentialService;
        this.appLogger = appLogger;
        this.authToolsService = authToolsService;
    }
    getAppTypes(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOptions = base_search_requests_1.BaseSearchRequest.getDefaultFindOptions(request);
            if (request.search) {
                findOptions.where = {
                    label: (0, typeorm_1.Like)('%' + request.search + '%'),
                };
            }
            return yield this.referentialService.getAllAppTypes(findOptions);
        });
    }
    getOneAppType(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.referentialService.getOneAppType(request.id, this.authToolsService.getCurrentPayload(false), request.includeDisabled === 'true');
        });
    }
    getTypeValues(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.referentialService.getTypeValues(request);
        });
    }
    getMultipleTypeValues(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.referentialService.getMultipleTypeValues(request);
        });
    }
    insertOrUpdateAppValue(appValueDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.referentialService.insertOrUpdateAppValue(appValueDto);
        });
    }
    insertOrUpdateAppType(appTypeDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.referentialService.insertOrUpdateAppType(appTypeDto, true, true);
        });
    }
    getAllLanguages() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.referentialService.getAllLanguages();
        });
    }
    getLogFileContent(date, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new log_file_responses_1.GetLogFileContentResponse();
            try {
                response.content = (yield this.appLogger.getLogFileContent(date, type, true));
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    downloadLogFile(date, type, dl, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                if (!date || !type) {
                    res.status(common_1.HttpStatus.NOT_FOUND).send('Fichier introuvable');
                    return response;
                }
                const data = (yield this.appLogger.getLogFileContent(date, type, false));
                const dateObj = nextalys_js_helpers_1.DateHelpers.toUtcDate(nextalys_js_helpers_1.DateHelpers.parseDateTimeFromISO8601Format(date));
                const logFileName = this.appLogger.getLogFileName(dateObj, type, false);
                if (data) {
                    res.header('Content-Type', 'text/plain');
                    if (dl === '0') {
                        res.header('Content-Disposition', `inline; filename="${logFileName}"`);
                    }
                    else {
                        res.header('Content-Disposition', `attachment; filename="${logFileName}"`);
                    }
                    res.status(common_1.HttpStatus.OK).send(data);
                }
                else {
                    res.status(common_1.HttpStatus.NOT_FOUND).send('Fichier introuvable');
                }
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    removeLogFile(date, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                yield this.appLogger.removeLogFile(date, type);
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    removeAppValues(request) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = new generic_response_1.GenericResponse();
            try {
                response = yield this.referentialService.removeAppValues(request.ids, request.codes);
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    disableAppValues(request) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = new generic_response_1.GenericResponse();
            try {
                response = yield this.referentialService.disableAppValues(request.ids, request.codes);
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    deleteAppValues(request) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = new generic_response_1.GenericResponse();
            try {
                response = yield this.referentialService.removeAppValues(request.ids, request.codes);
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
};
__decorate([
    (0, common_1.Get)('getAppTypes'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all types', operationId: 'getAppTypes' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of app types',
        type: app_type_dto_1.GetAppTypesResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_search_requests_1.BaseSearchRequest]),
    __metadata("design:returntype", Promise)
], ReferentialController.prototype, "getAppTypes", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('getOneAppType'),
    (0, swagger_1.ApiOperation)({ summary: 'Get App Type', operationId: 'getOneAppType' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'App Type',
        type: app_type_dto_1.GetAppTypeResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [app_type_dto_1.GetAppTypeRequest]),
    __metadata("design:returntype", Promise)
], ReferentialController.prototype, "getOneAppType", null);
__decorate([
    (0, common_1.Get)('getTypeValues'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get values of a type',
        operationId: 'getTypeValues',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of type values',
        type: app_type_dto_1.GetAppTypeResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [app_type_dto_1.GetTypeValuesRequest]),
    __metadata("design:returntype", Promise)
], ReferentialController.prototype, "getTypeValues", null);
__decorate([
    (0, common_1.Get)('getMultipleTypeValues'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get values of a type',
        operationId: 'getMultipleTypeValues',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of type values',
        type: app_type_dto_1.GetAppTypesResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [app_type_dto_1.FindAppTypesRequest]),
    __metadata("design:returntype", Promise)
], ReferentialController.prototype, "getMultipleTypeValues", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('insertOrUpdateAppValue'),
    (0, swagger_1.ApiOperation)({
        summary: 'insert or update App Value',
        operationId: 'insertOrUpdateAppValue',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'App Value',
        type: app_value_dto_1.GetAppValueResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [app_value_dto_1.AppValueDto]),
    __metadata("design:returntype", Promise)
], ReferentialController.prototype, "insertOrUpdateAppValue", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('insertOrUpdateAppType'),
    (0, swagger_1.ApiOperation)({
        summary: 'insert or update App Type',
        operationId: 'insertOrUpdateAppType',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'App Type',
        type: app_type_dto_1.GetAppTypeResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [app_type_dto_1.AppTypeDto]),
    __metadata("design:returntype", Promise)
], ReferentialController.prototype, "insertOrUpdateAppType", null);
__decorate([
    (0, common_1.Get)('getAllLanguages'),
    (0, swagger_1.ApiOperation)({
        summary: 'get All Languages',
        operationId: 'getAllLanguages',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Languages',
        type: languages_responses_1.GetLanguagesResponse,
    }),
    (0, common_1.HttpCode)(200),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReferentialController.prototype, "getAllLanguages", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.AdminTech),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('getLogFileContent'),
    (0, swagger_1.ApiOperation)({
        summary: 'get log file content',
        operationId: 'getLogFileContent',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Log file content',
        type: log_file_responses_1.GetLogFileContentResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReferentialController.prototype, "getLogFileContent", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.AdminTech),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('downloadLogFile'),
    (0, swagger_1.ApiOperation)({
        summary: 'downloadLogFile',
        operationId: 'downloadLogFile',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'downloadLogFile', type: Object }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('dl')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ReferentialController.prototype, "downloadLogFile", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.AdminTech),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('removeLogFile'),
    (0, swagger_1.ApiOperation)({ summary: 'remove log file', operationId: 'removeLogFile' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'generic response',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReferentialController.prototype, "removeLogFile", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('removeAppValues'),
    (0, swagger_1.ApiOperation)({
        summary: 'remove App Values',
        operationId: 'removeAppValues',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'generic response',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [app_value_dto_1.MultipleAppValuesRequest]),
    __metadata("design:returntype", Promise)
], ReferentialController.prototype, "removeAppValues", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('disableAppValues'),
    (0, swagger_1.ApiOperation)({
        summary: 'disable App Values',
        operationId: 'disableAppValues',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'generic response',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [app_value_dto_1.MultipleAppValuesRequest]),
    __metadata("design:returntype", Promise)
], ReferentialController.prototype, "disableAppValues", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.AdminTech),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('deleteAppValues'),
    (0, swagger_1.ApiOperation)({
        summary: 'deleteAppValues',
        operationId: 'deleteAppValues',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'generic response',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [app_value_dto_1.MultipleAppValuesRequest]),
    __metadata("design:returntype", Promise)
], ReferentialController.prototype, "deleteAppValues", null);
ReferentialController = __decorate([
    (0, common_1.Controller)('referential'),
    (0, swagger_1.ApiTags)('referential'),
    __metadata("design:paramtypes", [referential_service_1.ReferentialService,
        logger_service_1.AppLogger,
        auth_tools_service_1.AuthToolsService])
], ReferentialController);
exports.ReferentialController = ReferentialController;
//# sourceMappingURL=referential.controller.js.map