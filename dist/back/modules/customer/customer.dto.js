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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerCreatedFromReferenceResponse = exports.GenerateCustomerFromeReferenceRequest = exports.CustomersRequest = exports.GetCustomersResponse = exports.GetCustomerResponse = exports.CustomerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const address_dto_1 = require("../../models/dto/address-dto");
const app_value_dto_1 = require("../../models/dto/app-value-dto");
const base_search_requests_1 = require("../../models/requests/base-search-requests");
const base_search_responses_1 = require("../../models/responses/base-search-responses");
const generic_response_1 = require("../../models/responses/generic-response");
const job_reference_dto_1 = require("../job-references/job-reference-dto");
class CustomerDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CustomerDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CustomerDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CustomerDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CustomerDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CustomerDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => address_dto_1.AddressDto, isArray: true }),
    __metadata("design:type", Array)
], CustomerDto.prototype, "addresses", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], CustomerDto.prototype, "creationDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], CustomerDto.prototype, "modifDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], CustomerDto.prototype, "dateOfContact", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CustomerDto.prototype, "isPrivatePerson", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CustomerDto.prototype, "isCompany", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CustomerDto.prototype, "companyName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CustomerDto.prototype, "disabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CustomerDto.prototype, "contactFullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CustomerDto.prototype, "customerFunctionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", app_value_dto_1.AppValueDto)
], CustomerDto.prototype, "customerFunction", void 0);
exports.CustomerDto = CustomerDto;
class GetCustomerResponse extends generic_response_1.GenericResponse {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => CustomerDto }),
    __metadata("design:type", CustomerDto)
], GetCustomerResponse.prototype, "customer", void 0);
exports.GetCustomerResponse = GetCustomerResponse;
class GetCustomersResponse extends base_search_responses_1.BaseSearchResponse {
    constructor() {
        super(...arguments);
        this.customers = [];
    }
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => CustomerDto, isArray: true }),
    __metadata("design:type", Array)
], GetCustomersResponse.prototype, "customers", void 0);
exports.GetCustomersResponse = GetCustomersResponse;
class CustomersRequest extends base_search_requests_1.BaseSearchRequest {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter customer by country code' }),
    __metadata("design:type", String)
], CustomersRequest.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter customer by cities' }),
    __metadata("design:type", String)
], CustomersRequest.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'filter customer by id of the consultant',
    }),
    __metadata("design:type", String)
], CustomersRequest.prototype, "consultantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter customer by customer type' }),
    __metadata("design:type", String)
], CustomersRequest.prototype, "isCompany", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter customer by customer type' }),
    __metadata("design:type", String)
], CustomersRequest.prototype, "isPrivatePerson", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'include or not customer function' }),
    __metadata("design:type", String)
], CustomersRequest.prototype, "includeCustomerFunction", void 0);
exports.CustomersRequest = CustomersRequest;
class GenerateCustomerFromeReferenceRequest {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => job_reference_dto_1.JobReferencesDetailsDto }),
    __metadata("design:type", job_reference_dto_1.JobReferencesDetailsDto)
], GenerateCustomerFromeReferenceRequest.prototype, "jobReferenceDto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GenerateCustomerFromeReferenceRequest.prototype, "overwrite", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], GenerateCustomerFromeReferenceRequest.prototype, "customerId", void 0);
exports.GenerateCustomerFromeReferenceRequest = GenerateCustomerFromeReferenceRequest;
class CustomerCreatedFromReferenceResponse extends generic_response_1.GenericResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => CustomerDto, isArray: true }),
    __metadata("design:type", Array)
], CustomerCreatedFromReferenceResponse.prototype, "customers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], CustomerCreatedFromReferenceResponse.prototype, "alreadyExist", void 0);
exports.CustomerCreatedFromReferenceResponse = CustomerCreatedFromReferenceResponse;
//# sourceMappingURL=customer.dto.js.map