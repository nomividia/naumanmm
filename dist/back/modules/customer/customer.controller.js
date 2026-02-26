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
exports.CustomerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const shared_constants_1 = require("../../../shared/shared-constants");
const address_entity_1 = require("../../entities/address.entity");
const app_error_1 = require("../../models/app-error");
const base_search_requests_1 = require("../../models/requests/base-search-requests");
const generic_response_1 = require("../../models/responses/generic-response");
const roles_guard_1 = require("../../services/guards/roles-guard");
const roles_decorator_1 = require("../../services/roles.decorator");
const base_controller_1 = require("../../shared/base.controller");
const job_reference_dto_1 = require("../job-references/job-reference-dto");
const customer_dto_1 = require("./customer.dto");
const customer_service_1 = require("./customer.service");
let CustomerController = class CustomerController extends base_controller_1.BaseController {
    constructor(customerService) {
        super();
        this.customerService = customerService;
    }
    getAll(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOptions = base_search_requests_1.BaseSearchRequest.getDefaultFindOptions(request);
            findOptions.relations = ['addresses'];
            if (request.includeCustomerFunction === 'true') {
                findOptions.relations.push('customerFunction');
            }
            if (request.search) {
                findOptions.where = [
                    {
                        firstName: (0, typeorm_1.Like)('%' + request.search + '%'),
                    },
                    {
                        lastName: (0, typeorm_1.Like)('%' + request.search + '%'),
                    },
                    {
                        companyName: (0, typeorm_1.Like)('%' + request.search + '%'),
                    },
                ];
            }
            if (request.countryCode) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                const locationCode = request.countryCode.split(',');
                if (locationCode.length) {
                    const addressTableName = (0, typeorm_1.getManager)().getRepository(address_entity_1.Address).metadata.tableName;
                    if (!request.city) {
                        for (const whereFilter of findOptions.where) {
                            whereFilter.id = (0, typeorm_1.Raw)((alias) => `(${alias} IN (SELECT customerId FROM \`${addressTableName}\` WHERE country IN("${locationCode.join('","')}") ))`);
                        }
                    }
                    if (request.city) {
                        for (const whereFilter of findOptions.where) {
                            whereFilter.id = (0, typeorm_1.Raw)((alias) => `(${alias} IN (SELECT customerId FROM \`${addressTableName}\` WHERE country IN("${locationCode.join('","')}") AND city LIKE '%${request.city}%' ))`);
                        }
                    }
                }
            }
            if (request.city && !request.countryCode) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                const addressTableName = (0, typeorm_1.getManager)().getRepository(address_entity_1.Address).metadata.tableName;
                for (const whereFilter of findOptions.where) {
                    whereFilter.id = (0, typeorm_1.Raw)((alias) => `(${alias} IN (SELECT customerId FROM \`${addressTableName}\` WHERE city LIKE '%${request.city}%'  ))`);
                }
            }
            if (request.isCompany === 'true' &&
                request.isPrivatePerson === 'false') {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                for (const whereFilter of findOptions.where) {
                    whereFilter.isCompany = true;
                }
            }
            if (request.isCompany === 'false' &&
                request.isPrivatePerson === 'true') {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                for (const whereFilter of findOptions.where) {
                    whereFilter.isPrivatePerson = true;
                }
            }
            return yield this.customerService.findAll(findOptions, request.consultantId);
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.customerService.findOne({ where: { id: id } });
        });
    }
    createOrUpdate(customerDto) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!customerDto) {
                throw new app_error_1.AppErrorWithMessage('Invalid Request');
            }
            return yield this.customerService.createOrUpdate(customerDto);
        });
    }
    delete(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.customerService.delete(ids.split(','));
        });
    }
    archive(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.customerService.archive(ids);
        });
    }
    createCustomerFromReference(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!request.jobReferenceDto) {
                throw new app_error_1.AppErrorWithMessage('Invalid Request');
            }
            return yield this.customerService.createCustomerFromReference(request);
        });
    }
    checkCustomerAlreadyCreateFromReference(jobReferenceDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.customerService.checkCustomerAlreadyCreateFromReference(jobReferenceDto);
        });
    }
};
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all customers',
        operationId: 'getAllCustomers',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get all Customers',
        type: customer_dto_1.GetCustomersResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_dto_1.CustomersRequest]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getAll", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer', operationId: 'getCustomer' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get customer',
        type: customer_dto_1.GetCustomerResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "get", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create or update customer',
        operationId: 'createOrUpdateCustomer',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Create or update customer',
        type: customer_dto_1.GetCustomerResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_dto_1.CustomerDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "createOrUpdate", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Delete)(':ids'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete customers',
        operationId: 'deleteCustomers',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Delete customers',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('archiveCustomer'),
    (0, swagger_1.ApiOperation)({
        summary: 'Archive customers',
        operationId: 'archiveCustomers',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Archive customers',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "archive", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.RH),
    (0, common_1.Post)('createCustomerFromReference'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'create customer from reference',
        operationId: 'createCustomerFromReference',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'create customer from reference',
        type: customer_dto_1.GetCustomerResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_dto_1.GenerateCustomerFromeReferenceRequest]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "createCustomerFromReference", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Post)('checkCustomerAlreadyCreateFromReference'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Check Customer Already Create From Reference',
        operationId: 'checkCustomerAlreadyCreateFromReference',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Check Customer Already Create From Reference',
        type: customer_dto_1.CustomerCreatedFromReferenceResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [job_reference_dto_1.JobReferenceDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "checkCustomerAlreadyCreateFromReference", null);
CustomerController = __decorate([
    (0, common_1.Controller)('customers'),
    (0, swagger_1.ApiTags)('customers'),
    __metadata("design:paramtypes", [customer_service_1.CustomerService])
], CustomerController);
exports.CustomerController = CustomerController;
//# sourceMappingURL=customer.controller.js.map