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
exports.JobOfferController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const shared_constants_1 = require("../../../shared/shared-constants");
const app_error_1 = require("../../models/app-error");
const base_search_requests_1 = require("../../models/requests/base-search-requests");
const generic_response_1 = require("../../models/responses/generic-response");
const auth_tools_service_1 = require("../../services/auth-tools.service");
const roles_guard_1 = require("../../services/guards/roles-guard");
const referential_service_1 = require("../../services/referential.service");
const roles_decorator_1 = require("../../services/roles.decorator");
const base_controller_1 = require("../../shared/base.controller");
const job_offer_dto_1 = require("./job-offer-dto");
const job_offers_service_1 = require("./job-offers.service");
let JobOfferController = class JobOfferController extends base_controller_1.BaseController {
    constructor(jobOfferService, referentialService, authToolsService) {
        super();
        this.jobOfferService = jobOfferService;
        this.referentialService = referentialService;
        this.authToolsService = authToolsService;
    }
    getAll(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOptions = base_search_requests_1.BaseSearchRequest.getDefaultFindOptions(request);
            if (request.search) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                findOptions.where = [
                    {
                        ref: (0, typeorm_1.Like)('%' + request.search + '%'),
                    },
                    {
                        city: (0, typeorm_1.Like)('%' + request.search + '%'),
                    },
                    {
                        title: (0, typeorm_1.Like)('%' + request.search + '%'),
                    },
                ];
            }
            if (request.jobIds) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                const jobIds = request.jobIds.split(',');
                for (const whereFilter of findOptions.where) {
                    whereFilter.jobId = (0, typeorm_1.In)(jobIds);
                }
            }
            if (request.countryCode) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                const countriesCode = request.countryCode.split(',');
                for (const whereFilter of findOptions.where) {
                    whereFilter.country = (0, typeorm_1.In)(countriesCode);
                }
            }
            if (request.consultantIds) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                const consultantIds = request.consultantIds.split(',');
                for (const whereFilter of findOptions.where) {
                    whereFilter.consultantId = (0, typeorm_1.In)(consultantIds);
                }
            }
            if (request.applyInCouple) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                for (const whereFilter of findOptions.where) {
                    whereFilter.applyInCouple =
                        request.applyInCouple === 'true' ? true : false;
                }
            }
            if (request.city) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                for (const whereFilter of findOptions.where) {
                    whereFilter.city = request.city;
                }
            }
            if (request.contractTypeId) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                for (const whereFilter of findOptions.where) {
                    whereFilter.contractTypeId = request.contractTypeId;
                }
            }
            if (request.status) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                if (request.status === 'true') {
                    for (const whereFilter of findOptions.where) {
                        whereFilter.disabled = false;
                    }
                }
                else if (request.status === 'false') {
                    for (const whereFilter of findOptions.where) {
                        whereFilter.disabled = true;
                    }
                }
            }
            if (request.customerIds) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                const customerIds = request.customerIds.split(',');
                for (const whereFilter of findOptions.where) {
                    whereFilter.customerId = (0, typeorm_1.In)(customerIds);
                }
            }
            if (request.contractTypeIds) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                const contractTypeIds = request.contractTypeIds.split(',');
                for (const whereFilter of findOptions.where) {
                    whereFilter.contractTypeId = (0, typeorm_1.In)(contractTypeIds);
                }
            }
            if (request.stateId) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                for (const whereFilter of findOptions.where) {
                    whereFilter.stateId = request.stateId;
                }
            }
            if (request.excludePlacedJobOffers === 'true') {
                return yield this.jobOfferService.findAllExcludingPlaced(findOptions);
            }
            return yield this.jobOfferService.findAll(findOptions);
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.jobOfferService.findOne({
                where: { id: id },
                relations: ['job', 'job.translations'],
            });
        });
    }
    getJobOfferByRef(ref) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.jobOfferService.findOne({ where: { ref: ref } });
        });
    }
    getJobOfferByRefLike(ref) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new job_offer_dto_1.GetJobOfferResponse();
            response.success = true;
            response.jobOffer = null;
            const jobOfferStatesResponse = yield this.referentialService.getTypeValues({
                appTypeCode: shared_constants_1.AppTypes.JobOfferStateCode,
            });
            const stateActivated = (_b = (_a = jobOfferStatesResponse === null || jobOfferStatesResponse === void 0 ? void 0 : jobOfferStatesResponse.appType) === null || _a === void 0 ? void 0 : _a.appValues) === null || _b === void 0 ? void 0 : _b.find((x) => x.code === shared_constants_1.JobOfferState.Activated);
            if (!(stateActivated === null || stateActivated === void 0 ? void 0 : stateActivated.id)) {
                return response;
            }
            return yield this.jobOfferService.findOne({
                where: {
                    ref: (0, typeorm_1.Like)(ref + '%'),
                    disabled: false,
                    stateId: stateActivated === null || stateActivated === void 0 ? void 0 : stateActivated.id,
                },
            });
        });
    }
    createOrUpdate(jobOfferDto) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!jobOfferDto) {
                throw new app_error_1.AppErrorWithMessage('Invalid Request');
            }
            return yield this.jobOfferService.createOrUpdate(jobOfferDto);
        });
    }
    delete(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.jobOfferService.delete(ids.split(','));
        });
    }
    sendJobOfferByMail(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = this.authToolsService.getCurrentPayload(false);
            return yield this.jobOfferService.sendJobOfferByMail(request, payload === null || payload === void 0 ? void 0 : payload.mail);
        });
    }
    redirectByRef(ref) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const jobOffer = yield this.jobOfferService.findOne({
                where: { ref: ref },
            });
            if ((jobOffer === null || jobOffer === void 0 ? void 0 : jobOffer.success) && ((_a = jobOffer === null || jobOffer === void 0 ? void 0 : jobOffer.jobOffer) === null || _a === void 0 ? void 0 : _a.id)) {
                return { url: `/offres-emplois/${jobOffer.jobOffer.id}` };
            }
            return { url: '/not-found' };
        });
    }
};
__decorate([
    (0, common_1.Get)('getAll'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all job offers',
        operationId: 'getAllJobOffers',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get All Job Offers',
        type: job_offer_dto_1.GetJobOffersResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [job_offer_dto_1.GetJobOfferRequest]),
    __metadata("design:returntype", Promise)
], JobOfferController.prototype, "getAll", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Get)('get/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get job offer', operationId: 'getJobOffer' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get job offer',
        type: job_offer_dto_1.GetJobOfferResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JobOfferController.prototype, "get", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Get)('getJobOfferByRef/:ref'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get job offer', operationId: 'getJobOfferByRef' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get job offer by ref',
        type: job_offer_dto_1.GetJobOfferResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('ref')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JobOfferController.prototype, "getJobOfferByRef", null);
__decorate([
    (0, common_1.Get)('getJobOfferByRefLike/:ref'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get job offer',
        operationId: 'getJobOfferByRefLike',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get job offer by ref',
        type: job_offer_dto_1.GetJobOfferResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('ref')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JobOfferController.prototype, "getJobOfferByRefLike", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Post)('createOrUpdate'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create or update job offer',
        operationId: 'createOrUpdateJobOffer',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Create or update job offer',
        type: job_offer_dto_1.GetJobOfferResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [job_offer_dto_1.JobOfferDto]),
    __metadata("design:returntype", Promise)
], JobOfferController.prototype, "createOrUpdate", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.AdminTech),
    (0, common_1.Delete)('delete/:ids'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete job offers',
        operationId: 'deleteJobOffers',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Delete candidates',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JobOfferController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Get)('sendJobOfferByMail'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Send job offer by email',
        operationId: 'sendJobOfferByMail',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Send job offer by email',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [job_offer_dto_1.SendJobOfferByMailRequest]),
    __metadata("design:returntype", Promise)
], JobOfferController.prototype, "sendJobOfferByMail", null);
__decorate([
    (0, common_1.Get)('public/redirect-by-ref/:ref'),
    (0, swagger_1.ApiOperation)({
        summary: 'Redirect to job offer page by reference',
        operationId: 'redirectByRef',
    }),
    (0, swagger_1.ApiResponse)({
        status: 302,
        description: 'Redirect to job offer page',
    }),
    (0, common_1.HttpCode)(302),
    __param(0, (0, common_1.Param)('ref')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JobOfferController.prototype, "redirectByRef", null);
JobOfferController = __decorate([
    (0, common_1.Controller)('job-offers'),
    (0, swagger_1.ApiTags)('job-offers'),
    __metadata("design:paramtypes", [job_offers_service_1.JobOfferService,
        referential_service_1.ReferentialService,
        auth_tools_service_1.AuthToolsService])
], JobOfferController);
exports.JobOfferController = JobOfferController;
//# sourceMappingURL=job-offers.controller.js.map