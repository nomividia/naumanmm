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
exports.NewsletterController = void 0;
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
const helpers_service_1 = require("../../services/tools/helpers.service");
const base_controller_1 = require("../../shared/base.controller");
const newsletter_dto_1 = require("./newsletter.dto");
const newsletter_service_1 = require("./newsletter.service");
let NewsletterController = class NewsletterController extends base_controller_1.BaseController {
    constructor(newsletterService, referentialService, authToolsService) {
        super();
        this.newsletterService = newsletterService;
        this.referentialService = referentialService;
        this.authToolsService = authToolsService;
    }
    previewNewsletter(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.newsletterService.previewNewsletter(id);
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.newsletterService.findOne({ where: { id } });
        });
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
                        content: (0, typeorm_1.Like)('%' + request.search + '%'),
                    },
                    {
                        title: (0, typeorm_1.Like)('%' + request.search + '%'),
                    },
                    {
                        subject: (0, typeorm_1.Like)('%' + request.search + '%'),
                    },
                ];
            }
            if (request.statusIdList) {
                const statusIdList = request.statusIdList.split(',');
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                for (const whereFilter of findOptions.where) {
                    whereFilter.newsletterStatusId = (0, typeorm_1.In)(statusIdList);
                }
            }
            if (request.month && request.year) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                for (const where of findOptions.where) {
                    where.creationDate = (0, typeorm_1.Raw)((alias) => `${alias} IS NOT NULL AND MONTH(${alias})=${helpers_service_1.ApiMainHelpers.mysql_real_escape_string(request.month)}  AND YEAR(${alias})=${helpers_service_1.ApiMainHelpers.mysql_real_escape_string(request.year)}`);
                }
            }
            else if (request.year) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                for (const where of findOptions.where) {
                    where.creationDate = (0, typeorm_1.Raw)((alias) => `${alias} IS NOT NULL AND YEAR(${alias})=${helpers_service_1.ApiMainHelpers.mysql_real_escape_string(request.year)}`);
                }
            }
            return yield this.newsletterService.findAll(findOptions);
        });
    }
    delete(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.newsletterService.delete(ids.split(','));
        });
    }
    archive(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.newsletterService.archiveNewslettersStatus(id);
        });
    }
    createOrUpdate(newsletterDto) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!newsletterDto) {
                throw new app_error_1.AppErrorWithMessage('Invalid Request');
            }
            const payload = this.authToolsService.getCurrentPayload(false);
            return yield this.newsletterService.createOrUpdate(newsletterDto, payload === null || payload === void 0 ? void 0 : payload.mail);
        });
    }
    sendNewsletter(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new app_error_1.AppErrorWithMessage('Invalid Request');
            }
            const payload = this.authToolsService.getCurrentPayload(false);
            return yield this.newsletterService.sendNewsletter(id, payload === null || payload === void 0 ? void 0 : payload.mail);
        });
    }
    getNewsletterCandidates(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!request) {
                throw new app_error_1.AppErrorWithMessage('Invalid Request');
            }
            return yield this.newsletterService.getNewsletterCandidates(request, false);
        });
    }
    getNewsletterCandidateApplications(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!request) {
                throw new app_error_1.AppErrorWithMessage('Invalid Request');
            }
            return yield this.newsletterService.getNewsletterCandidateApplications(request, false);
        });
    }
    duplicateNewsletter(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new app_error_1.AppErrorWithMessage('Invalid Request');
            }
            return yield this.newsletterService.duplicateNewsletter(id);
        });
    }
    unsubscribeFromNewsletter(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(request === null || request === void 0 ? void 0 : request.guid)) {
                throw new app_error_1.AppErrorWithMessage('Invalid Request');
            }
            return yield this.newsletterService.unsubscribeFromNewsletter(request);
        });
    }
};
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.Newsletter),
    (0, common_1.Get)('previewNewsletter/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'previewNewsletter',
        operationId: 'previewNewsletter',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'previewNewsletter',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "previewNewsletter", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.Newsletter),
    (0, common_1.Get)('get/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get newsletter', operationId: 'getNewsletter' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get newsletter',
        type: newsletter_dto_1.GetNewsletterResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "get", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.Newsletter),
    (0, common_1.Get)('getAll'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all newsletters',
        operationId: 'getAllNewsletters',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get all Newsletters',
        type: newsletter_dto_1.GetNewslettersResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [newsletter_dto_1.GetNewslettersRequest]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "getAll", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.AdminTech),
    (0, common_1.Delete)('delete/:ids'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete newsletters',
        operationId: 'deleteNewsletters',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Delete newsletters',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.AdminTech),
    (0, common_1.Post)('archive/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'archive newsletter',
        operationId: 'archiveNewsletter',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'archive newsletter',
        type: newsletter_dto_1.GetNewsletterResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "archive", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.Newsletter),
    (0, common_1.Post)('createOrUpdate'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create or update newsletter',
        operationId: 'createOrUpdateNewsletter',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Create or update newsletter',
        type: newsletter_dto_1.GetNewsletterResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [newsletter_dto_1.NewsletterDto]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "createOrUpdate", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.Newsletter),
    (0, common_1.Post)('sendNewsletter/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'send Newsletter', operationId: 'sendNewsletter' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'send Newsletter',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "sendNewsletter", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.Newsletter),
    (0, common_1.Post)('getNewsletterCandidates'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'count candidates for newletter ',
        operationId: 'getNewsletterCandidates',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'count candidates for newletter',
        type: newsletter_dto_1.GetCandidatesCountResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [newsletter_dto_1.GetCandidatesCountRequest]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "getNewsletterCandidates", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.Newsletter),
    (0, common_1.Post)('getNewsletterCandidateApplications'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'count candidate applications for newletter ',
        operationId: 'getNewsletterCandidateApplications',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'count candidate applications for newletter',
        type: newsletter_dto_1.GetNewsletterCandidateApplicationsResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [newsletter_dto_1.GetNewsletterCandidateApplicationsRequest]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "getNewsletterCandidateApplications", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.Newsletter),
    (0, common_1.Post)('duplicateNewsletter/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'duplicate Newsletter',
        operationId: 'duplicateNewsletter',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'duplicate Newsletter',
        type: newsletter_dto_1.GetNewsletterResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "duplicateNewsletter", null);
__decorate([
    (0, common_1.Post)('unsubscribeFromNewsletter'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'unsubscribe from newsletter',
        operationId: 'unsubscribeFromNewsletter',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'unsubscribe from newsletter',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [newsletter_dto_1.UnsubscribeFromNewsletterRequest]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "unsubscribeFromNewsletter", null);
NewsletterController = __decorate([
    (0, common_1.Controller)('newsletter'),
    (0, swagger_1.ApiTags)('newsletter'),
    __metadata("design:paramtypes", [newsletter_service_1.NewsletterService,
        referential_service_1.ReferentialService,
        auth_tools_service_1.AuthToolsService])
], NewsletterController);
exports.NewsletterController = NewsletterController;
//# sourceMappingURL=newsletter.controller.js.map