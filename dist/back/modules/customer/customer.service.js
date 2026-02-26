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
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
const typeorm_2 = require("typeorm");
const app_error_1 = require("../../models/app-error");
const address_dto_1 = require("../../models/dto/address-dto");
const base_model_service_1 = require("../../services/base-model.service");
const job_offers_service_1 = require("../job-offers/job-offers.service");
const customer_dto_1 = require("./customer.dto");
const customer_entity_1 = require("./customer.entity");
let CustomerService = class CustomerService extends base_model_service_1.ApplicationBaseModelService {
    constructor(repository, jobOfferService) {
        super();
        this.repository = repository;
        this.jobOfferService = jobOfferService;
        this.modelOptions = {
            getManyResponse: customer_dto_1.GetCustomersResponse,
            getOneResponse: customer_dto_1.GetCustomerResponse,
            getManyResponseField: 'customers',
            getOneResponseField: 'customer',
            getManyRelations: [],
            getOneRelations: ['addresses', 'customerFunction'],
            repository: this.repository,
            entity: customer_entity_1.Customer,
            archiveField: 'disabled',
            archiveFieldValue: true,
        };
    }
    findAll(conditions, consultantId, ...toDtoParameters) {
        const _super = Object.create(null, {
            findAll: { get: () => super.findAll }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (consultantId) {
                    if (!conditions.where) {
                        conditions.where = [{}];
                    }
                    const getJobOffersResponse = yield this.jobOfferService.findAll({ where: { consultantId } });
                    const customerIds = getJobOffersResponse.jobOffers.map((x) => x.customerId);
                    for (const whereItem of conditions.where) {
                        whereItem.id = (0, typeorm_2.Raw)((alias) => `${alias} IN ("${customerIds.join('","')}" )`);
                    }
                }
            }
            catch (err) {
                console.log('\n \n ~ file: customer.service.ts ~ line 44 ~ CustomerService ~ findAll ~ err', err);
                throw new app_error_1.AppErrorWithMessage('error');
            }
            return _super.findAll.call(this, conditions, toDtoParameters);
        });
    }
    createCustomerFromReference(request) {
        const _super = Object.create(null, {
            findOne: { get: () => super.findOne },
            createOrUpdate: { get: () => super.createOrUpdate }
        });
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new customer_dto_1.GetCustomerResponse();
            try {
                let customer;
                const test = request.jobReferenceDto;
                console.log('🚀 ~ CustomerService ~ createCustomerFromReference ~ test', test.line1);
                if (!request.overwrite) {
                    customer = new customer_dto_1.CustomerDto();
                    customer.addresses = [];
                    console.log('\x1b[36m%s\x1b[35m', 'CREATE NEW CUSTOMER');
                }
                else {
                    const findCustomerWithJobReferenceData = yield _super.findOne.call(this, {
                        where: { id: request.customerId },
                        relations: ['addresses'],
                    });
                    customer = nextalys_js_helpers_1.MainHelpers.cloneObject(findCustomerWithJobReferenceData.customer);
                    console.log('\x1b[36m%s\x1b[35m', 'OVERWRITE CUSTOMER', customer);
                }
                if (customer === null || customer === undefined) {
                    throw new app_error_1.AppErrorWithMessage('Une erreur est survenue');
                    return;
                }
                if (request.jobReferenceDto.isPrivatePerson) {
                    customer.firstName =
                        (_a = request.jobReferenceDto.privatePersonFirstName) !== null && _a !== void 0 ? _a : '';
                    customer.lastName =
                        (_b = request.jobReferenceDto.privatePersonLastName) !== null && _b !== void 0 ? _b : '';
                    customer.isPrivatePerson =
                        request.jobReferenceDto.isPrivatePerson;
                    customer.isCompany = false;
                    customer.customerFunctionId =
                        request.jobReferenceDto.jobRefFunctionId;
                    customer.contactFullName =
                        request.jobReferenceDto.contactFullName;
                }
                if (request.jobReferenceDto.isCompany) {
                    customer.companyName =
                        (_c = request.jobReferenceDto.companyName) !== null && _c !== void 0 ? _c : '';
                    customer.isCompany = request.jobReferenceDto.isCompany;
                    customer.isPrivatePerson = false;
                    customer.customerFunctionId =
                        request.jobReferenceDto.jobRefFunctionId;
                    customer.contactFullName =
                        request.jobReferenceDto.contactFullName;
                }
                customer.phone = request.jobReferenceDto.phone;
                customer.email = request.jobReferenceDto.email;
                customer.disabled = false;
                const customerAddress = new address_dto_1.AddressDto();
                customerAddress.lineOne = request.jobReferenceDto.line1;
                customerAddress.lineTwo = request.jobReferenceDto.line2;
                customerAddress.department = request.jobReferenceDto.department;
                customerAddress.postalCode = request.jobReferenceDto.postalCode;
                customerAddress.city = request.jobReferenceDto.city;
                customerAddress.country = request.jobReferenceDto.country;
                console.log('🚀 ~ CustomerService ~ createCustomerFromReference ~ customerAddress', customerAddress);
                customer.addresses.push(customerAddress);
                yield _super.createOrUpdate.call(this, customer);
                response.customer = customer;
                console.log('🚀 ~ CustomerService ~ createCustomerFromReference ~ customer', customer);
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    checkCustomerAlreadyCreateFromReference(jobReferenceDto) {
        const _super = Object.create(null, {
            findAll: { get: () => super.findAll }
        });
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new customer_dto_1.CustomerCreatedFromReferenceResponse();
            response.customers = [];
            response.alreadyExist = false;
            try {
                console.log(jobReferenceDto);
                let findCustomerWithJobReferenceData;
                if (jobReferenceDto.isPrivatePerson) {
                    findCustomerWithJobReferenceData = yield _super.findAll.call(this, {
                        where: {
                            lastName: jobReferenceDto.privatePersonLastName,
                            firstName: jobReferenceDto.privatePersonFirstName,
                        },
                        relations: ['addresses'],
                    });
                }
                if (jobReferenceDto.isCompany) {
                    findCustomerWithJobReferenceData = yield _super.findAll.call(this, {
                        where: { companyName: jobReferenceDto.companyName },
                        relations: ['addresses'],
                    });
                }
                if (!findCustomerWithJobReferenceData.success) {
                    response.message = findCustomerWithJobReferenceData.message;
                    return;
                }
                if ((_a = findCustomerWithJobReferenceData.customers) === null || _a === void 0 ? void 0 : _a.length) {
                    response.alreadyExist = true;
                    response.customers = findCustomerWithJobReferenceData.customers;
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
CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        job_offers_service_1.JobOfferService])
], CustomerService);
exports.CustomerService = CustomerService;
//# sourceMappingURL=customer.service.js.map