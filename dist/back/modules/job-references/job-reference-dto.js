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
exports.GetJobReferencesDetailsDtoResponse = exports.JobReferencesDetailsDto = exports.GetJobReferencesDetailsRequest = exports.GetJobReferencesDistinctRequest = exports.GetJobReferencesRequest = exports.GetJobReferencesDistinctResponse = exports.GetJobReferencesResponse = exports.GetJobReferenceResponse = exports.JobReferenceDistinctDto = exports.CreateJobReferenceRequest = exports.JobReferenceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const address_dto_1 = require("../../models/dto/address-dto");
const app_value_dto_1 = require("../../models/dto/app-value-dto");
const base_search_requests_1 = require("../../models/requests/base-search-requests");
const base_search_responses_1 = require("../../models/responses/base-search-responses");
const generic_response_1 = require("../../models/responses/generic-response");
class JobReferenceDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], JobReferenceDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobReferenceDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobReferenceDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => address_dto_1.AddressDto, isArray: true }),
    __metadata("design:type", Array)
], JobReferenceDto.prototype, "addresses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], JobReferenceDto.prototype, "jobRefFunctionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => app_value_dto_1.AppValueDto }),
    __metadata("design:type", app_value_dto_1.AppValueDto)
], JobReferenceDto.prototype, "jobRefFunction", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobReferenceDto.prototype, "otherFunction", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], JobReferenceDto.prototype, "candidateAcceptContact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], JobReferenceDto.prototype, "isPrivatePerson", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], JobReferenceDto.prototype, "isCompany", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobReferenceDto.prototype, "privatePersonFirstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobReferenceDto.prototype, "privatePersonLastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobReferenceDto.prototype, "companyName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobReferenceDto.prototype, "note", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], JobReferenceDto.prototype, "disabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], JobReferenceDto.prototype, "customerHasBeenCreated", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobReferenceDto.prototype, "contactFullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobReferenceDto.prototype, "jobReferenceId", void 0);
exports.JobReferenceDto = JobReferenceDto;
class CreateJobReferenceRequest {
}
exports.CreateJobReferenceRequest = CreateJobReferenceRequest;
class JobReferenceDistinctDto extends JobReferenceDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], JobReferenceDistinctDto.prototype, "referenceName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobReferenceDistinctDto.prototype, "country", void 0);
exports.JobReferenceDistinctDto = JobReferenceDistinctDto;
class GetJobReferenceResponse extends generic_response_1.GenericResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => JobReferenceDto }),
    __metadata("design:type", JobReferenceDto)
], GetJobReferenceResponse.prototype, "jobReference", void 0);
exports.GetJobReferenceResponse = GetJobReferenceResponse;
class GetJobReferencesResponse extends base_search_responses_1.BaseSearchResponse {
    constructor() {
        super(...arguments);
        this.jobReferences = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => JobReferenceDto, isArray: true }),
    __metadata("design:type", Array)
], GetJobReferencesResponse.prototype, "jobReferences", void 0);
exports.GetJobReferencesResponse = GetJobReferencesResponse;
class GetJobReferencesDistinctResponse extends base_search_responses_1.BaseSearchResponse {
    constructor() {
        super(...arguments);
        this.jobReferences = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => JobReferenceDistinctDto, isArray: true }),
    __metadata("design:type", Array)
], GetJobReferencesDistinctResponse.prototype, "jobReferences", void 0);
exports.GetJobReferencesDistinctResponse = GetJobReferencesDistinctResponse;
class GetJobReferencesRequest extends base_search_requests_1.BaseSearchRequest {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter job reference by function' }),
    __metadata("design:type", String)
], GetJobReferencesRequest.prototype, "functionIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'filter job reference by country code',
    }),
    __metadata("design:type", String)
], GetJobReferencesRequest.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'filter job reference witch accepted to be contact',
    }),
    __metadata("design:type", String)
], GetJobReferencesRequest.prototype, "acceptToBeContact", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter by city' }),
    __metadata("design:type", String)
], GetJobReferencesRequest.prototype, "city", void 0);
exports.GetJobReferencesRequest = GetJobReferencesRequest;
class GetJobReferencesDistinctRequest extends base_search_requests_1.BaseSearchRequest {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'select job reference by country code',
    }),
    __metadata("design:type", String)
], GetJobReferencesDistinctRequest.prototype, "countriesCodes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'select job reference where are companies',
    }),
    __metadata("design:type", String)
], GetJobReferencesDistinctRequest.prototype, "isCompany", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'select job reference where are privates persons',
    }),
    __metadata("design:type", String)
], GetJobReferencesDistinctRequest.prototype, "isPrivatePerson", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'select job reference not disabled' }),
    __metadata("design:type", String)
], GetJobReferencesDistinctRequest.prototype, "disabled", void 0);
exports.GetJobReferencesDistinctRequest = GetJobReferencesDistinctRequest;
class GetJobReferencesDetailsRequest extends base_search_requests_1.BaseSearchRequest {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'select job reference by country' }),
    __metadata("design:type", String)
], GetJobReferencesDetailsRequest.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'select job reference by company name',
    }),
    __metadata("design:type", String)
], GetJobReferencesDetailsRequest.prototype, "company", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'select job reference by private persone firstName',
    }),
    __metadata("design:type", String)
], GetJobReferencesDetailsRequest.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'select job reference by private persone firstName',
    }),
    __metadata("design:type", String)
], GetJobReferencesDetailsRequest.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'select job reference not disabled' }),
    __metadata("design:type", String)
], GetJobReferencesDetailsRequest.prototype, "disabled", void 0);
exports.GetJobReferencesDetailsRequest = GetJobReferencesDetailsRequest;
class JobReferencesDetailsDto extends JobReferenceDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobReferencesDetailsDto.prototype, "line1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobReferencesDetailsDto.prototype, "line2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobReferencesDetailsDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobReferencesDetailsDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobReferencesDetailsDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobReferencesDetailsDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobReferencesDetailsDto.prototype, "jobFunction", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobReferencesDetailsDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobReferencesDetailsDto.prototype, "candidateIdFromJobs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], JobReferencesDetailsDto.prototype, "jobRefId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobReferencesDetailsDto.prototype, "functionLabel", void 0);
exports.JobReferencesDetailsDto = JobReferencesDetailsDto;
class GetJobReferencesDetailsDtoResponse extends base_search_responses_1.BaseSearchResponse {
    constructor() {
        super(...arguments);
        this.jobReferences = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => JobReferencesDetailsDto, isArray: true }),
    __metadata("design:type", Array)
], GetJobReferencesDetailsDtoResponse.prototype, "jobReferences", void 0);
exports.GetJobReferencesDetailsDtoResponse = GetJobReferencesDetailsDtoResponse;
//# sourceMappingURL=job-reference-dto.js.map