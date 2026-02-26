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
exports.NewsletterTemplatesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const shared_constants_1 = require("../../../shared/shared-constants");
const app_error_1 = require("../../models/app-error");
const base_search_requests_1 = require("../../models/requests/base-search-requests");
const generic_response_1 = require("../../models/responses/generic-response");
const roles_guard_1 = require("../../services/guards/roles-guard");
const roles_decorator_1 = require("../../services/roles.decorator");
const base_controller_1 = require("../../shared/base.controller");
const newsletter_template_dto_1 = require("./newsletter-template.dto");
const newsletter_templates_service_1 = require("./newsletter-templates.service");
let NewsletterTemplatesController = class NewsletterTemplatesController extends base_controller_1.BaseController {
    constructor(newsletterTemplatesService) {
        super();
        this.newsletterTemplatesService = newsletterTemplatesService;
    }
    getNewsletterTemplate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.newsletterTemplatesService.findOne({ where: { id } });
        });
    }
    getAllNewsletterTemplates(request) {
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
                ];
            }
            return yield this.newsletterTemplatesService.findAll(findOptions);
        });
    }
    deleteNewsletterTemplates(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.newsletterTemplatesService.delete(ids.split(','));
        });
    }
    archiveNewsletterTemplates(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.newsletterTemplatesService.archive(ids.split(','));
        });
    }
    createOrUpdateNewsletterTemplate(newsletterTemplateDto) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!newsletterTemplateDto) {
                throw new app_error_1.AppErrorWithMessage('Invalid Request');
            }
            return yield this.newsletterTemplatesService.createOrUpdate(newsletterTemplateDto);
        });
    }
};
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.Newsletter),
    (0, common_1.Get)('getNewsletterTemplate/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get newsletter template',
        operationId: 'getNewsletterTemplate',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get newsletter template',
        type: newsletter_template_dto_1.GetNewsletterTemplateResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NewsletterTemplatesController.prototype, "getNewsletterTemplate", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.Newsletter),
    (0, common_1.Get)('getAllNewsletterTemplates'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all newsletter templates',
        operationId: 'getAllNewsletterTemplates',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get all newsletter templates',
        type: newsletter_template_dto_1.GetNewsletterTemplatesResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [newsletter_template_dto_1.GetNewsletterTemplatesRequest]),
    __metadata("design:returntype", Promise)
], NewsletterTemplatesController.prototype, "getAllNewsletterTemplates", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.Newsletter),
    (0, common_1.Delete)('deleteNewsletterTemplates/:ids'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete newsletter templates',
        operationId: 'deleteNewsletterTemplates',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Delete newsletter templates',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NewsletterTemplatesController.prototype, "deleteNewsletterTemplates", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.Newsletter),
    (0, common_1.Post)('archiveNewsletterTemplates/:ids'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Archive newsletter templates',
        operationId: 'archiveNewsletterTemplates',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'archive newsletter templates',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NewsletterTemplatesController.prototype, "archiveNewsletterTemplates", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.Newsletter),
    (0, common_1.Post)('createOrUpdateNewsletterTemplate'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create or update newsletter template',
        operationId: 'createOrUpdateNewsletterTemplate',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Create or update newsletter template',
        type: newsletter_template_dto_1.GetNewsletterTemplateResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [newsletter_template_dto_1.NewsletterTemplateDto]),
    __metadata("design:returntype", Promise)
], NewsletterTemplatesController.prototype, "createOrUpdateNewsletterTemplate", null);
NewsletterTemplatesController = __decorate([
    (0, common_1.Controller)('newsletter-templates'),
    (0, swagger_1.ApiTags)('newsletter-templates'),
    __metadata("design:paramtypes", [newsletter_templates_service_1.NewsletterTemplatesService])
], NewsletterTemplatesController);
exports.NewsletterTemplatesController = NewsletterTemplatesController;
//# sourceMappingURL=newsletter-templates.controller.js.map