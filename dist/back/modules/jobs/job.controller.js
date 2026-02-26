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
exports.JobsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shared_constants_1 = require("../../../shared/shared-constants");
const base_search_requests_1 = require("../../models/requests/base-search-requests");
const generic_response_1 = require("../../models/responses/generic-response");
const roles_guard_1 = require("../../services/guards/roles-guard");
const roles_decorator_1 = require("../../services/roles.decorator");
const helpers_service_1 = require("../../services/tools/helpers.service");
const base_controller_1 = require("../../shared/base.controller");
const job_dto_1 = require("./job-dto");
const jobs_responses_1 = require("./jobs-responses");
const jobs_service_1 = require("./jobs.service");
let JobsController = class JobsController extends base_controller_1.BaseController {
    constructor(jobsService) {
        super();
        this.jobsService = jobsService;
    }
    get(jobId, includeJobHistory) {
        return __awaiter(this, void 0, void 0, function* () {
            const getOneResponse = yield this.jobsService.findOne({
                where: { id: jobId },
                relations: includeJobHistory === 'true' ? ['jobHistory'] : [],
            });
            getOneResponse.isOnMainWorker = helpers_service_1.ApiMainHelpers.isMainWorker();
            return getOneResponse;
        });
    }
    getAll(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOptions = base_search_requests_1.BaseSearchRequest.getDefaultFindOptions(request);
            return yield this.jobsService.findAll(findOptions, true);
        });
    }
    createOrUpdate(job) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.jobsService.createOrUpdate(job);
        });
    }
    deleteJobs(jobIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const splitted = jobIds.split(';');
            return yield this.jobsService.deleteJobs(splitted);
        });
    }
    triggerJob(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.jobsService.triggerJob(jobId);
        });
    }
};
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.AdminTech),
    (0, common_1.Get)(':jobId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get job', operationId: 'getJob' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Job', type: jobs_responses_1.GetJobResponse }),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiQuery)({ name: 'includeJobHistory', required: false, type: String }),
    __param(0, (0, common_1.Param)('jobId')),
    __param(1, (0, common_1.Query)('includeJobHistory')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "get", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.AdminTech),
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all jobs', operationId: 'getAllJobs' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get all jobs',
        type: jobs_responses_1.GetJobsResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_search_requests_1.BaseSearchRequest]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "getAll", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.AdminTech),
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create or update job',
        operationId: 'createOrUpdateJob',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'GetJobResponse',
        type: jobs_responses_1.GetJobResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [job_dto_1.JobDto]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "createOrUpdate", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.AdminTech),
    (0, common_1.Delete)(':jobIds'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete job', operationId: 'deleteJobs' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Delete job GenericResponse',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('jobIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "deleteJobs", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.AdminTech),
    (0, common_1.Post)('triggerJob/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Trigger job', operationId: 'triggerJob' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Generic response',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "triggerJob", null);
JobsController = __decorate([
    (0, common_1.Controller)('jobs'),
    (0, swagger_1.ApiTags)('jobs'),
    __metadata("design:paramtypes", [jobs_service_1.JobsService])
], JobsController);
exports.JobsController = JobsController;
//# sourceMappingURL=job.controller.js.map