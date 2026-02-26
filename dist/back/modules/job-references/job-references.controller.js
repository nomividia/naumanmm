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
exports.JobReferencesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shared_constants_1 = require("../../../shared/shared-constants");
const app_error_1 = require("../../models/app-error");
const base_search_requests_1 = require("../../models/requests/base-search-requests");
const generic_response_1 = require("../../models/responses/generic-response");
const roles_guard_1 = require("../../services/guards/roles-guard");
const roles_decorator_1 = require("../../services/roles.decorator");
const base_controller_1 = require("../../shared/base.controller");
const job_reference_dto_1 = require("./job-reference-dto");
const job_references_service_1 = require("./job-references.service");
let JobReferencesController = class JobReferencesController extends base_controller_1.BaseController {
    constructor(jobReferencesService) {
        super();
        this.jobReferencesService = jobReferencesService;
    }
    createOrUpdate(jobReferenceDto) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!jobReferenceDto) {
                throw new app_error_1.AppErrorWithMessage('Invalid Request');
            }
            if (jobReferenceDto.disabled === null) {
                jobReferenceDto.disabled = false;
            }
            if (jobReferenceDto.jobReferenceId) {
                jobReferenceDto.id = jobReferenceDto.jobReferenceId;
            }
            return yield this.jobReferencesService.createOrUpdate(jobReferenceDto);
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.jobReferencesService.findOne({ where: { id: id } });
        });
    }
    getAll(request) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const findOptions = base_search_requests_1.BaseSearchRequest.getDefaultFindOptions(request);
            const response = new job_reference_dto_1.GetJobReferencesDistinctResponse(true);
            try {
                const repo = this.jobReferencesService.getRepository();
                const tableName = repo.metadata.tableName;
                let customSQLRequestDisabled = '';
                let customSQLRequestCountryCode = '';
                let customSQLRequestIsCompany = '';
                let customSQLRequestIsPrivatePerson = '';
                let customSQLRequestSearch = '';
                if (request.disabled === 'false') {
                    customSQLRequestDisabled =
                        ' WHERE `' + tableName + '`.disabled = 0 ';
                }
                else {
                    customSQLRequestDisabled =
                        ' WHERE (`' +
                            tableName +
                            '`.disabled = 0 OR `' +
                            tableName +
                            '`.disabled = 1)';
                }
                if (request.search) {
                    customSQLRequestSearch =
                        ' AND (`' +
                            tableName +
                            "`.companyName LIKE '%" +
                            request.search +
                            "%' OR `" +
                            tableName +
                            "`.privatePersonLastName LIKE '%" +
                            request.search +
                            "%' OR `" +
                            tableName +
                            "`.privatePersonFirstName LIKE '%" +
                            request.search +
                            "%')";
                }
                if (request.countriesCodes) {
                    customSQLRequestCountryCode =
                        " AND address.country IN ('" +
                            request.countriesCodes.split(',') +
                            "')";
                }
                if (request.isCompany === 'true' &&
                    request.isPrivatePerson === 'false') {
                    customSQLRequestIsCompany =
                        ' AND `' + tableName + '`.isCompany = 1';
                }
                if (request.isPrivatePerson === 'true' &&
                    request.isCompany === 'false') {
                    customSQLRequestIsPrivatePerson =
                        ' AND `' + tableName + '`.isPrivatePerson = 1';
                }
                let selectQuery = `SELECT DISTINCT TRIM(privatePersonFirstName) as privatePersonFirstName,TRIM(privatePersonLastName) as privatePersonLastName,TRIM(companyName) as companyName, address.country`;
                let countQuery = 'SELECT COUNT(`' + tableName + '`.id) as totalResults';
                const query = ` FROM ` +
                    '`' +
                    tableName +
                    '`' +
                    ' LEFT JOIN address ON address.jobReferenceId=`' +
                    tableName +
                    '`.id ' +
                    customSQLRequestDisabled +
                    customSQLRequestSearch +
                    customSQLRequestCountryCode +
                    customSQLRequestIsPrivatePerson +
                    customSQLRequestIsCompany;
                selectQuery += query;
                countQuery += query;
                const results = yield repo.query(selectQuery +
                    ' LIMIT ' +
                    findOptions.skip +
                    ',' +
                    findOptions.take);
                const countQueryResults = yield repo.query(countQuery);
                response.filteredResults =
                    ((_a = countQueryResults === null || countQueryResults === void 0 ? void 0 : countQueryResults[0]) === null || _a === void 0 ? void 0 : _a.totalResults) || 0;
                response.jobReferences = results;
                response.success = true;
            }
            catch (error) {
                response.handleError(error);
            }
            return response;
        });
    }
    getAllJobRefDetails(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new job_reference_dto_1.GetJobReferencesDetailsDtoResponse();
            const findOptions = base_search_requests_1.BaseSearchRequest.getDefaultFindOptions(request);
            try {
                const repo = this.jobReferencesService.getRepository();
                const tableName = repo.metadata.tableName;
                let customSQLRequestName;
                let customSQLRequestCountry = '';
                let customSQLRequestDisabled = '';
                if (request.company) {
                    customSQLRequestName =
                        " WHERE `companyName` = '" + request.company + "'";
                }
                if (request.firstName || request.lastName) {
                    customSQLRequestName =
                        " WHERE `privatePersonLastName` = '" +
                            request.lastName +
                            "' AND `privatePersonFirstName` = '" +
                            request.firstName +
                            "'";
                }
                if (request.disabled === 'true') {
                    customSQLRequestDisabled =
                        ' AND `' + tableName + '`.disabled = true';
                }
                if (request.disabled === 'false') {
                    customSQLRequestDisabled =
                        ' AND `' + tableName + '`.disabled = false';
                }
                if (request.country) {
                    customSQLRequestCountry =
                        " AND address.country = '" + request.country + "'";
                }
                const query = 'SELECT *,`' +
                    tableName +
                    '`.id as id, `' +
                    tableName +
                    '`.disabled as disabled,`candidate-jobs`.candidateId as candidateIdFromJobs, `' +
                    tableName +
                    '`.id AS jobRefId, `app_values`.label AS functionLabel FROM ' +
                    '`' +
                    tableName +
                    '`' +
                    ' LEFT JOIN `address` ON `address`.jobReferenceId = `' +
                    tableName +
                    '`.id' +
                    ' LEFT JOIN `candidate-jobs` ON `candidate-jobs`.jobReferenceId = `' +
                    tableName +
                    '`.id' +
                    ' LEFT JOIN `app_values` ON `app_values`.id = `' +
                    tableName +
                    '`.jobRefFunctionId' +
                    customSQLRequestName +
                    customSQLRequestDisabled +
                    customSQLRequestCountry +
                    ' LIMIT ' +
                    findOptions.skip +
                    ',' +
                    findOptions.take;
                const results = yield repo.query(query);
                response.jobReferences = results;
                response.success = true;
            }
            catch (error) {
                response.handleError(error);
            }
            return response;
        });
    }
    archive(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.jobReferencesService.archive(ids);
        });
    }
};
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.Candidate, shared_constants_1.RolesList.RH),
    (0, common_1.Post)('createOrUpdate'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create or update job reference',
        operationId: 'createOrUpdateJobReference',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Create or update job reference',
        type: job_reference_dto_1.GetJobReferenceResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [job_reference_dto_1.JobReferenceDto]),
    __metadata("design:returntype", Promise)
], JobReferencesController.prototype, "createOrUpdate", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.Candidate, shared_constants_1.RolesList.RH),
    (0, common_1.Get)('get/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get job reference',
        operationId: 'getJobReference',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get job offer',
        type: job_reference_dto_1.GetJobReferenceResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JobReferencesController.prototype, "get", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.Admin),
    (0, common_1.Get)('getAll'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all job references distinct',
        operationId: 'getAllJobReferences',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get All Job References distinct',
        type: job_reference_dto_1.GetJobReferencesDistinctResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [job_reference_dto_1.GetJobReferencesDistinctRequest]),
    __metadata("design:returntype", Promise)
], JobReferencesController.prototype, "getAll", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.Admin),
    (0, common_1.Get)('getAllJobRefDetails'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all job references details',
        operationId: 'getAllJobReferencesDetails',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get All Job References details',
        type: job_reference_dto_1.GetJobReferencesDetailsDtoResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [job_reference_dto_1.GetJobReferencesDetailsRequest]),
    __metadata("design:returntype", Promise)
], JobReferencesController.prototype, "getAllJobRefDetails", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.AdminTech),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('archiveJobReferences'),
    (0, swagger_1.ApiOperation)({
        summary: 'Archive job references',
        operationId: 'archiveJobReferences',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Archive job references',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], JobReferencesController.prototype, "archive", null);
JobReferencesController = __decorate([
    (0, common_1.Controller)('job-references'),
    (0, swagger_1.ApiTags)('job-references'),
    __metadata("design:paramtypes", [job_references_service_1.JobReferencesService])
], JobReferencesController);
exports.JobReferencesController = JobReferencesController;
//# sourceMappingURL=job-references.controller.js.map